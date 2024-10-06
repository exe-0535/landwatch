import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const tableData = [
  {
    id: 1,
    dateTime: '2024-10-05 14:30',
    landsat: 'Landsat 8',
    latLong: '45.1234, 122.1234',
    wrs: 'Path 44, Row 34',
    cloudCover: '10%',
    imageQuality: '1920x1920',
  },
  {
    id: 2,
    dateTime: '2024-10-06 10:15',
    landsat: 'Landsat 9',
    latLong: '46.5678, 123.5678',
    wrs: 'Path 45, Row 35',
    cloudCover: '5%',
    imageQuality: '2560x2560',
  },
  {
    id: 3,
    dateTime: '2024-09-29 08:00',
    landsat: 'Landsat 9',
    latLong: '47.8765, 124.9876',
    wrs: 'Path 46, Row 36',
    cloudCover: '20%',
    imageQuality: '2048x2048',
  },
  {
    id: 4,
    dateTime: '2024-09-25 16:45',
    landsat: 'Landsat 8',
    latLong: '44.7654, 121.7654',
    wrs: 'Path 43, Row 33',
    cloudCover: '15%',
    imageQuality: '3000x3000',
  },
  {
    id: 5,
    dateTime: '2024-09-20 12:30',
    landsat: 'Landsat 9',
    latLong: '48.4321, 125.4321',
    wrs: 'Path 47, Row 37',
    cloudCover: '8%',
    imageQuality: '3200x3200',
  },
];

export const LandsatTable = () => {
  return (
    <div className="rounded border p-5">
      <h3 className="mb-3 text-xl font-semibold tracking-tight">
        Landsat Data
      </h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-medium">Landsat</TableHead>
            <TableHead>Date & time</TableHead>
            <TableHead>Latitude/Longitude</TableHead>
            <TableHead>WRS</TableHead>
            <TableHead>Cloud cover</TableHead>
            <TableHead>Image quality</TableHead>
            <TableHead className="text-right">Download CSV</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map(
            ({
              id,
              landsat,
              dateTime,
              latLong,
              wrs,
              cloudCover,
              imageQuality,
            }) => (
              <TableRow key={id}>
                <TableCell className="font-medium">{landsat}</TableCell>
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
    </div>
  );
};
