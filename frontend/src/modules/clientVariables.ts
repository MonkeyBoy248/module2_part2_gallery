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

class ListenerRemover {
  static removeEventListeners (listeners: CustomEventListener[]) {
    for (let listener of listeners) {
      listener.target.removeEventListener(listener.type, listener.handler);
    }
  }
}

function redirectToTheGalleryPage () {
  const currentPage = currentUrl.searchParams.get('currentPage');

  if (!currentPage) {
    window.location.replace(`${galleryUrl}?page=1`)
  } else {
    window.location.replace(`${galleryUrl}?page=${currentPage}`)
  }
}

class Token {
  private static TOKEN_KEY: string = 'token';

  static getToken (): TokenObject {
    return JSON.parse(localStorage.getItem(Token.TOKEN_KEY) || 'null');
  }
  
  static getTokenTimestamp (): number | undefined {
    const tokenObj: TokenObject = JSON.parse(localStorage.getItem(Token.TOKEN_KEY) || 'null');

    return tokenObj?.timestamp;
  }
  
  static setToken (token: TokenObject): void {
    token.timestamp = Date.now();
    localStorage.setItem(Token.TOKEN_KEY, JSON.stringify(token));
  }
  
  static deleteToken (): void {
    const timestamp = Token.getTokenTimestamp();

    if (typeof timestamp === 'number') {
      if (Date.now() - timestamp >= 600000) {
        localStorage.removeItem(Token.TOKEN_KEY);
      }
    }
  }
}

interface TokenObject {
  token: string;
  timestamp?: number;
}

interface AuthenticationErrorMessage {
  errorMessage: string;
}

class TokenError extends Error {
  constructor (message?: string) {
    super(message);
    this.name = 'InvalidToken';
  }
}

interface User {
  email: string;
  password: string;
}











