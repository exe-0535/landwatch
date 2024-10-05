import { PropsWithChildren } from 'react';

import { Navbar } from '@/components/shared/navbar';

const GeneralLayout = async ({ children }: PropsWithChildren) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Navbar />
      <div className="flex w-full justify-center">{children}</div>
    </div>
  );
};

export default GeneralLayout;
