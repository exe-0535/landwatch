import { ComparisonTable } from '@/components/data/comparison-table';
import { DatePickerWithRange } from '@/components/data/date-range-picker';
import { LandsatTable } from '@/components/data/landsat-table';

const DataPage = () => {
  return (
    <div className="w-full max-w-[1550px] overflow-y-auto p-5 md:pt-7 lg:px-8 lg:pt-9">
      <div className="items-center justify-between sm:flex">
        <h2 className="mb-3 text-2xl font-semibold tracking-tight sm:mb-0 md:block">
          Data Visualization
        </h2>
        <DatePickerWithRange />
      </div>
      <div className="mb-20 mt-5 space-y-5 md:mb-10">
        <LandsatTable />
        <ComparisonTable />
      </div>
    </div>
  );
};

export default DataPage;
