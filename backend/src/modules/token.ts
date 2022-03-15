import { TokenObject } from "./tokenInterface";

export class Token {
  private static TOKEN_KEY: string = 'token';

  getToken (): TokenObject {
    return JSON.parse(localStorage.getItem(Token.TOKEN_KEY) || 'null');
  }
  
  getTokenTimestamp (): number {
    return JSON.parse(localStorage.getItem(Token.TOKEN_KEY) || 'null');
  }
  
  setToken (token: TokenObject): void {
    token.timestamp = Date.now();
    localStorage.setItem(Token.TOKEN_KEY, JSON.stringify(token));
  }
  
  deleteToken (): void {
    if (Date.now() - this.getTokenTimestamp() >= 600000) {
      localStorage.removeItem(Token.TOKEN_KEY);
    }
  }
}




