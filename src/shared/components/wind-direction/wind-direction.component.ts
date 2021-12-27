import { LitElement, svg, TemplateResult } from 'lit';
import { customElement, property, queryAll } from 'lit/decorators.js';
import { filter, fromEvent, map, Subscription } from 'rxjs';
import style from './wind-direction.component.styles.scss';
import { WindImage } from './wind-image';

const colorMappings: { name: string; value: string }[] = [
  { name: 'green', value: 'rgb(85, 170, 85)' },
  { name: 'white', value: 'rgb(255, 255, 255)' },
  { name: 'yellow', value: 'rgb(251, 255, 0)' },
];

@customElement('flightlog-wind-direction')
export class FlightlogWindDirectionComponent extends LitElement {
  static styles = [style];

  @queryAll('path')
  pathElements: NodeListOf<SVGPathElement> | undefined;

  @property()
  size = 300;

  @property()
  direction = 0;

  @property({ type: Boolean })
  modifyable = false;

  private subscriptions: Subscription[] = [];

  firstUpdated() {
    console.log(this.pathElements);
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

    const currentColor = element.style.fill;

    const currentMapping = colorMappings.find(
      mapping => mapping.value.toUpperCase() === currentColor.toUpperCase()
    );
    if (currentMapping) {
      switch (currentMapping.name) {
        case 'white':
          this.addColorToPath(element, 'green');
          break;
        case 'green':
          this.addColorToPath(element, 'yellow');
          break;
        case 'yellow':
          this.addColorToPath(element, 'white');
          break;
      }
    }
  }

  private addColorToPath(
    element: SVGPathElement,
    color: 'green' | 'yellow' | 'white' = 'white'
  ) {
    const chosenColor = colorMappings.find(mapping => mapping.name === color);
    if (chosenColor) {
      element.style.fill = chosenColor.value;
    }
  }
}
