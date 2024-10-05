'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

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
export const AuthForm = () => {
  const form = useForm<TAuthFormSchema>({
    resolver: zodResolver(authFormSchema),
    defaultValues,
  });
  const onSubmit = async (values: TAuthFormSchema) => {
    console.log(values);
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
