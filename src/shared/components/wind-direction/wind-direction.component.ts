import { LitElement, svg, TemplateResult } from 'lit';
import {
  customElement,
  property,
  queryAll,
  queryAsync,
} from 'lit/decorators.js';
import { filter, fromEvent, map, Subscription } from 'rxjs';
import style from './wind-direction.component.styles.scss';
import { WindImage } from './wind-image';

export const colorMappings: { name: string; value: string }[] = [
  { name: 'green', value: 'rgb(85, 170, 85)' },
  { name: 'white', value: 'rgb(255, 255, 255)' },
  { name: 'yellow', value: 'rgb(251, 255, 0)' },
];

// represents white | green | yellow
type fieldStatus = 1 | 2 | 3;

@customElement('flightlog-wind-direction')
export class FlightlogWindDirectionComponent extends LitElement {
  static styles = [style];

  @queryAsync('#svg5')
  canary: Promise<SVGPathElement>;

  @queryAll('path')
  pathElements: NodeListOf<SVGPathElement> | undefined;

  @property()
  size = 300;

  @property()
  set optimalDirection(item: number) {
    this.applyNumberToFieldColors(item, 2);
    this.reflectFieldColors();
  }

  private fieldColors: fieldStatus[] = [];

  @property()
  set subOptimalDirection(item: number) {
    this.applyNumberToFieldColors(item, 3);
    this.reflectFieldColors();
  }

  @property({ type: Boolean })
  modifyable = false;

  private subscriptions: Subscription[] = [];

  constructor() {
    super();
    for (let i = 0; i < 24; i++) {
      this.fieldColors[i] = 1;
    }
  }

  firstUpdated() {
    this.canary.then(() => {
      this.subscriptions.push(
        fromEvent(this.pathElements, 'click')
          .pipe(
            filter(
              event => !(event.target as SVGPathElement).id.startsWith('path')
            ),
            map(event => event.target as SVGPathElement)
          )
          .subscribe(path => {
            this.toggleColor(path);
          })
      );
    });
  }

  disconnectedCallback() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  render(): TemplateResult {
    return svg`
      ${WindImage}
    `;
  }

  private toggleColor(element: SVGPathElement) {
    if (!this.modifyable) {
      return;
    }

    const status = this.getStatusForPath(element);
    let newStatus = status + 1;

    if (newStatus > 3) {
      newStatus = 1;
    }

    const mapping = this.fieldStatusToMapping(newStatus as fieldStatus);
    element.style.fill = mapping.value;

    this.updateStatusForPath(element, newStatus as fieldStatus);

    this.dispatchEvent(
      new CustomEvent('wind-direction-modified', {
        detail: this.calculateNumbers(),
      })
    );
  }

  private getStatusForPath(element: SVGPathElement): fieldStatus {
    return this.fieldColors[Number.parseInt(element.id) - 1];
  }

  private updateStatusForPath(element: SVGPathElement, status: fieldStatus) {
    this.fieldColors[Number.parseInt(element.id) - 1] = status;
  }

  private fieldStatusToMapping(status: fieldStatus): {
    name: string;
    value: string;
  } {
    let color = 'white';
    switch (status) {
      case 2:
        color = 'green';
        break;
      case 3:
        color = 'yellow';
        break;
    }
    return colorMappings.find(m => m.name === color);
  }

  private reflectFieldColors() {
    this.canary.then(() => {
      for (let i = 1; i <= 24; i++) {
        const id = i < 10 ? `0${i}` : `${i}`;
        const path = this.shadowRoot.getElementById(id);
        if (path) {
          const mapping = this.fieldStatusToMapping(this.fieldColors[i - 1]);
          path.style.fill = mapping.value;
        }
      }
    });
  }

  private applyNumberToFieldColors(value: number, color: fieldStatus) {
    const binary = value.toString(2).split('').reverse();

    for (let i = 0; i < binary.length; i++) {
      if (binary[i] === '1') {
        this.fieldColors[i] = color;
      }
    }
  }

  private calculateNumbers(): { suboptimal: number; optimal: number } {
    const result = {
      suboptimal: 0,
      optimal: 0,
    };
    for (let i = 23; i >= 0; i--) {
      if (this.fieldColors[i] == 2) {
        result.optimal += 1 << i;
        continue;
      }

      if (this.fieldColors[i] == 3) {
        result.suboptimal += 1 << i;
      }
    }

    return result;
  }
}
