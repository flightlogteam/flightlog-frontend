import { BehaviorSubject, map, Observable, ReplaySubject, Subject } from 'rxjs';
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

  registerLocation(index: number): Observable<LocationInfo> {
    if (!this.locations$[index]) {
      console.log('location was not found. Registered new');
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

  /** Sets a location. Index=0 (default) is a start. All locations with a higher index is a landing */
  setStartLocation(location: LocationInfo, index = 0) {
    this.locations$[index].next(location);
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
