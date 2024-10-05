import { DashboardMap } from '@/components/location/dashboard-map';
import { Icons } from '@/components/shared/icons';
import { Button } from '@/components/ui/button';

const Home = () => {
  return (
    <div className="w-full max-w-[1550px] overflow-y-auto p-5 md:pt-7 lg:px-8 lg:pt-9">
      <div className="flex items-center justify-between">
        <h1 className="font-logo text-center text-3xl md:hidden">LandWatch</h1>
        <h2 className="hidden text-center text-2xl font-semibold tracking-tight md:block">
          Dashboard
        </h2>
        <Button size="icon" variant="outline">
          <Icons.user />
        </Button>
      </div>
      <div className="mb-20 mt-5 md:mb-10">
        <DashboardMap />
      </div>
    </div>
  );
};

export default Home;
