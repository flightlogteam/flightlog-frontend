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

  @property({ type: Boolean, reflect: true })
  button = false;

  get name(): string {
    return this._name;
  }

  render(): TemplateResult {
    return html`<div class="icon-container ${this.button ? "button-icon" : ""}">
      ${this.renderNode(this.icon)}
    </div>`;
  }

  private renderNode(icon: IconDefinition): SVGElement {
    if (!icon) return null;
    const element = toSVG({
      ...icon,
      attrs: getAttributes(icon.attrs),
    });
    element.setAttribute("height", `${this.size}`);
    element.setAttribute("width", `${this.size}`);
    return element;
  }
}
