import { html, LitElement, TemplateResult } from 'lit';
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
  first,
  fromEvent,
  merge,
  ReplaySubject,
  Subject,
  Subscription,
  withLatestFrom,
} from 'rxjs';
import '@material/mwc-textfield';
import '@material/mwc-textarea';
import { locationService } from 'src/location/services/location.service';
import { TextField } from '@material/mwc-textfield';
import { locationCreationService } from 'src/location/services/location-creation.service';
import { LocationInfo } from 'src/location/models/locationinfo';
import { SetLocationRequest } from 'src/shared/components/map/map.component';
import {
  BreakPointDevice,
  breakPointService,
} from 'src/shared/services/breakpoint.service';

@customElement('flightlog-create-location')
export class FlightlogCreateLocationWhereComponent extends LitElement {
  private subscriptions: Subscription[] = [];

  @state()
  breakPoint: BreakPointDevice = 'laptop';

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

  locationChangeSubject = new Subject<SetLocationRequest>();

  @state()
  mapHeight = 500;

  currentLocation$ = new ReplaySubject<LocationInfo>(1);

  static styles = [style];

  constructor() {
    super();
    this.locationContainer.then(container => {
      this.mapHeight = container.clientHeight - 100;
    });
    this.subscriptions.push(
      breakPointService.breakpoint$.subscribe(
        device => (this.breakPoint = device)
      )
    );
  }

  firstUpdated() {
    // Load existing data
    locationCreationService
      .registerLocation(this.locationIndex)
      .pipe(first())
      .subscribe(info => {
        if (info) {
          this.locationKommune.value = info.kommune;
          this.locationFylke.value = info.fylke;
          this.locationElevation.value = `${info.elevation}`;
          this.locationNameField.value = info.name;

          this.locationChangeSubject.next({
            lat: info.lat,
            lon: info.lon,
            addMarker: true,
          });
        }
      });
    this.subscriptions.push(
      merge(
        fromEvent(this.locationNameField, 'input'),
        fromEvent(this.locationElevation, 'input'),
        fromEvent(this.locationKommune, 'input'),
        fromEvent(this.locationFylke, 'input'),
        fromEvent(this.locationShortDescription, 'input'),
        fromEvent(this.locationDescription, 'input'),
        this.currentLocation$
      )
        .pipe(debounceTime(200), withLatestFrom(this.currentLocation$))
        .subscribe(([_, currentLocation]) => {
          locationCreationService.setStartLocation(
            {
              name: this.locationNameField.value,
              elevation: Number.parseFloat(this.locationElevation.value),
              lat: currentLocation.lat,
              lon: currentLocation.lon,
              kommune: currentLocation.kommune,
              fylke: currentLocation.fylke,
            },
            this.locationIndex
          );
        })
    );

    // Push new data
  }

  // Location selected in the location-search-component
  locationSelected(locationEvent: CustomEvent<Location>): void {
    this.locationChangeSubject.next({
      lat: locationEvent.detail.representasjonspunkt.nord,
      lon: locationEvent.detail.representasjonspunkt.øst,
    });
    this.dispatchEvent(
      new CustomEvent('location-selected', { detail: locationEvent.detail })
    );
  }

  disconnectedCallback() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // Coordinates are delivered lon, lat
  private mapSelectedLocation(
    coordinates: CustomEvent<{ location: [number, number] }>
  ) {
    const [lon, lat] = coordinates.detail.location;
    locationService.locationLookup(lat, lon).subscribe(location => {
      this.currentLocation$.next(location);
      this.locationNameField.value = location.name;
      this.locationElevation.value = `${location.elevation}`;
      this.locationKommune.value = location.kommune;
      this.locationFylke.value = location.fylke;
    });
  }

  render(): TemplateResult {
    return html`
      <div class="location ${this.breakPoint}">
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
