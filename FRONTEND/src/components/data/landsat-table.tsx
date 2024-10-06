'use client';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Slider } from '@/components/ui/slider';
import { useState } from 'react';

const tableData = [
  {
    id: 1,
    landsatName: 'LC08_L2SP_186025_20240924_20240928_02_T1_ST_B10',
    dateTime: '2024-10-05 14:30',
    landsatId: 'Landsat 8',
    latLong: '45.1234, 122.1234',
    wrs: 'Path 44, Row 34',
    cloudCover: '10%',
    imageQuality: '1920x1920',
  },
  {
    id: 2,
    landsatName: 'LC08_L2SP_186025_20241005_20241009_02_T1_ST_B10',
    dateTime: '2024-10-06 10:15',
    landsatId: 'Landsat 9',
    latLong: '46.5678, 123.5678',
    wrs: 'Path 45, Row 35',
    cloudCover: '5%',
    imageQuality: '2560x2560',
  },
  {
    id: 3,
    landsatName: 'LC08_L2SP_186025_20241010_20241014_02_T1_ST_B10',
    dateTime: '2024-09-29 08:00',
    landsatId: 'Landsat 9',
    latLong: '47.8765, 124.9876',
    wrs: 'Path 46, Row 36',
    cloudCover: '20%',
    imageQuality: '2048x2048',
  },
  {
    id: 4,
    landsatName: 'LC08_L2SP_186025_20241015_20241019_02_T1_ST_B10',
    dateTime: '2024-09-25 16:45',
    landsatId: 'Landsat 8',
    latLong: '44.7654, 121.7654',
    wrs: 'Path 43, Row 33',
    cloudCover: '15%',
    imageQuality: '3000x3000',
  },
  {
    id: 5,
    landsatName: 'LC08_L2SP_186025_20241020_20241024_02_T1_ST_B10',
    dateTime: '2024-09-20 12:30',
    landsatId: 'Landsat 9',
    latLong: '48.4321, 125.4321',
    wrs: 'Path 47, Row 37',
    cloudCover: '8%',
    imageQuality: '3200x3200',
  },
];

export const LandsatTable = () => {
  const [maxCloudCover, setMaxCloudCover] = useState(15);

  const filteredData = tableData.filter(
    (row) => parseInt(row.cloudCover) <= maxCloudCover
  );

  return (
    <div className="rounded border p-5">
      <h3 className="mb-3 text-xl font-semibold tracking-tight">
        Landsat Data
      </h3>
      <div className="mb-4">
        <label
          htmlFor="cloud-cover-filter"
          className="text-muted-foreground mb-2 block text-sm font-medium"
        >
          Max Cloud Cover: {maxCloudCover}%
        </label>
        <Slider
          id="cloud-cover-filter"
          min={0}
          max={100}
          step={1}
          value={[maxCloudCover]}
          onValueChange={(value) => setMaxCloudCover(value[0])}
          className="w-full"
        />
      </div>
      {filteredData.length ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium">Landsat ID</TableHead>
              <TableHead>Landsat name</TableHead>
              <TableHead>Date & time</TableHead>
              <TableHead>Latitude/Longitude</TableHead>
              <TableHead>WRS</TableHead>
              <TableHead>Cloud cover</TableHead>
              <TableHead>Image quality</TableHead>
              <TableHead className="text-right">Download CSV</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map(
              ({
                id,
                landsatId,
                landsatName,
                dateTime,
                latLong,
                wrs,
                cloudCover,
                imageQuality,
              }) => (
                <TableRow key={id}>
                  <TableCell className="font-medium">{landsatId}</TableCell>
                  <TableCell>{landsatName}</TableCell>
                  <TableCell>{dateTime}</TableCell>
                  <TableCell>{latLong}</TableCell>
                  <TableCell>{wrs}</TableCell>
                  <TableCell>{cloudCover}</TableCell>
                  <TableCell>{imageQuality}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline">Download</Button>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      ) : (
        <div className="flex flex-col items-center justify-center py-10">
          <h4 className="text-xl font-semibold tracking-tight">
            No data to show
          </h4>
          <p className="text-muted-foreground">
            Change your filters to show data
          </p>
        </div>
      )}
    </div>
  );
};
