const homeLink = document.querySelector('.content__home-link');

homeLink?.addEventListener('click', homeRedirection);

function homeRedirection (e: Event) {
  e.preventDefault();
  homeLink?.removeEventListener('click', homeRedirection);

  if (Token.getToken()) {
    redirectToTheGalleryPage();
  } else {
    window.location.replace(`${loginUrl}?currentPage=${currentUrl.searchParams.get('page')}`);
  }
}



