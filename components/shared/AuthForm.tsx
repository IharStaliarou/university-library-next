'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
  UseFormReturn,
  DefaultValues,
} from 'react-hook-form';
import { ZodType } from 'zod';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

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
import { FIELD_NAMES, FIELD_TYPES } from '@/constants';
import FileUpload from './FileUpload';

interface IProps<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>;
  type: 'SIGN_UP' | 'SIGN_IN';
}

const AuthForm = <T extends FieldValues>({
  type,
  schema,
  defaultValues,
  onSubmit,
}: IProps<T>) => {
  const router = useRouter();
  const isSignIn = type === 'SIGN_IN';
  const form: UseFormReturn<T> = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<T> = async (data) => {
    const result = await onSubmit(data);
    if (result.success) {
      toast.success('Success!', {
        description: isSignIn
          ? 'You have successfully signed in'
          : 'You have successfully signed up',
      });

      router.push('/');
    } else {
      toast.error(`Error ${isSignIn ? 'Sign in' : 'Sign up'}`, {
        description: result.error && 'An error occurred.',
      });
    }
  };

  return (
    <div className='flex flex-col gap-4'>
      <h1 className='text-2xl font-semibold font-white'>
        {type === 'SIGN_IN'
          ? 'Welcome Back to UniLib'
          : 'Create your library account'}
      </h1>
      <p className='text-light-100'>
        {isSignIn
          ? 'Access the vast collection of resource, and stay updated'
          : 'Please complete all fields and upload a valid university ID to gain'}
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
          {Object.keys(defaultValues).map((field) => (
            <FormField
              key={field}
              control={form.control}
              name={field as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='capitalize'>
                    {FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}
                  </FormLabel>
                  <FormControl>
                    {field.name === 'universityCard' ? (
                      <FileUpload
                        type='image'
                        accept='image/*'
                        placeholder='Upload your ID'
                        folder='ids'
                        variant='dark'
                        onFileChange={field.onChange}
                      />
                    ) : (
                      <Input
                        required
                        type={
                          FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]
                        }
                        placeholder={field.name}
                        {...field}
                        className='form-input'
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <Button type='submit' className='form-btn'>
            {isSignIn ? 'Sign In' : 'Sign Up'}
          </Button>
        </form>
      </Form>
      <p className=' text-center text-base font-medium'>
        {isSignIn ? 'New to UniLib?' : 'Already have an account?'}
        <Link
          href={isSignIn ? '/sign-up' : '/sign-in'}
          className='font-bold text-primary'
        >
          {` ${isSignIn ? 'Create an Account' : 'Sign In'}`}
        </Link>
      </p>
    </div>
  );
};

export default AuthForm;
