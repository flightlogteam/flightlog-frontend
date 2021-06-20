export interface Authentication {
  accessToken: string;
  refreshToken: string;
}

export function createAuthentication(): Authentication {
  return {
    accessToken: "",
    refreshToken: "",
  } as Authentication;
}
