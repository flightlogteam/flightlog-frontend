import { Observable } from "rxjs";
import { ajax } from "rxjs/ajax";
import { map } from "rxjs/operators";

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
      method: "GET",
    }).pipe(map((item) => item.response));
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

export const locationSearchHttpClient = new LocationSearchHttpClient();