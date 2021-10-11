import { html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./icon.component.scss";
import { IconDefinition } from "@carbon/icons/es/*";

import { getAttributes, toSVG } from "@carbon/icon-helpers";

@customElement("core-icon")
export class CoreIconComponent extends LitElement {
    static styles = styles;

    private _name = "";

    @property()
    icon: IconDefinition;

    @property()
    size = 20;

    get name(): string {
        return this._name;
    }

    render(): TemplateResult {
        return html`${this.renderNode(this.icon)}`;
    }


    private renderNode(icon: IconDefinition): SVGElement {
        if (!icon) return null;
        const element = toSVG({
            ...icon,
            attrs: getAttributes(icon.attrs),
        });
        element.setAttribute('height', `${this.size}`);
        element.setAttribute('width', `${this.size}`);
        return element;
    }
}
