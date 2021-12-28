import { assert, expect } from 'chai';
import {
  colorMappings,
  FlightlogWindDirectionComponent,
} from './wind-direction.component';

describe('wind-direction-component', () => {
  it('mounts without error', () => {
    document.body.appendChild(new FlightlogWindDirectionComponent());

    expect(window.customElements.get('flightlog-wind-direction')).to.not.be
      .undefined;
  });

  it('can parse an integer into a set of fields', () => {
    const component = new FlightlogWindDirectionComponent();
    document.body.appendChild(component);
    component.optimalDirection = 3;

    component.canary.then(() => {
      const nodes: NodeListOf<SVGPathElement> =
        component.shadowRoot.querySelectorAll('path');

      assert(nodes.length === 32);
      nodes.forEach(node => {
        if (!node.id.startsWith('path')) {
          if (node.id === '01' || node.id === '02') {
            assert.equal(
              node.style.fill,
              colorMappings.find(m => m.name === 'green')?.value,
              `id: ${node.id} should have been green`
            );
          } else {
            assert.oneOf(
              node.style.fill,
              [colorMappings.find(m => m.name === 'white')?.value, '#ffffff'],
              'should have been white'
            );
          }
        }
      });
    });

    // Two first elements should be green
  });

  it('toggling a field results in a value emitted', async () => {
    const component = new FlightlogWindDirectionComponent();
    document.body.appendChild(component);

    await component.canary;
    component.addEventListener('wind-direction-modified', e => {
      const detail = (e as CustomEvent).detail as {
        suboptimal: number;
        optimal: number;
      };

      assert.equal(
        detail.optimal,
        8,
        'the user has clicked tile number 4 but it is not green'
      );
      assert.equal(
        detail.suboptimal,
        0,
        'the user has clicked tile number 4 but it is yellow when it should be green'
      );
    });

    component.pathElements.forEach(item => {
      if (item.id === '04') {
        const event = new Event('click', {
          bubbles: false,
          cancelable: false,
          composed: false,
        });
        item.dispatchEvent(event);
        return;
      }
    });
  });
});
