import 'jasmine';
import { FlightlogWindDirectionComponent } from './wind-direction.component';

describe('passing in a decimal', () => {
  it('mounts without error', () => {
    document.body.appendChild(new FlightlogWindDirectionComponent());
  });
});
