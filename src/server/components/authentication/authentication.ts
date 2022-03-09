import { Authorized } from "./authenticationAuthorizedList";
import { authorized_users as authorized } from "./authenticationAuthorizedList";
import { User } from "../../../modules/user";

export class Authentication {
  private static user: Authorized;

  constructor(user: Authorized) {
    Authentication.user = user;
  }

  static isThisCorrectUser (user: User): boolean {
    if (!authorized[user.email]) {
      console.log(`first false: ${authorized[user.email]}`)
      return false;
    }
    if (authorized[user.email] !== user.password) {
      console.log(`second false: ${authorized[user.email]}`)
      return false;
    }

    return true;
  }

  static showUser () {
    console.log(this.user);
  }
}