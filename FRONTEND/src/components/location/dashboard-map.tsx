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

const fetchTLEData = async () => {
  const response = await fetch(
    'https://celestrak.com/NORAD/elements/resource.txt'
  );

  const data = await response.text();

  const lines = data.split('\n');
  const tleData = [];

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

const DashboardMap = ({ location }: DashboardMapProps) => {
  const [isGridVisible, setIsGridVisible] = useState(false);
  const [satellitePositions, setSatellitePositions] = useState<
    SatellitePosition[]
  >([]);

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
        {isGridVisible && (
          <GeoJSON
            data={data as GeoJsonObject}
            style={() => ({ color: 'red', weight: 0.5, fillOpacity: 0 })}
            onEachFeature={(feature, layer) => {
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
