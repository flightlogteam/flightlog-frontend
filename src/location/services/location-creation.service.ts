import { Observable } from 'rxjs';
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
  private _locations: LocationInfo[] = [];

  private validationSubject = new Subject<boolean>();

  constructor(private locationBackendHttpService: LocationBackendHttpService) {}

  formIsSubmittable$: Observable<boolean> = this.validationSubject;

  /** Sets a location. Index=0 (default) is a start. All locations with a higher index is a landing */
  setStartLocation(location: LocationInfo, index = 0): LocationCreationError[] {
    this._locations[index] = location;
    this.validateForm();
    return this.validateLocationInfo(location);
  }

  private validateForm() {
    for (const location of this._locations) {
      if (location) {
        if (this.validateLocationInfo(location).length > 0) {
          this.validationSubject.next(false);
          return;
        }
      }
    }
    this.validationSubject.next(true);
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
