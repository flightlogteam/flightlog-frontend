import { html, LitElement, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import "@material/mwc-tab-bar";
import "@material/tab-bar";

@customElement("location-creation-view")
export class CreateLocationComponent extends LitElement {
  constructor() {
    super();
  }

  render(): TemplateResult {
    return html`<container-component>
      <mwc-tab-bar>
        <mwc-tab label="Tab one" icon="accessibility">
          <div><p>Something</p></div>
        </mwc-tab>
        <mwc-tab label="Tab two" icon="exit_to_app"></mwc-tab>
        <mwc-tab label="Tab three" icon="camera"></mwc-tab>
      </mwc-tab-bar>
    </container-component>`;
  }
}
