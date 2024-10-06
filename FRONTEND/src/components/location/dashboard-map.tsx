// @ts-nocheck
'use client';

import React, { useEffect, useState } from 'react';
import { GeoJSON, MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { GeoJsonObject } from 'geojson';
import L from 'leaflet';
import * as satellite from 'satellite.js';

import { Checkbox } from '@/components/ui/checkbox';
import data from '@/data/wrs2_descending.json';

type SatellitePosition = {
  name: string;
  latitude: number;
  longitude: number;
};

type TLEData = {
  name: string;
  line1: string;
  line2: string;
};

const fetchTLEData = async (): Promise<TLEData[]> => {
  const response = await fetch(
    'https://celestrak.com/NORAD/elements/resource.txt'
  );
  const data = await response.text();
  const lines = data.split('\n');
  const tleData: TLEData[] = [];

  for (let i = 0; i < lines.length; i += 3) {
    const name = lines[i]?.trim();
    const line1 = lines[i + 1]?.trim();
    const line2 = lines[i + 2]?.trim();

    if (name && line1 && line2) {
      if (name === 'LANDSAT 8' || name === 'LANDSAT 9') {
        tleData.push({ name, line1, line2 });
      }
    }
  }

  return tleData;
};

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

type DashboardMapProps = {
  location: {
    latitude: number;
    longitude: number;
  };
};

type GeoJsonFeature = {
  type: string;
  geometry: {
    type: string;
    coordinates: number[][][];
  };
  properties: {
    PATH: number;
    ROW: number;
  };
};

const DashboardMap: React.FC<DashboardMapProps> = ({ location }) => {
  const [isGridVisible, setIsGridVisible] = useState(false);
  const [satellitePositions, setSatellitePositions] = useState<
    SatellitePosition[]
  >([]);
  const [gridData, setGridData] = useState<GeoJsonObject | null>(null);

  useEffect(() => {
    const getSatellitePositions = async () => {
      const tleData = await fetchTLEData();
      const positions: SatellitePosition[] = [];

      tleData.forEach((tle) => {
        const satrec = satellite.twoline2satrec(tle.line1, tle.line2);
        const positionAndVelocity = satellite.propagate(satrec, new Date());
        const positionGd = satellite.eciToGeodetic(
          positionAndVelocity.position as satellite.EciVec3<number>,
          satellite.gstime(new Date())
        );
        const longitude = satellite.degreesLong(positionGd.longitude);
        const latitude = satellite.degreesLat(positionGd.latitude);

        positions.push({
          name: tle.name,
          latitude,
          longitude,
        });
      });

      setSatellitePositions(positions);
    };

    getSatellitePositions();

    const interval = setInterval(getSatellitePositions, 5000);
    return () => clearInterval(interval);
  }, []);

  const calculateSurroundingGrids = (lat: number, lon: number) => {
    const isLocationInGrid = (
      feature: GeoJsonFeature,
      lat: number,
      lon: number
    ) => {
      const coordinates = feature.geometry.coordinates[0];
      let inside = false;

      for (
        let i = 0, j = coordinates.length - 1;
        i < coordinates.length;
        j = i++
      ) {
        const [xi, yi] = coordinates[i];
        const [xj, yj] = coordinates[j];
        const intersect =
          yi > lat !== yj > lat &&
          lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
        if (intersect) inside = !inside;
      }

      return inside;
    };

    let centerGrid: GeoJsonFeature | null = null;
    (data.features as GeoJsonFeature[]).forEach((feature) => {
      if (isLocationInGrid(feature, lat, lon)) {
        centerGrid = feature;
      }
    });

    if (!centerGrid) {
      console.error('No center grid found for the given location.');
      return;
    }

    const grids: GeoJsonFeature[] = [centerGrid];
    const { PATH, ROW } = centerGrid.properties;

    const findGridByPathRow = (path: number, row: number) => {
      return (data.features as GeoJsonFeature[]).find(
        (feature) =>
          feature.properties.PATH === path && feature.properties.ROW === row
      );
    };

    const surroundingGrids = [
      { path: PATH, row: ROW - 1 },
      { path: PATH, row: ROW + 1 },
      { path: PATH - 1, row: ROW },
      { path: PATH + 1, row: ROW },
      { path: PATH - 1, row: ROW - 1 },
      { path: PATH + 1, row: ROW - 1 },
      { path: PATH - 1, row: ROW + 1 },
      { path: PATH + 1, row: ROW + 1 },
    ];

    surroundingGrids.forEach(({ path, row }) => {
      const grid = findGridByPathRow(path, row);
      if (grid) {
        grids.push(grid);
      }
    });

    setGridData({
      type: 'FeatureCollection',
      features: grids as GeoJsonObject[],
    });
  };

  useEffect(() => {
    if (isGridVisible) {
      calculateSurroundingGrids(location.latitude, location.longitude);
    }
  }, [isGridVisible, location]);

  return (
    <div>
      <MapContainer
        className="z-10 h-[500px] w-full rounded"
        center={[location.latitude, location.longitude]}
        zoom={3}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[location.latitude, location.longitude]}></Marker>
        {satellitePositions.map(({ name, latitude, longitude }) => (
          <Marker
            key={name}
            position={[latitude, longitude]}
            icon={L.icon({
              iconUrl: '/satellite_icon.png',
              iconSize: [25, 25],
            })}
          >
            <Popup>{name}</Popup>
          </Marker>
        ))}
        {isGridVisible && gridData && (
          <GeoJSON
            data={gridData}
            style={() => ({ color: 'red', weight: 0.5, fillOpacity: 0 })}
            onEachFeature={(feature: any, layer) => {
              layer.bindTooltip(
                `Path: ${feature.properties.PATH}, Row: ${feature.properties.ROW}`,
                {
                  permanent: false,
                  direction: 'auto',
                }
              );
            }}
          />
        )}
      </MapContainer>
      <div className="mt-2 flex items-center space-x-2">
        <Checkbox
          id="grid"
          onCheckedChange={(event) => setIsGridVisible(!!event)}
        />
        <label
          htmlFor="grid"
          className="text-muted-foreground text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Show WRS-2 grid
        </label>
      </div>
    </div>
  );
};

export default DashboardMap;
