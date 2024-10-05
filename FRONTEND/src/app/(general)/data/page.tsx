import { DataTable } from '@/components/data/data-table';
import { DatePickerWithRange } from '@/components/data/date-range-picker';

const DataPage = () => {
  return (
    <div className="w-full max-w-[1550px] overflow-y-auto p-5 md:pt-7 lg:px-8 lg:pt-9">
      <div className="flex items-center justify-between">
        <h2 className="hidden text-center text-2xl font-semibold tracking-tight md:block">
          Data Visualization
        </h2>
        <DatePickerWithRange />
      </div>
      <div className="mb-20 mt-5 md:mb-10">
        <DataTable />
      </div>
    </div>
  );
};

export default DataPage;
