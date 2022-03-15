import { TokenObject } from "./tokenInterface";

export class Token {
  private static tokenKey: string = 'token';

  getToken (): TokenObject {
    return JSON.parse(localStorage.getItem(Token.tokenKey) || 'null');
  }
  
  getTokenTimestamp (): number {
    return JSON.parse(localStorage.getItem(Token.tokenKey) || 'null');
  }
  
  setToken (token: TokenObject): void {
    token.timestamp = Date.now();
    localStorage.setItem(Token.tokenKey, JSON.stringify(token));
  }
  
  deleteToken (): void {
    if (Date.now() - this.getTokenTimestamp() >= 600000) {
      localStorage.removeItem(Token.tokenKey);
    }
  }
}




