'use client';

import 'leaflet/dist/leaflet.css';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import { zodResolver } from '@hookform/resolvers/zod';
import L from 'leaflet';
import { z } from 'zod';

import { setLocationAction } from '@/actions/actions';
import { Icons } from '@/components/shared/icons';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { addMinutes } from 'date-fns';
import { format } from 'path';

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const selectLocationFormSchema = z.object({
  latitude: z.string().refine(
    (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num >= -90 && num <= 90;
    },
    {
      message: 'Latitude must be between -90 and 90',
    }
  ),
  longitude: z.string().refine(
    (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num >= -180 && num <= 180;
    },
    {
      message: 'Longitude must be between -180 and 180',
    }
  ),
  timeForNotifications: z.string({
    required_error:
      'Please select the appropriate lead time for notifications.',
  }),
  cloudCoverLimit: z.string({
    required_error: 'Please select the cloud cover limit',
  }),
});

type TSelectLocationFormSchema = z.infer<typeof selectLocationFormSchema>;

const MapClickHandler = ({
  setCoords,
  setValue,
}: {
  setCoords: (coords: L.LatLngExpression) => void;
  setValue: (field: 'latitude' | 'longitude', value: any) => void;
}) => {
  useMapEvents({
    click(e) {
      const newCoords = [e.latlng.lat, e.latlng.lng] as L.LatLngExpression;
      setCoords(newCoords);
      setValue('latitude', `${e.latlng.lat}`);
      setValue('longitude', `${e.latlng.lng}`);
    },
  });
  return null;
};

type LocationModalProps = {
  location: {
    latitude: number;
    longitude: number;
    timeForNotifications: number;
    cloudCoverLimit: number;
  };
};

const LocationModal = ({ location }: LocationModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<L.LatLngExpression>([
    location.latitude,
    location.longitude,
  ]);
  const mapRef = useRef<L.Map | null>(null);
  const form = useForm<TSelectLocationFormSchema>({
    resolver: zodResolver(selectLocationFormSchema),
    defaultValues: {
      latitude: `${location.latitude}`,
      longitude: `${location.longitude}`,
      timeForNotifications: `${location.timeForNotifications}`,
      cloudCoverLimit: `${location.cloudCoverLimit}`,
    },
  });
  const latitude = form.watch('latitude');
  const longitude = form.watch('longitude');
  const { toast } = useToast();

  useEffect(() => {
    if (latitude && longitude) {
      const newCoords = [+latitude, +longitude] as L.LatLngExpression;
      setCoords(newCoords);

      if (mapRef.current) {
        const currentZoom = mapRef.current.getZoom();
        mapRef.current.setView(newCoords, currentZoom);
      }
    }
  }, [latitude, longitude]);

  const onSubmit = async ({
    latitude,
    longitude,
    timeForNotifications,
    cloudCoverLimit,
  }: TSelectLocationFormSchema) => {
    const newCords = [+latitude, +longitude] as L.LatLngExpression;
    setCoords(newCords);

    if (mapRef.current) {
      mapRef.current.setView(newCords);
    }

    const { data, error } = await setLocationAction({
      latitude: +latitude,
      longitude: +longitude,
      notification_advance: parseInt(timeForNotifications.match(/\d+/)![0]),
      cloud_coverage: +cloudCoverLimit,
    });

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Oops! Something went wrong.',
      });
    }

    if (data) {
      const date = `${addMinutes(new Date(), 42)}`;

      toast({
        title: 'Location saved succesfully',
        description: `Next landsat will pass at ${date.split(' GMT')[0]}`,
      });

      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={
            'flex h-auto flex-col items-center px-2 py-4 md:p-4 lg:w-full lg:flex-row lg:justify-start lg:gap-3 lg:py-2'
          }
        >
          <Icons.pin className="block" />
          <span className="text-[13px] md:hidden lg:block lg:text-base">
            My Location
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Location</DialogTitle>
          <DialogDescription>
            Pick on the map or enter latitude and longitude
          </DialogDescription>
        </DialogHeader>
        <MapContainer
          ref={mapRef}
          className="z-10 h-[300px] w-full rounded"
          center={coords}
          zoom={8}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={coords}></Marker>
          <MapClickHandler setCoords={setCoords} setValue={form.setValue} />
        </MapContainer>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-3 sm:flex sm:gap-3 sm:space-y-0">
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem className="sm:w-1/2">
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="latitude"
                        className={
                          form.formState.errors.latitude && 'border-destructive'
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem className="sm:w-1/2">
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="longitude"
                        className={
                          form.formState.errors.longitude &&
                          'border-destructive'
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-3 sm:flex sm:gap-3 sm:space-y-0">
              <FormField
                control={form.control}
                name="timeForNotifications"
                render={({ field }) => (
                  <FormItem className="sm:w-1/2">
                    <FormLabel>Lead time for notifications</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={`${location.timeForNotifications}`}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">1 hour</SelectItem>
                        <SelectItem value="24">24 hours</SelectItem>
                        <SelectItem value="48">48 hours</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cloudCoverLimit"
                render={({ field }) => (
                  <FormItem className="sm:w-1/2">
                    <FormLabel>Cloud cover limit</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={`${location.cloudCoverLimit}`}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="15">15%</SelectItem>
                        <SelectItem value="20">20%</SelectItem>
                        <SelectItem value="30">30%</SelectItem>
                        <SelectItem value="40">40%</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              disabled={form.formState.isSubmitting}
              className="w-full"
              type="submit"
            >
              {form.formState.isSubmitting && (
                <Icons.loader className="mr-2 size-4 animate-spin" />
              )}
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default LocationModal;
