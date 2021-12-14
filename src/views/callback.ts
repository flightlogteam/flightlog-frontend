import { html, LitElement, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { navigationService } from "../shared/services/navigation.service";

@customElement("flightlog-view-unauthorized")
export class CallbackViewComponent extends LitElement {
  render(): TemplateResult {
    return html`Callback`;
  }

  constructor() {
    super();
    //navigationService.setCurrentRoute("/");
  }
}
