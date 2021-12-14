/* eslint-disable @typescript-eslint/ban-ts-comment */
import { html, LitElement, TemplateResult } from 'lit';
import { customElement, queryAsync, state } from 'lit/decorators.js';
import '@material/mwc-tab-bar';
import '@material/tab-bar';
import { CreationComponent } from 'src/location/components/creation/interface';
import { FlightlogCreateLocationWhereComponent } from 'src/location/components/creation/where';

@customElement('location-creation-view')
export class CreateLocationComponent extends LitElement {
  @state()
  _currentIndex = 0;

  @queryAsync('#creation-steps')
  creationDiv: Promise<HTMLElement>;

  creationSteps: CreationComponent[] = [
    new FlightlogCreateLocationWhereComponent(),
  ];

  tabChanged(index: CustomEvent<{ index: number }>) {
    console.log(index.detail.index);
    this._currentIndex = index.detail.index;
  }

  constructor() {
    super();
    this.creationDiv.then((div) => {
      for (const element of this.creationSteps) {
        // @ts-ignore
        div.appendChild(element as LitElement);
      }
    });
  }

  render(): TemplateResult {
    return html`<container-component>
      <mwc-tab-bar @MDCTabBar:activated="${this.tabChanged}">
        <mwc-tab disabled label="Where" icon="place"></mwc-tab>
        <mwc-tab label="Takeoff" icon="flight_takeoff"></mwc-tab>
        <mwc-tab label="Landings" icon="flight_land"></mwc-tab>
      </mwc-tab-bar>
      <div class="tab-content">
        <div id="creation-steps"></div>
      </div>
    </container-component>`;
  }

  private renderTab(): TemplateResult {
    switch (this._currentIndex) {
      case 0:
        return this.renderAproximatelyWhere();
      case 1:
        return html`start`;
      case 2:
        return html`landings`;
      default:
        return html`something wrong`;
    }
  }

  private renderAproximatelyWhere(): TemplateResult {
    return html`
      <div class="location-select"><location-search></location-search></div>
    `;
  }
}
