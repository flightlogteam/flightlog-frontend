import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("flightlog-icon")
export class Icon extends LitElement {
  @property({
    attribute: false,
  })
  iconName = "face";

  @property()
  fontSize = 24;

  static styles = css`
    .material-icons {
      font-family: "Material Icons";
      font-weight: normal;
      font-style: normal;
      font-size: 24px; /* Preferred icon size */
      display: inline-block;
      line-height: 1;
      text-transform: none;
      letter-spacing: normal;
      word-wrap: normal;
      white-space: nowrap;
      direction: ltr;

      /* Support for all WebKit browsers. */
      -webkit-font-smoothing: antialiased;
      /* Support for Safari and Chrome. */
      text-rendering: optimizeLegibility;

      /* Support for Firefox. */
      -moz-osx-font-smoothing: grayscale;

      /* Support for IE. */
      font-feature-settings: "liga";
    }
  `;

  render(): TemplateResult {
    return html`<span
      style="font-size: ${this.fontSize}px"
      class="material-icons"
      >${this.iconName}</span
    >`;
  }

  connectedCallback(): void {
    super.connectedCallback();
    try {
      this.iconName = this.innerHTML.split(">")[1];
    } catch {
      console.error("Cannot parse that icon");
    }
  }
}
