import dynamic from 'next/dynamic';
import Link from 'next/link';

import { NotificationsList } from '@/components/notifications/notifications-list';
import { Icons } from '@/components/shared/icons';
import { buttonVariants } from '@/components/ui/button';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

const LocationModal = dynamic(
  () => import('@/components/location/location-modal'),
  { ssr: false }
);

export const Navbar = async () => {
  const { data } = await api<{ latitude: number; longitude: number }>(
    'auth/last-location'
  );

  return (
    <div className="md:flex md:h-screen md:w-fit md:flex-col md:items-center md:border-r md:py-8 lg:items-start lg:py-10">
      <Link href="/" className="hidden md:mb-8 md:block lg:ml-9">
        <h1 className="font-logo text-2xl lg:text-3xl">
          <span className="lg:hidden">LW</span>
          <span className="hidden lg:block">LandWatch</span>
        </h1>
      </Link>
      <nav className="bg-background fixed bottom-0 left-0 z-50 flex w-full items-center justify-between border-t px-5 sm:px-10 md:static md:w-fit md:flex-col md:gap-2 md:border-none md:px-4 lg:w-[350px] lg:gap-4 lg:px-5">
        <Link
          href="/#"
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'flex h-auto flex-col items-center px-2 py-4 md:p-4 lg:w-full lg:flex-row lg:justify-start lg:gap-3 lg:py-2'
          )}
        >
          <Icons.dashboard className="block" />
          <span className="text-[13px] md:hidden lg:block lg:text-base">
            Dashboard
          </span>
        </Link>
        <LocationModal
          location={{
            latitude: data?.latitude as number,
            longitude: data?.longitude as number,
          }}
        />
        <Link
          href="/data"
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'flex h-auto flex-col items-center px-2 py-4 md:p-4 lg:w-full lg:flex-row lg:justify-start lg:gap-3 lg:py-2'
          )}
        >
          <Icons.chart className="block" />
          <span className="text-[13px] md:hidden lg:block lg:text-base">
            Data
          </span>
        </Link>
        <NotificationsList />
      </nav>
    </div>
  );
};
