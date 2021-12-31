/* eslint-disable @typescript-eslint/ban-ts-comment */
import { html, LitElement, TemplateResult } from 'lit';
import { customElement, queryAsync, state } from 'lit/decorators.js';
import '@material/mwc-tab-bar';
import '@material/tab-bar';
import 'src/location/components/creation/where';
import '@material/mwc-button';
import style from './create-location.component.styles.scss';
import 'src/shared/components/wind-direction/wind-direction.component';
import { locationCreationService } from 'src/location/services/location-creation.service';

@customElement('location-creation-view')
export class CreateLocationComponent extends LitElement {
  @state()
  _currentIndex = 0;

  @queryAsync('#creation-steps')
  creationDiv: Promise<HTMLElement>;

  tabChanged(index: CustomEvent<{ index: number }>) {
    this._currentIndex = index.detail.index;
  }

  @state()
  currentLocation = 1;

  constructor() {
    super();
  }

  static styles = [style];

  render(): TemplateResult {
    return html`<container-component>
      <mwc-tab-bar @MDCTabBar:activated="${this.tabChanged}">
        <mwc-tab label="Start" icon="flight_takeoff"></mwc-tab>
        <mwc-tab label="Direction" icon="explore"></mwc-tab>
        <mwc-tab label="Landings" icon="flight_land"></mwc-tab>
      </mwc-tab-bar>

      ${this.renderTab()}
      <div class="tab-content">
        <div id="creation-steps"></div>
      </div>
    </container-component>`;
  }

  private renderTab(): TemplateResult | TemplateResult[] {
    switch (this._currentIndex) {
      case 0:
        return html`<flightlog-create-location></flightlog-create-location>`;
      case 1:
        return html`<flightlog-wind-direction
          @wind-direction-modified="${this.setDirection}"
          .subOptimalDirection="${locationCreationService.suboptimalDirection}"
          .optimalDirection="${locationCreationService.optimalDirection}"
          modifyable
        ></flightlog-wind-direction>`;
      case 2:
        return this.renderLandingLocations();

      default:
        return html`something wrong`;
    }
  }

  private setDirection(
    e: CustomEvent<{ optimal: number; suboptimal: number }>
  ) {
    locationCreationService.setDirection(e.detail.optimal, e.detail.suboptimal);
  }

  private renderLandingLocations(): TemplateResult[] {
    const content: TemplateResult[] = [];

    content.push(
      html`
        <div class="actions">
          <mwc-button
            unelevated
            icon="add"
            @click="${() => this.currentLocation++}"
            >Add landing</mwc-button
          >
          <mwc-button unelevated @click="${this.storeLanding}" icon="save"
            >Store</mwc-button
          >
        </div>
      `
    );

    for (let i = 1; i <= this.currentLocation; i++) {
      content.push(
        html`<flightlog-create-location
          .locationIndex="${i}"
        ></flightlog-create-location>`
      );
    }

    return content;
  }
  private storeLanding() {
    locationCreationService.storeLocation().subscribe(a => console.log(a));
  }
}
