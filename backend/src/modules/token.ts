import { TokenObject } from "./tokenInterface";

export class Token {
  private static TOKEN_KEY: string = 'token';

  static getToken (): TokenObject {
    return JSON.parse(localStorage.getItem(Token.TOKEN_KEY) || 'null');
  }
  
  static getTokenTimestamp (): number {
    return JSON.parse(localStorage.getItem(Token.TOKEN_KEY) || 'null');
  }
  
  static setToken (token: TokenObject): void {
    token.timestamp = Date.now();
    localStorage.setItem(Token.TOKEN_KEY, JSON.stringify(token));
  }
  
  static deleteToken (): void {
    if (Date.now() - Token.getTokenTimestamp() >= 600000) {
      localStorage.removeItem(Token.TOKEN_KEY);
    }
  }
}




