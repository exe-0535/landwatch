'use server';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { api } from '@/lib/api';
type Tokens = {
  access: string;
  refresh: string;
};
export const authAction = async (
  isSignUp: boolean,
  body: {
    email: string;
    password: string;
  }
) => {
  const endpoint = isSignUp ? 'auth/sign-up' : 'auth/sign-in';
  const { data, error } = await api<Tokens>(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (error) return error;
  if (data) {
    const expirationDate = new Date();
    expirationDate.setFullYear(new Date().getFullYear() + 1);
    cookies().set('access', data.access, { expires: expirationDate });
    cookies().set('refresh', data.access, { expires: expirationDate });
    redirect('/');
  }
};
export const logoutAction = async () => {
  cookies().delete('access');
  cookies().delete('refresh');

  redirect('/sign-in');
};

export const setLocationAction = async (body: {
  latitude: number;
  longitude: number;
}) => {
  const { data, error } = await api('auth/location', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  revalidateTag('location');

  return { data, error };
};
