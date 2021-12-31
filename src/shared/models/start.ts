import { Location } from './location';

export interface Start {
  ID?: number;
  OptimalDirections: number;
  SuboptimalDirections: number;
  StartLocation: Location;
  Landings: Location[];
}
