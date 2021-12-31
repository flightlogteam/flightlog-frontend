import {
  BehaviorSubject,
  combineLatest,
  map,
  mergeMap,
  Observable,
  ReplaySubject,
  Subject,
} from 'rxjs';
import { Start } from 'src/shared/models/start';
import { locationInfoToLocation } from '../mappers/startMapper';
import { LocationInfo } from '../models/locationinfo';
import {
  LocationBackendHttpService,
  locationBackendHttpService,
} from './location-backend-http.service';

export interface LocationCreationError {
  field: string;
  message?: string;
}

export class LocationCreationService {
  private locations$: Subject<LocationInfo>[] = [];

  constructor(private locationBackendHttpService: LocationBackendHttpService) {}

  optimalDirection = 0;
  suboptimalDirection = 0;

  registerLocation(index: number): Observable<LocationInfo> {
    if (!this.locations$[index]) {
      this.locations$[index] = new BehaviorSubject<LocationInfo | undefined>(
        undefined
      );
    }
    return this.locations$[index];
  }

  getErrors$(index: number): Observable<LocationCreationError[]> {
    return this.locations$[index].pipe(
      map(location => this.validateLocationInfo(location))
    );
  }

  setDirection(optimal: number, suboptimal: number) {
    this.optimalDirection = optimal;
    this.suboptimalDirection = suboptimal;
  }

  /** Sets a location. Index=0 (default) is a start. All locations with a higher index is a landing */
  setStartLocation(location: LocationInfo, index = 0) {
    this.locations$[index].next(location);
  }

  storeLocation(): Observable<number> {
    return combineLatest(this.locations$).pipe(
      mergeMap(locations => {
        const start: Start = {
          OptimalDirections: this.optimalDirection,
          SuboptimalDirections: this.suboptimalDirection,
          StartLocation: locationInfoToLocation(locations[0]),
          Landings: locations
            .slice(1)
            .map(location => locationInfoToLocation(location)),
        };

        return this.locationBackendHttpService.createStart(start);
      })
    );
  }

  private validateLocationInfo(
    location: LocationInfo
  ): LocationCreationError[] {
    const result = [];

    if (location.elevation < 0) {
      result.push({
        field: 'elevation',
        message: 'Elevation must be greater than 0',
      });
    }

    if (!location.name) {
      result.push({ field: 'name', message: 'All locations must have a name' });
    }

    if (!location.kommune) {
      result.push({
        field: 'kommune',
        message: 'All locations must have a kommune',
      });
    }

    if (!location.fylke) {
      result.push({
        field: 'fylke',
        message: 'All locations must have a fylke',
      });
    }

    return result;
  }
}

export const locationCreationService = new LocationCreationService(
  locationBackendHttpService
);
