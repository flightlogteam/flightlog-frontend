import { html, LitElement, TemplateResult } from 'lit';
import { customElement, property, queryAsync, state } from 'lit/decorators.js';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import { TileWMS } from 'ol/source';
import Vector from 'ol/layer/Vector';
import SourceVector from 'ol/source/Vector';
import { fromLonLat, transform } from 'ol/proj';
import style from './map.component.styles.scss';
import { Coordinate } from 'ol/coordinate';
import BaseLayer from 'ol/layer/Base';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import markerIcon from '@carbon/icons/es/location/20';
import { toSVG } from '@carbon/icon-helpers';
import { Feature } from 'ol';
import Point from 'ol/geom/Point';
import Geometry from 'ol/geom/Geometry';
import { Observable, Subscription } from 'rxjs';

@customElement('flightlog-map')
export class FlightlogMapComponent extends LitElement {
  @queryAsync('#map-target')
  mapTarget: Promise<HTMLDivElement>;

  map: Map | undefined;
  markerLayer: BaseLayer | undefined;
  currentMarker: Feature<Point> | undefined;
  vectorSource: SourceVector<Geometry> | undefined;

  subscriptions: Subscription[] = [];

  @state()
  private _height: number;

  static styles = [style];
  @property()
  set locationInput(observable: Observable<[number, number]>) {
    this.subscriptions.push(
      observable.subscribe((coordinates) => this.setLocation(coordinates))
    );
  }

  @property()
  set height(height: number | undefined) {
    if (height) {
      this._height = height;
    }
  }

  updated(changedProps: globalThis.Map<string | number | symbol, unknown>) {
    super.updated(changedProps);
    console.log(changedProps);
    if (this.map) {
      this.map.updateSize();
    }

    for (const key in changedProps.keys) {
      if (key === 'height') {
        console.log('someone set the key');
      }
    }
  }

  setLocation(coordinates: [number, number]) {
    if (this.map) {
      this.map.setView(
        new View({
          projection: 'EPSG:3857',
          center: fromLonLat(coordinates),
          zoom: 12,
        })
      );
    }
  }

  disconnectedCallback() {}

  constructor() {
    super();

    this.mapTarget.then((target) => {
      const view = new View({
        projection: 'EPSG:3857',
        center: [1891337, 9772319],
        zoom: 5,
      });
      //End View definitions

      //Start: Map definitions
      this.map = new Map({
        target: target,
        view,
      });

      const _url = 'http://opencache.statkart.no/gatekeeper/gk/gk.open?';

      //Start: source
      var sourceWMSC = new TileWMS({
        url: _url,
        params: {
          LAYERS: 'norges_grunnkart',
          VERSION: '1.1.1',
        },
      });
      //End: source

      //Start: layer
      const tileLayerWMSC = new TileLayer({
        source: sourceWMSC,
      });

      this.map.addLayer(tileLayerWMSC);
      this.map.on('singleclick', (event) => {
        this.addMarker(event.coordinate);
      });

      const svg = toSVG(markerIcon).outerHTML;

      this.vectorSource = new SourceVector();

      this.markerLayer = new Vector({
        source: this.vectorSource,
        style: new Style({
          image: new Icon({
            src: 'data:image/svg+xml;utf8,' + svg,
            scale: 1.5,
          }),
        }),
      });
      this.map.addLayer(this.markerLayer);
    });
  }

  private addMarker(coordinate: Coordinate) {
    if (this.currentMarker) {
      this.vectorSource.removeFeature(this.currentMarker);
    }
    this.currentMarker = new Feature(new Point(coordinate));
    this.vectorSource.addFeature(this.currentMarker);
    this.dispatchEvent(
      new CustomEvent('map-selected-location', {
        detail: {
          location: transform(coordinate, 'EPSG:3857', 'EPSG:4326'),
        },
      })
    );
  }

  render(): TemplateResult {
    return html`
      <div style="height: ${this._height}px" id="map-target"></div>
    `;
  }
}
