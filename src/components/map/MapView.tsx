import React, { useRef, useEffect, useState } from 'react';
import 'ol/ol.css';
import proj4 from 'proj4';
import GeoJSON from 'ol/format/GeoJSON';
import Map from 'ol/Map';
import View from 'ol/View';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
// import { get as getProjection } from 'ol/proj';
import { FullScreen, defaults as defaultControls } from 'ol/control';
import { register } from 'ol/proj/proj4';
import Overlay from 'ol/Overlay';

import MapOverlay from './MapOverlay';
import { generateStyles } from './MapStyles';
import {
  // sampleMapData6609,
  sampleMapData3857Styled,
} from '../../mockData/sampleMapData';
// import sampleMapDataHuge from '../mockData/sampleMapDataHuge.json';

const mapData = sampleMapData3857Styled;
const mapProjectionParams = {
  // dataProjection: 'EPSG:4326',
  featureProjection: 'EPSG:3857',
  // featureProjection: 'EPSG:3857',
  // featureProjection: 'EPSG:6609',
  // featureProjection: 'EPSG:3857',
  // dataProjection: 'EPSG:6609',
};

const MapView = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const [popupFeatures, setPopupFeatures] = useState<object[]>([]);

  useEffect(() => {
    if (!mapRef.current || !popupRef.current) return;

    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(mapData, {
        ...mapProjectionParams,
      }),
    });

    const styles = generateStyles(mapData.symbology);
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: feature => {
        const subClass = feature.getProperties()['FeatureSubClass'];
        const geometryType = feature.getGeometry().getType();

        return (
          styles['SubClass-' + subClass] ??
          styles['Type-' + geometryType] ??
          styles['Unknown']
        );
      },
    });

    const map = new Map({
      controls: defaultControls().extend([new FullScreen()]),
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      target: mapRef.current,
      view: new View({
        // projection: getProjection('EPSG:4326'),
        // projection: getProjection('EPSG:6609'),
        center: [0, 0],
        zoom: 2,
      }),
    });

    const popup = new Overlay({
      autoPan: true,
      element: popupRef.current,
    });

    map.getView().fit(vectorSource.getExtent());
    map.addOverlay(popup);

    map.on('click', event => {
      let features: object[] = [];
      map.forEachFeatureAtPixel(event.pixel, feature => {
        features.push(feature.getProperties());
      });

      if (features.length) {
        // only set position if there are features to display
        // to ensure that autoPan doesn't trigger while the popup hides
        popup.setPosition(event.coordinate);
      }

      setPopupFeatures(features);
    });
  }, []);

  return (
    <>
      <div ref={popupRef}>
        <MapOverlay features={popupFeatures} />
      </div>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </>
  );
};

proj4.defs(
  'EPSG:6609',
  '+proj=lcc +lat_1=44.06666666666667 +lat_2=42.73333333333333 +lat_0=42 +lon_0=-90 +x_0=600000 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs'
);
register(proj4);

export default MapView;
