import { Observable } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map } from 'rxjs/operators';
import { Start } from '../models/start';

export class LocationSearchHttpClient {
  locationSearch(
    text: string,
    pageSize: number,
    page: number
  ): Observable<LocationResponse> {
    return ajax<LocationResponse>({
      url: `https://ws.geonorge.no/stedsnavn/v1/navn?sok=${text}&fuzzy=true&utkoordsys=4258&treffPerSide=${pageSize}&side=${
        page + 1
      }`,
      crossDomain: true,
      method: 'GET',
    }).pipe(map(item => item.response));
  }

  locationDetailByLocationId(
    stedsnummer: number
  ): Observable<LocationSearchResponse> {
    return ajax<LocationSearchResponse>({
      url: `https://ws.geonorge.no/stedsnavn/v1/sted?stedsnummer=${stedsnummer}&utkoordsys=4258&treffPerSide=10&side=1`,
      crossDomain: true,
      method: 'GET',
    }).pipe(map(item => item.response));
  }

  pointSearch(lat: number, lon: number): Observable<PointSearchResponse> {
    return ajax<LocationResponse>({
      url: `https://ws.geonorge.no/stedsnavn/v1/punkt?nord=${lat}&ost=${lon}&koordsys=4326&radius=500&utkoordsys=4258&treffPerSide=10&side=1`,
      crossDomain: true,
      method: 'GET',
    }).pipe(map(item => item.response));
  }

  getElevation(lat: number, lon: number): Observable<number> {
    return ajax<{ punkter: { z: number }[] }>({
      url: `https://ws.geonorge.no/hoydedata/v1/punkt?nord=${lat}&koordsys=4326&ost=${lon}&geojson=false`,
      crossDomain: true,
      method: 'GET',
    }).pipe(map(item => item.response.punkter[0].z));
  }
}

export interface Metadata {
  treffPerSide: number;
  side: number;
  totaltAntallTreff: number;
  viserFra: number;
  viserTil: number;
  sokeStreng: string;
}

export interface Representasjonspunkt {
  øst: number;
  nord: number;
  koordsys: number;
}

export interface Fylker {
  fylkesnavn: string;
  fylkesnummer: string;
}

export interface Kommuner {
  kommunenummer: string;
  kommunenavn: string;
}

export interface Location {
  skrivemåte: string;
  skrivemåtestatus: string;
  navnestatus: string;
  språk: string;
  navneobjekttype: string;
  stedsnummer: number;
  stedstatus: string;
  representasjonspunkt: Representasjonspunkt;
  fylker: Fylker[];
  kommuner: Kommuner[];
}

export interface LocationResponse {
  metadata: Metadata;
  navn: Location[];
}

export interface PointSearchResponse {
  metadata: Metadata;
  navn: { stedsnummer: number; navneobjekttype: string }[];
}

export interface Stedsnavn {
  skrivemåte: string;
  skrivemåtestatus: string;
  navnestatus: string;
  språk: string;
  stedsnavnnummer: number;
}

export interface Fylker {
  fylkesnavn: string;
  fylkesnummer: string;
}

export interface Kommuner {
  kommunenummer: string;
  kommunenavn: string;
}

export interface Geometry {
  type: string;
  coordinates: number[];
}

export interface Geojson {
  geometry: Geometry;
}

export interface Navn {
  stedsnavn: Stedsnavn[];
  navneobjekttype: string;
  stedsnummer: number;
  stedstatus: string;
  representasjonspunkt: Representasjonspunkt;
  fylker: Fylker[];
  kommuner: Kommuner[];
  oppdateringsdato: Date;
  geojson: Geojson;
}

export interface LocationSearchResponse {
  metadata: Metadata;
  navn: Navn[];
}

export const locationSearchHttpClient = new LocationSearchHttpClient();
