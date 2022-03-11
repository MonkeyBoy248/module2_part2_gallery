const homeLink = document.querySelector('.content__home-link');

function homeRedirection (e: Event) {
  e.preventDefault();
  homeLink?.removeEventListener('click', homeRedirection);
  
  if (getToken()) {
    redirectToTheGalleryPage();
  } else {
    window.location.replace(`${loginUrl}?currentPage=${currentUrl.searchParams.get('page')}`);
  }
}

homeLink?.addEventListener('click', homeRedirection);

