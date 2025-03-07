import moment from 'moment/moment';

import { Icons } from '@/components/shared/icons';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { api } from '@/lib/api';

export const NotificationsList = async () => {
  const { data } = await api<
    {
      title: string;
      start_time: string;
      end_time: string;
      notification_sent: string;
    }[]
  >('data/events');

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-auto flex-col items-center px-2 py-4 md:p-4 lg:w-full lg:flex-row lg:justify-start lg:gap-3 lg:py-2"
        >
          <Icons.bell className="block" />
          <span className="text-[13px] md:hidden lg:block lg:text-base">
            Notifications
          </span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>
            You have {data?.slice(0, 3).length} unread notifications.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-2">
          {data?.length &&
            data
              .slice(0, 3)
              .map(({ end_time, notification_sent, start_time, title }, i) => (
                <div
                  key={i}
                  className="space-y-1 py-4 [&:not(:last-child)]:border-b"
                >
                  <h3 className="font-medium">{title}</h3>
                  <p className="text-muted-foreground">
                    {new Date(start_time)
                      .toISOString()
                      .slice(0, 16)
                      .replace('T', ' ')}{' '}
                    -{' '}
                    {new Date(end_time)
                      .toISOString()
                      .slice(0, 16)
                      .replace('T', ' ')}
                  </p>
                  <span className="text-muted-foreground/50 block text-sm">
                    {notification_sent}
                  </span>
                </div>
              ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
