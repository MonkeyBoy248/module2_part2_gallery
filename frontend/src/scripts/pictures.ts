const galleryPhotos = document.querySelector('.gallery__photos') as HTMLElement;
const galleryTemplate = document.querySelector('.gallery__template') as HTMLTemplateElement;
const pagesLinksList = document.querySelector('.gallery__links-list') as HTMLElement;
const galleryErrorMessage = document.querySelector('.gallery__error-message') as HTMLElement;
const galleryErrorContainer = document.querySelector('.gallery__error') as HTMLElement;
const galleryPopup = document.querySelector('.gallery__error-pop-up') as HTMLElement;
const galleryLinkTemplate = document.querySelector('.gallery__link-template') as HTMLTemplateElement;
const galleryEventsArray: CustomEventListener[] = [
  {target: document, type: 'DOMContentLoaded', handler: getCurrentPageImages},
  {target: pagesLinksList, type: 'click', handler: changeCurrentPage},
  {target: galleryErrorContainer, type: 'click', handler: redirectToTheTargetPage}
]

interface GalleryData {
  objects: string[];
  page: number;
  total: number;
}

async function getPicturesData (url: string): Promise<void>{
  const tokenObject = Token.getToken();
  const tokenProperty = tokenObject?.token;

  if (tokenObject) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: tokenProperty,
        },
      })
      
      if (response.status === 403) {
        throw new TokenError();
      }
      
      const data: GalleryData = await response.json();
      
      createPictureTemplate(data);
      createLinksTemplate(data.total);
      setPageNumber();
    } catch (err){
        if (err instanceof SyntaxError) {
          const nonexistentPageNumber = url.slice(url.indexOf('=') + 1);

          createErrorMessageTemplate(
            `There is no page with number ${nonexistentPageNumber}.`, 
            'wrong-page-number',
            'page 1'
          )
        } else {
          createErrorMessageTemplate(
            'Invalid token. Please, log in',
            'invalid-token',
            'authentication page'
          );
        }

        console.log(err);
    }
  }
}

function redirectToTheTargetPage (e: Event) {
  e.preventDefault();
  const target = e.target as HTMLElement;

  ListenerRemover.removeEventListeners(galleryEventsArray);

  if (target.getAttribute('error-type') === 'wrong-page-number') {
    window.location.replace('index.html?page=1')
  } else {
    window.location.replace(`authentication.html?currentPage=${currentUrl.searchParams.get('page')}`);
  }
}

function createPictureTemplate (pictures: GalleryData): void {
  galleryPhotos.innerHTML = ''

  for (let object of pictures.objects) {
    const picture = galleryTemplate.content.cloneNode(true) as HTMLElement;
    const imageWrapper = picture.children[0];
    const image = imageWrapper.querySelector('.gallery__img') as HTMLElement;
    
    image.setAttribute('src', `resources/api_images/${object}`);
    galleryPhotos.insertAdjacentElement('beforeend', imageWrapper);
  }
}

function createLinksTemplate (total: number): void {
  pagesLinksList.innerHTML = '';

  for (let i = 0; i < total; i++) {
    const linkWrapper = galleryLinkTemplate.content.cloneNode(true) as HTMLElement;
    const listItem = linkWrapper.children[0] as HTMLElement;
    const link = listItem.querySelector('a');
    
    if (link) {
      link.textContent = `${i + 1}`;
      pagesLinksList.append(listItem);
      pagesLinksList.children[0].classList.add('active');
    }
  }
}

function createErrorMessageTemplate (message: string, errType: string, targetPage: string) {
  const galleryErrorRedirectLink = document.createElement('a');

  galleryErrorRedirectLink.href = '';
  galleryErrorRedirectLink.className = 'gallery__error-redirect-link';
  galleryErrorRedirectLink.textContent = `Go back to the ${targetPage}`;
  galleryErrorRedirectLink.setAttribute('error-type', errType);

  galleryErrorContainer.append(galleryErrorRedirectLink);

  showMessage(message);
} 

function setNewUrl (params: URLSearchParams | string): void {
  window.location.href = window.location.origin + window.location.pathname + `?page=${params}`;
}

function showMessage (text: string): void {
  galleryPopup.classList.add('show');
  galleryErrorMessage.textContent = '';
  galleryErrorMessage.textContent = text;
}

function updateMessageBeforeRedirection (timer: number): void {
  let time = setInterval(() => {
    --timer;
    if (timer <= 0) clearInterval(time);
    showMessage(`Token validity time is expired. You will be redirected to authorization page in ${timer} seconds`);
  }, 1000);
}

function redirectWhenTokenExpires (delay: number): void {
  if (!Token.getToken()) {
    updateMessageBeforeRedirection(delay / 1000);
    ListenerRemover.removeEventListeners(galleryEventsArray);
    setTimeout(() => {
      window.location.replace(`${loginUrl}?currentPage=${currentUrl.searchParams.get('page')}`);
    }, delay)
  }
}

function setPageNumber () {
  const currentActiveLink = pagesLinksList.querySelector('.active');
  
  for (let item of pagesLinksList.children) {
    const link = item.querySelector('a');
    
    if (link?.textContent) {
      item.setAttribute('page-number', link.textContent);
    }
    
    if (item.getAttribute('page-number') === currentUrl.searchParams.get('page')) {
      currentActiveLink?.classList.remove('active');
      item.classList.add('active');
    }
  }
}

function getCurrentPageImages (): void {
  if (!currentUrl.searchParams.get('page')) {
    getPicturesData(`${galleryServerUrl}?page=1`)
  } else {
    getPicturesData(`${galleryServerUrl}?page=${currentUrl.searchParams.get('page')}`);
  }

  redirectWhenTokenExpires(5000);
}

function changeCurrentPage (e: Event): void {
  const currentActiveLink = pagesLinksList.querySelector('.active');
  const target = e.target as HTMLElement;
  const targetClosestLi = target.closest('li');

  e.preventDefault();

  if (target !== pagesLinksList ) {
    if (currentActiveLink !== targetClosestLi) {
      setNewUrl(targetClosestLi?.getAttribute('page-number')!);
      getPicturesData(`${galleryServerUrl}?page=${currentUrl.searchParams.get('page')}`);
      
      currentActiveLink?.classList.remove('active');
      target.classList.add('active');
  
      redirectWhenTokenExpires(5000);
    }
  }
}

document.addEventListener('DOMContentLoaded', getCurrentPageImages);
pagesLinksList.addEventListener('click', changeCurrentPage);
galleryErrorContainer.addEventListener('click', redirectToTheTargetPage);

setInterval(() => {
  Token.deleteToken();
  redirectWhenTokenExpires(5000);
}, 60000)





