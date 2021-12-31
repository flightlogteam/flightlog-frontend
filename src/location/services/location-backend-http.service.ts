import { map, mergeMap, Observable } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import {
  AuthenticationService,
  authenticationService,
} from 'src/authentication/authentication.service';
import { Start } from 'src/shared/models/start';

export class LocationBackendHttpService {
  constructor(private authenticationService: AuthenticationService) {}

  createStart(start: Start): Observable<number> {
    return this.authenticationService.authorizationHeader$.pipe(
      mergeMap(headerValue =>
        ajax<number>({
          url: `http://localhost:8083/api/Flights/start`,
          method: 'POST',
          crossDomain: true,
          body: start,
          headers: {
            Authorization: headerValue,
          },
        }).pipe(map(response => response.response))
      )
    );
  }
}

export const locationBackendHttpService = new LocationBackendHttpService(
  authenticationService
);
