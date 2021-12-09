import { html, LitElement, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import style from "./container.component.styles.scss";

@customElement("container-component")
export class ContainerComponent extends LitElement {
  static styles = [style];

  render(): TemplateResult {
    return html` <div class="container"><slot></slot></div> `;
  }
}
