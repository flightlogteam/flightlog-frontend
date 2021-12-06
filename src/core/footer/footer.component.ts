// TODO: Make a breakpoint-service to prevent code duplication
import { html, LitElement, TemplateResult } from "lit";
import { customElement, queryAsync, state } from "lit/decorators.js";
import "../toolbar/toolbar-navigation/toolbar-navigation";
import styles from "./footer.component.styles.scss";

@customElement("core-footer")
export class FooterNavigationComponent extends LitElement {
  @queryAsync(".footer")
  footer: Promise<HTMLDivElement>;

  @state()
  mobileDevice = false;

  private resizeObserver: ResizeObserver | undefined;

  static styles = [styles];

  constructor() {
    super();
    this.footer.then((footer) => {
      this.resizeObserver = new ResizeObserver((entries) => {
        for (let i = 0; i < entries.length; i++) {
          const width = entries[i].borderBoxSize[0].inlineSize;
          this.mobileDevice = width < 786;
        }
      });

      this.resizeObserver.observe(footer);
    });
  }

  render(): TemplateResult {
    return html`
      <div class="footer">
        ${this.mobileDevice ? this.renderFooterContent() : ``}
      </div>
    `;
  }
  private renderFooterContent(): TemplateResult {
    return html`
      <div class="footer-content">
        <toolbar-navigation-menu></toolbar-navigation-menu>
      </div>
    `;
  }
}
