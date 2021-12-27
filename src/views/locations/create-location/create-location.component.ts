/* eslint-disable @typescript-eslint/ban-ts-comment */
import { html, LitElement, TemplateResult } from 'lit';
import { customElement, queryAsync, state } from 'lit/decorators.js';
import '@material/mwc-tab-bar';
import '@material/tab-bar';
import 'src/location/components/creation/where';
import '@material/mwc-button';
import style from './create-location.component.styles.scss';
import 'src/shared/components/wind-direction/wind-direction.component';

@customElement('location-creation-view')
export class CreateLocationComponent extends LitElement {
  @state()
  _currentIndex = 0;

  @queryAsync('#creation-steps')
  creationDiv: Promise<HTMLElement>;

  tabChanged(index: CustomEvent<{ index: number }>) {
    console.log(index.detail.index);
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
      <flightlog-wind-direction modifyable></flightlog-wind-direction>
      <mwc-tab-bar @MDCTabBar:activated="${this.tabChanged}">
        <mwc-tab label="Start" icon="flight_takeoff"></mwc-tab>
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
        return this.renderLandingLocations();
      default:
        return html`something wrong`;
    }
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
          <mwc-button unelevated icon="save">Store</mwc-button>
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
}
