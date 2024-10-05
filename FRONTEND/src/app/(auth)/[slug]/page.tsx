import Link from 'next/link';
import { notFound } from 'next/navigation';

import { AuthForm } from '@/components/auth/auth-form';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const authPages = {
  SIGN_IN: 'sign-in',
  SIGN_UP: 'sign-up',
};

const AuthPage = ({ params }: { params: { slug: string } }) => {
  const isSignUp = params.slug === authPages.SIGN_UP;

  if (params.slug !== authPages.SIGN_UP && params.slug !== authPages.SIGN_IN) {
    notFound();
  }

  return (
    <div className="lg:flex">
      <div className="flex h-screen flex-col items-center px-5 py-10 md:justify-center lg:w-1/2">
        <h1 className="font-logo text-3xl lg:hidden">LandWatch</h1>
        <h2 className="mb-1 mt-5 text-2xl font-bold tracking-tight">
          {isSignUp ? 'Register' : 'Login'}
        </h2>
        <p className="text-muted-foreground mb-3 max-w-sm text-center">
          {isSignUp
            ? ' Enter your credentials below to create your account'
            : 'Enter your credentials below to login to your account'}
        </p>
        <AuthForm isSignUp={isSignUp} />
        {isSignUp ? (
          <p className="mt-3 text-center">
            Already have an account?{' '}
            <Link
              href={`/${authPages.SIGN_IN}`}
              className={cn(
                buttonVariants({ variant: 'link' }),
                'm-0 p-0 text-base'
              )}
            >
              Log in
            </Link>
          </p>
        ) : (
          <p className="mt-3 text-center">
            You do not have an account yet?{' '}
            <Link
              href={`/${authPages.SIGN_UP}`}
              className={cn(
                buttonVariants({ variant: 'link' }),
                'm-0 h-fit p-0 text-base'
              )}
            >
              Register
            </Link>
          </p>
        )}
      </div>
      <div className="bg-primary hidden h-screen w-1/2 items-center justify-center lg:flex">
        <h1 className="font-logo text-7xl text-white xl:text-8xl">LandWatch</h1>
      </div>
    </div>
  );
};

export default AuthPage;
