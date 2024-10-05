'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { authAction } from '@/actions/actions';
import { Icons } from '@/components/shared/icons';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const defaultValues = {
  email: '',
  password: '',
};

const authFormSchema = z.object({
  email: z.string().min(1, 'Email field is required').email(),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password is too short')
    .max(50, 'Password is too long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d\W]).+$/,
      'Password must contain one lowercase, one uppercase letter, a number, or a special character'
    ),
});

type TAuthFormSchema = z.infer<typeof authFormSchema>;

type AuthFormProps = {
  isSignUp: boolean;
};

export const AuthForm = ({ isSignUp }: AuthFormProps) => {
  const form = useForm<TAuthFormSchema>({
    resolver: zodResolver(authFormSchema),
    defaultValues,
  });
  const { toast } = useToast();

  const onSubmit = async (values: TAuthFormSchema) => {
    const error = await authAction(isSignUp, values);

    if (!error) return;

    toast({
      variant: 'destructive',
      title: 'Oops! Something went wrong.',
      description: error.error,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-sm">
        <div className="space-y-3">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="email"
                    className={
                      form.formState.errors.email && 'border-destructive'
                    }
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="password"
                    className={
                      form.formState.errors.password && 'border-destructive'
                    }
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          disabled={form.formState.isSubmitting}
          className="mt-5 w-full"
          type="submit"
        >
          {form.formState.isSubmitting && (
            <Icons.loader className="mr-2 size-4 animate-spin" />
          )}
          Submit
        </Button>
      </form>
    </Form>
  );
};
