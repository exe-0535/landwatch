'use client';

import Image from 'next/image';

import { Icons } from './icons';

import { logoutAction } from '@/actions/actions';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const UserDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="outline">
          <Icons.user />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="flex flex-col items-center justify-center gap-2 py-3">
          <Image
            className="rounded-full"
            src="/user_avatar.png"
            alt="user avatar"
            width={50}
            height={50}
          />
          <p>test@gmail.com</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={async () => await logoutAction()}>
          <Icons.logOut className="mr-2 size-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
