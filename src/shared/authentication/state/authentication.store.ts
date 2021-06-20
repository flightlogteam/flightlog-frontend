import { EntityState, EntityStore, StoreConfig } from "@datorama/akita";
import { Authentication, createAuthentication } from "./authentication.model";

export interface AuthenticationState extends EntityState<Authentication> {
  name?: string;
}

@StoreConfig({
  name: "authentication",
})
export class AuthenticationStore extends EntityStore<AuthenticationState> {
  constructor() {
    super(createAuthentication());
  }

  setTokens(accessToken: string, refreshToken: string) {
    this.update(() => ({
      accessToken,
      refreshToken,
    }));
  }

  login(token: string): void {
    this.update((state) => ({
      accessToken: token,
      refreshToken: state.refreshToken,
    }));
  }
}

export const authenticationStore = new AuthenticationStore();
