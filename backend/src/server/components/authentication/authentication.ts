import { Authorized } from "./authenticationAuthorizedList";
import { authorized_users as authorized } from "./authenticationAuthorizedList";
import { User } from "../../../modules/user";


export class Authentication {
  static isThisCorrectUser (user: User): boolean {
    if (!authorized[user.email]) {
      return false;
    }
    
    if (authorized[user.email] !== user.password) {
      return false;
    }

    return true;
  }
}