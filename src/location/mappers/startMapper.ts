import { Location } from 'src/shared/models/location';
import { LocationInfo } from '../models/locationinfo';

export const locationInfoToLocation: (s: LocationInfo) => Location = (
  s: LocationInfo
) => ({
  Latitude: `${s.lat}`,
  Longitude: `${s.lon}`,
  Altitude: Math.floor(s.elevation),
  Country: 'Norway',
  CountryPart: s.fylke,
  City: s.kommune,
  Name: s.name,
  // TODO add description
  Description: '',
  FullDescription: '',
});
