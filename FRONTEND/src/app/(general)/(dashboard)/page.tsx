import dynamic from 'next/dynamic';

import { UserDropdown } from '@/components/shared/user-dropdown';
import { api } from '@/lib/api';

const DashboardMap = dynamic(
  () => import('@/components/location/dashboard-map'),
  { ssr: false }
);

const Home = async () => {
  const { data: user } = await api<{ email: string }>('/auth/me');
  const { data } = await api<{ latitude: number; longitude: number }>(
    'auth/last-location',
    { next: { tags: ['location'] } }
  );

  return (
    <div className="w-full max-w-[1550px] overflow-y-auto p-5 md:pt-7 lg:px-8 lg:pt-9">
      <div className="flex items-center justify-between">
        <h1 className="font-logo text-center text-3xl md:hidden">LandWatch</h1>
        <h2 className="hidden text-center text-2xl font-semibold tracking-tight md:block">
          Dashboard
        </h2>
        {user && <UserDropdown email={user?.email} />}
      </div>
      <div className="mb-20 mt-5 md:mb-10">
        {data && <DashboardMap location={data} />}
      </div>
    </div>
  );
};

export default Home;
