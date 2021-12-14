import { html, LitElement, TemplateResult } from 'lit';
import { CreationComponent } from './interface';
import 'src/shared/components/location-search/location-search.component';
import { Location } from 'src/shared/services/loaction.http.service';
import {
  customElement,
  property,
  query,
  queryAsync,
  state,
} from 'lit/decorators.js';
import style from './where.styles.scss';
import 'src/shared/components/map/map.component';
import {
  debounceTime,
  fromEvent,
  merge,
  Observable,
  Subject,
  Subscription,
} from 'rxjs';
import '@material/mwc-textfield';
import '@material/mwc-textarea';
import { locationService } from 'src/location/services/location.service';
import { TextField } from '@material/mwc-textfield';
import { LocationInfo } from 'src/location/models/locationinfo';
import { locationCreationService } from 'src/location/services/location-creation.service';

@customElement('flightlog-create-location')
export class FlightlogCreateLocationWhereComponent
  extends LitElement
  implements CreationComponent
{
  private subscriptions: Subscription[] = [];

  tabIcon(): string {
    return 'place';
  }
  tabName(): string {
    return 'Start';
  }

  @property()
  locationIndex = 0;

  @query('#location-name')
  locationNameField: TextField;

  @query('#location-elevation')
  locationElevation: TextField;

  @query('#location-fylke')
  locationFylke: TextField;

  @queryAsync('#information-container')
  locationContainer: Promise<HTMLDivElement>;

  @query('#location-kommune')
  locationKommune: TextField;

  @query('#location-short-description')
  locationShortDescription: TextField;

  @query('#location-description')
  locationDescription: TextField;

  locationChangeSubject = new Subject<[number, number]>();

  @state()
  currentLocation: Location | undefined;

  @state()
  mapHeight = 500;

  formObservable: Observable<LocationInfo> | undefined;

  static styles = [style];

  isValidated(): boolean {
    return this.currentLocation !== undefined;
  }

  constructor() {
    super();
    this.locationContainer.then((container) => {
      this.mapHeight = container.clientHeight - 100;
    });
  }

  firstUpdated() {
    this.subscriptions.push(
      merge(
        fromEvent(this.locationNameField, 'input'),
        fromEvent(this.locationElevation, 'input'),
        fromEvent(this.locationKommune, 'input'),
        fromEvent(this.locationFylke, 'input'),
        fromEvent(this.locationShortDescription, 'input'),
        fromEvent(this.locationDescription, 'input')
      )
        .pipe(debounceTime(200))
        .subscribe(() => {
          /*locationCreationService.setStartLocation({
          name: this.locationNameField.value,
          elevation: Number.parseFloat(this.locationElevation.value),
          lat:
        }, this.locationIndex)*/
        })
    );
  }

  // Location selected in the location-search-component
  locationSelected(locationEvent: CustomEvent<Location>): void {
    this.locationChangeSubject.next([
      locationEvent.detail.representasjonspunkt.øst,
      locationEvent.detail.representasjonspunkt.nord,
    ]);
    this.dispatchEvent(
      new CustomEvent('location-selected', { detail: locationEvent.detail })
    );
  }

  disconnectedCallback() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  // Coordinates are delivered lon, lat
  private mapSelectedLocation(
    coordinates: CustomEvent<{ location: [number, number] }>
  ) {
    const [lon, lat] = coordinates.detail.location;
    locationService.locationLookup(lat, lon).subscribe((location) => {
      this.locationNameField.value = location.name;
      this.locationElevation.value = `${location.elevation}`;
      this.locationKommune.value = location.kommune;
      this.locationFylke.value = location.fylke;
    });
  }

  render(): TemplateResult {
    return html`
      <div class="location">
        <div class="location-selection">
          <location-search
            label="Where is the start"
            placeholder="address, mountain, kommune, area..."
            class="search-box"
            id="test"
            @location-selected="${this.locationSelected}"
          ></location-search>
          <flightlog-map
            .height=${this.mapHeight}
            @map-selected-location=${this.mapSelectedLocation}
            .locationInput=${this.locationChangeSubject}
          ></flightlog-map>
        </div>
        <div class="information" id="information-container">
          <h3>Details</h3>
          <mwc-textfield
            id="location-name"
            label="Location Name"
            outlined
          ></mwc-textfield>
          <mwc-textfield
            id="location-elevation"
            label="Elevation"
            outlined
            suffix="meters"
            type="number"
          ></mwc-textfield>
          <mwc-textfield
            id="location-fylke"
            label="Fylke"
            outlined
          ></mwc-textfield>
          <mwc-textfield
            id="location-kommune"
            label="Kommune"
            outlined
          ></mwc-textfield>
          <mwc-textarea
            id="location-short-description"
            placeholder="Who should fly here?"
            outlined
            label="Short description"
            rows="3"
          ></mwc-textarea>
          <mwc-textarea
            id="location-description"
            placeholder="Describe conditions, payment to the land owner etc"
            outlined
            label="Description"
            rows="10"
          ></mwc-textarea>
        </div>
      </div>
    `;
  }
}
