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
import { first, Observable, ReplaySubject, Subscription } from 'rxjs';

export interface SetLocationRequest {
  lat: number;
  lon: number;
  addMarker?: boolean;
  zoomLevel?: number;
}

@customElement('flightlog-map')
export class FlightlogMapComponent extends LitElement {
  @queryAsync('#map-target')
  mapTarget: Promise<HTMLDivElement>;

  map$ = new ReplaySubject<Map>(1);

  markerLayer: BaseLayer | undefined;
  currentMarker: Feature<Point> | undefined;
  vectorSource: SourceVector<Geometry> | undefined;

  subscriptions: Subscription[] = [];

  @state()
  private _height: number;

  static styles = [style];
  @property()
  set locationInput(observable: Observable<SetLocationRequest>) {
    this.subscriptions.push(
      observable.subscribe(request => {
        this.setLocation([request.lon, request.lat], request.zoomLevel);
        if (request.addMarker) {
          const transformedCoordinates = transform(
            [request.lon, request.lat],
            'EPSG:4326',
            'EPSG:3857'
          );
          this.addMarker(transformedCoordinates);
        }
      })
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
    this.map$.pipe(first()).subscribe(map => map.updateSize());
  }

  setLocation(coordinates: [number, number], zoomLevel?: number) {
    this.map$.pipe(first()).subscribe(map => {
      map.setView(
        new View({
          projection: 'EPSG:3857',
          center: fromLonLat(coordinates),
          zoom: zoomLevel || 12,
        })
      );
    });
  }

  disconnectedCallback() {}

  constructor() {
    super();

    this.mapTarget.then(target => {
      const view = new View({
        projection: 'EPSG:3857',
        center: [1891337, 9772319],
        zoom: 5,
      });
      //End View definitions

      //Start: Map definitions
      const map = new Map({
        target: target,
        view,
      });

      const _url = 'http://opencache.statkart.no/gatekeeper/gk/gk.open?';

      //Start: source
      const sourceWMSC = new TileWMS({
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

      map.addLayer(tileLayerWMSC);
      map.on('singleclick', event => {
        this.addMarker(event.coordinate);
        this.dispatchLocationEvent(event.coordinate);
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
      map.addLayer(this.markerLayer);

      this.map$.next(map);
    });
  }

  /**
   * USES EPSG:3857-coordinate system
   * */
  private addMarker(coordinate: Coordinate) {
    this.map$.pipe(first()).subscribe(() => {
      if (this.currentMarker) {
        this.vectorSource.removeFeature(this.currentMarker);
      }
      this.currentMarker = new Feature(new Point(coordinate));
      this.vectorSource.addFeature(this.currentMarker);
    });
  }

  private dispatchLocationEvent(coordinate: Coordinate) {
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
