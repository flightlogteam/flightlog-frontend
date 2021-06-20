import { QueryEntity } from "@datorama/akita";
import { map } from "rxjs/operators";
import {
  AuthenticationStore,
  AuthenticationState,
  authenticationStore,
} from "./authentication.store";

export class AuthenticationQuery extends QueryEntity<AuthenticationState> {
  constructor(protected store: AuthenticationStore) {
    super(store);
  }

  isAuthenticated = this.select((data) => data.accessToken);

  token = this.select<{ Role: string; UserID: string; exp: number }>((data) => {
    const token = data.accessToken as string;
    if (token.length > 0) {
      const tokenData = atob(token.split(".")[1]);

      return JSON.parse(tokenData) as {
        Role: string;
        UserID: string;
        exp: number;
      };
    }
    return {
      Role: "",
      UserID: "",
      exp: 0,
    };
  });

  get accessToken(): string {
    return this.getValue().accessToken as string;
  }

  userId = this.token.pipe(map((item) => item.UserID));
}

export const authenticationQuery = new AuthenticationQuery(authenticationStore);
