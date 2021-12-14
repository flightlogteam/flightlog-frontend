import {
  AuthenticationService,
  authenticationService,
} from 'src/authentication/authentication.service';

export class LocationBackendHttpService {
  constructor(private authenticationService: AuthenticationService) {}
}

export const locationBackendHttpService = new LocationBackendHttpService(
  authenticationService
);
