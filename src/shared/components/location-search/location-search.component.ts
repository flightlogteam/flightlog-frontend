/* eslint-disable @typescript-eslint/ban-ts-comment */
import { html, LitElement, TemplateResult } from "lit";
import { queryAsync, customElement } from "lit/decorators.js";
import "@vaadin/combo-box";
import { ComboBox, ComboBoxItemModel } from "@vaadin/combo-box";
import style from "./location-search.component.styles.scss";
import { debounceTime, mergeMap, Subject } from "rxjs";
import {
  Location,
  locationSearchHttpClient,
} from "../../services/loaction.http.service";

interface SearchParameters {
  page: number;
  pageSize: number;
  filter: string;
}

@customElement("location-search")
export class LocationSearch extends LitElement {
  // eslint-disable-next-line
  callback: (res: any[], size: number) => void;
  dataLoadSubject: Subject<SearchParameters> = new Subject<SearchParameters>();

  @queryAsync("#location-combo")
  comboElement: Promise<ComboBox>;

  dataFetch = (
    search: SearchParameters,
    // eslint-disable-next-line
    callback: (res: any[], size: number) => void
  ) => {
    this.callback = callback;

    if (search.filter && search.filter.length > 0) {
      this.dataLoadSubject.next(search);
    }
  };

  static styles = [style];

  constructor() {
    super();
    this.comboElement.then((element) => {
      element.itemLabelPath = "skrivemåte";
      element.itemIdPath = "stedsnummer";
      element.renderer = (
        root: HTMLElement,
        _: ComboBox,
        model: ComboBoxItemModel<Location>
      ) => {
        const location = model.item;
        root.innerHTML = `
        <div class="location">
          <b>${location.skrivemåte}</b><br>
          <p style="margin: 2px 0 2px 0" class="location-detail">${location.fylker[0].fylkesnavn}, ${location.kommuner[0].kommunenavn}</p>
        </div>`;
      };
    });

    this.dataLoadSubject
      .pipe(
        debounceTime(200),
        mergeMap((searchParams) =>
          locationSearchHttpClient.locationSearch(
            searchParams.filter,
            searchParams.pageSize,
            searchParams.page
          )
        )
      )
      .subscribe((data) => {
        if (this.callback) {
          this.callback(data.navn, data.navn.length);
        }
      });
  }

  render(): TemplateResult {
    return html`
      <p id="a"></p>
      <vaadin-combo-box
        @selected-item-changed="${this.valueChanged}"
        id="location-combo"
        placeholder="Skriv inn lokasjon..."
        .dataProvider="${this.dataFetch}"
      >
      </vaadin-combo-box>
    `;
  }

  valueChanged(event: CustomEvent) {
    const location = event.detail.value as Location;
    this.dispatchEvent(
      new CustomEvent("location-selected", { detail: location })
    );
  }

  connectedCallback() {
    super.connectedCallback();
  }
}
