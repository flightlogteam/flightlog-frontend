import Sdk from "casdoor-js-sdk/lib/cjs/sdk";
import { html, LitElement, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { configQuery } from '../shared/config/state/config.query';

@customElement("flightlog-view-unauthorized")
export class CallbackViewComponent extends LitElement {
    render(): TemplateResult {
        return html`Callback`;
    }

    constructor() {
        super();
        configQuery.authConfig.subscribe(config => {
            if (window.location.search.search("code") > 0) {
                const sdk = new Sdk(config);
                sdk.signin(config.serverUrl).catch(e => console.log(e));

                sdk.signin(config.serverUrl).then(response => response.json()).then(response => {
                    window.location.search = "";
                    console.log(response);
                });
            }
        });
    }
}
