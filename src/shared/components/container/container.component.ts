import { html, LitElement, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { Subscription } from 'rxjs';
import {
  BreakPointDevice,
  breakPointService,
} from 'src/shared/services/breakpoint.service';
import style from './container.component.styles.scss';

@customElement('container-component')
export class ContainerComponent extends LitElement {
  static styles = [style];

  private subscriptions: Subscription[] = [];

  @state()
  device: BreakPointDevice = 'laptop';

  constructor() {
    super();
    this.subscriptions.push(
      breakPointService.breakpoint$.subscribe(device => (this.device = device))
    );
  }

  disconnectedCallback() {
    this.subscriptions.forEach(item => item.unsubscribe());
  }

  render(): TemplateResult {
    return html` <div class="container ${this.device}"><slot></slot></div> `;
  }
}
