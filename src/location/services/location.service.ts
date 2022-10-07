import { forkJoin, map, mergeMap, Observable } from 'rxjs';
import {
  LocationSearchHttpClient,
  locationSearchHttpClient,
} from 'src/shared/services/loaction.http.service';
import { LocationInfo } from '../models/locationinfo';

const FORBIDDEN_TYPES = ['senkning'];

export class LocationService {
  constructor(private httpService: LocationSearchHttpClient) {}

  locationLookup(lat: number, lon: number): Observable<LocationInfo> {
    return forkJoin({
      info: this.httpService
        .pointSearch(lat, lon)
        .pipe(
          mergeMap(pointresponse =>
            this.httpService.locationDetailByLocationId(
              this.getLocationNumber(pointresponse.navn)
            )
          )
        ),
      elevation: this.httpService.getElevation(lat, lon),
    }).pipe(
      map(data => ({
        name: data.info.navn[0].stedsnavn[0].skrivemåte,
        kommune: data.info.navn[0].kommuner[0].kommunenavn,
        fylke: data.info.navn[0].fylker[0].fylkesnavn,
        elevation: data.elevation,
        lat,
        lon,
      }))
    );
  }
  private getLocationNumber(
    locations: { stedsnummer: number; navneobjekttype: string }[]
  ): number {
    if (locations.length > 1) {
      for (let i = 0; i < locations.length; i++) {
        if (
          FORBIDDEN_TYPES.some(
            type =>
              locations[i].navneobjekttype.toLowerCase() !== type.toLowerCase()
          )
        ) {
          return locations[i].stedsnummer;
        }
      }
    }

    return locations[0].stedsnummer;
  }
}

export const locationService = new LocationService(locationSearchHttpClient);
