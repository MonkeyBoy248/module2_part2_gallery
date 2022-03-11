const port = 5000;
const protocol = 'http';
const hostName = 'localhost';
const authenticationServerUrl = `${protocol}://${hostName}:${port}/authentication`;
const galleryServerUrl = `${protocol}://${hostName}:${port}/gallery`;
const galleryUrl = `index.html`;
const loginUrl = `authentication.html`;
const currentUrl = new URL(window.location.href);

interface CustomEventListener {
  target: HTMLElement | Window | Document;
  type: string; 
  handler: EventListenerOrEventListenerObject;
}

function removeEventListeners (listeners: CustomEventListener[]) {
  for (let listener of listeners) {
    listener.target.removeEventListener(listener.type, listener.handler);
  }
}

interface User {
  email: string;
  password: string;
}

const tokenKey: string = 'token';

interface Token {
  token: string;
  timestamp?: number;
}

interface AuthenticationErrorMessage {
  errorMessage: string;
}

function getToken (): Token {
  return JSON.parse(localStorage.getItem(tokenKey) || 'null');
}

function getTokenTimestamp (): number {
  return JSON.parse(localStorage.getItem(tokenKey) || 'null');
}

function setToken (token: Token): void {
  token.timestamp = Date.now();
  localStorage.setItem(tokenKey, JSON.stringify(token));
}

function deleteToken (): void {
  if (Date.now() - getTokenTimestamp() >= 600000) {
    localStorage.removeItem(tokenKey);
  }
}

function redirectToTheGalleryPage () {
  if (!currentUrl.searchParams.get('currentPage')) {
    window.location.replace(`${galleryUrl}?page=1`)
  } else {
    window.location.replace(`${galleryUrl}?page=${currentPage}`)
  }
}





