import { ComparisonChart } from './comparison-chart';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

const landsatData = [
  {
    id: 1,
    ndvi: 0.72,
    evi: 0.45,
    reflectanceIntensity: 0.78,
    humidity: 65,
    amplitude: 1.5,
  },
  {
    id: 2,
    ndvi: 0.61,
    evi: 0.39,
    reflectanceIntensity: 0.83,
    humidity: 72,
    amplitude: 1.3,
  },
  {
    id: 3,
    ndvi: 0.84,
    evi: 0.52,
    reflectanceIntensity: 0.76,
    humidity: 58,
    amplitude: 1.7,
  },
  {
    id: 4,
    ndvi: 0.55,
    evi: 0.33,
    reflectanceIntensity: 0.81,
    humidity: 70,
    amplitude: 1.4,
  },
  {
    id: 5,
    ndvi: 0.65,
    evi: 0.44,
    reflectanceIntensity: 0.79,
    humidity: 60,
    amplitude: 1.6,
  },
];

const earthData = [
  {
    id: 1,
    ndvi: 0.68,
    evi: 0.42,
    reflectanceIntensity: 0.74,
    humidity: 62,
    amplitude: 1.2,
  },
  {
    id: 2,
    ndvi: 0.59,
    evi: 0.36,
    reflectanceIntensity: 0.81,
    humidity: 75,
    amplitude: 1.1,
  },
  {
    id: 3,
    ndvi: 0.78,
    evi: 0.47,
    reflectanceIntensity: 0.72,
    humidity: 55,
    amplitude: 1.8,
  },
  {
    id: 4,
    ndvi: 0.5,
    evi: 0.3,
    reflectanceIntensity: 0.86,
    humidity: 68,
    amplitude: 1.3,
  },
  {
    id: 5,
    ndvi: 0.72,
    evi: 0.4,
    reflectanceIntensity: 0.77,
    humidity: 64,
    amplitude: 1.5,
  },
];

const calculateComparisonData = () => {
  return landsatData.map((landsatItem, index) => {
    const earthItem = earthData[index];

    return {
      id: landsatItem.id,
      ndviDifference: (landsatItem.ndvi - earthItem.ndvi).toFixed(2),
      eviDifference: (landsatItem.evi - earthItem.evi).toFixed(2),
      reflectanceIntensityDifference: (
        landsatItem.reflectanceIntensity - earthItem.reflectanceIntensity
      ).toFixed(2),
      humidityDifference: landsatItem.humidity - earthItem.humidity,
      amplitudeDifference: (
        landsatItem.amplitude - earthItem.amplitude
      ).toFixed(2),
    };
  });
};

export const ComparisonTable = () => {
  const comparisonData = calculateComparisonData();

  return (
    <div className="rounded border p-5">
      <div className="sm:flex justify-between items-center">
        <h3 className="mb-3 text-xl font-semibold tracking-tight">
          Landsat vs Earth Comparison
        </h3>
        <Button className="hidden sm:block">Upload data</Button>
      </div>
      <Tabs defaultValue="landsat">
        <TabsList>
          <TabsTrigger value="landsat">Landsat</TabsTrigger>
          <TabsTrigger value="earth">Earth</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>
        <TabsContent value="landsat">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NDVI</TableHead>
                <TableHead>EVI</TableHead>
                <TableHead>Reflectance Intensity</TableHead>
                <TableHead>Humidity</TableHead>
                <TableHead>Amplitude</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {landsatData.map(
                ({
                  id,
                  ndvi,
                  evi,
                  reflectanceIntensity,
                  humidity,
                  amplitude,
                }) => (
                  <TableRow key={id}>
                    <TableCell>{ndvi}</TableCell>
                    <TableCell>{evi}</TableCell>
                    <TableCell>{reflectanceIntensity}</TableCell>
                    <TableCell>{humidity}</TableCell>
                    <TableCell>{amplitude}</TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="earth">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NDVI</TableHead>
                <TableHead>EVI</TableHead>
                <TableHead>Reflectance Intensity</TableHead>
                <TableHead>Humidity</TableHead>
                <TableHead>Amplitude</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {earthData.map(
                ({
                  id,
                  ndvi,
                  evi,
                  reflectanceIntensity,
                  humidity,
                  amplitude,
                }) => (
                  <TableRow key={id}>
                    <TableCell>{ndvi}</TableCell>
                    <TableCell>{evi}</TableCell>
                    <TableCell>{reflectanceIntensity}</TableCell>
                    <TableCell>{humidity}</TableCell>
                    <TableCell>{amplitude}</TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="comparison">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NDVI Difference</TableHead>
                <TableHead>EVI Difference</TableHead>
                <TableHead>Reflectance Intensity Difference</TableHead>
                <TableHead>Humidity Difference</TableHead>
                <TableHead>Amplitude Difference</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comparisonData.map(
                ({
                  id,
                  ndviDifference,
                  eviDifference,
                  reflectanceIntensityDifference,
                  humidityDifference,
                  amplitudeDifference,
                }) => (
                  <TableRow key={id}>
                    <TableCell
                      className={
                        +ndviDifference > 0
                          ? 'text-green-500'
                          : 'text-destructive'
                      }
                    >
                      {ndviDifference}
                    </TableCell>
                    <TableCell
                      className={
                        +eviDifference > 0
                          ? 'text-green-500'
                          : 'text-destructive'
                      }
                    >
                      {eviDifference}
                    </TableCell>
                    <TableCell
                      className={
                        +reflectanceIntensityDifference > 0
                          ? 'text-green-500'
                          : 'text-destructive'
                      }
                    >
                      {reflectanceIntensityDifference}
                    </TableCell>
                    <TableCell
                      className={
                        +humidityDifference > 0
                          ? 'text-green-500'
                          : 'text-destructive'
                      }
                    >
                      {humidityDifference}
                    </TableCell>
                    <TableCell
                      className={
                        +amplitudeDifference > 0
                          ? 'text-green-500'
                          : 'text-destructive'
                      }
                    >
                      {amplitudeDifference}
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
      <ComparisonChart />
    </div>
  );
};
