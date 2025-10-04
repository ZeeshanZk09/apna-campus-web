'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLoginUser } from '@/lib/queries/userQueries';
import { useForm } from '@tanstack/react-form';
import { User } from '@/app/generated/prisma/browser';
import { Eye, EyeClosed } from 'lucide-react';

export default function LoginForm() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<string>('');
  const [see, setSee] = useState<boolean>(true);
  const router = useRouter();

  const mutation = useLoginUser();
  const form = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },

    onSubmit: async ({ value }) => {
      console.log('Submitting form with values:', value);
      setError('');
      setSuccess('');

      try {
        const mutationData: Omit<
          Partial<User>,
          'id' | 'createdAt' | 'updatedAt' | 'isBlocked' | 'isDeleted' | 'role'
        > = {
          username: value.username,
          email: value.email,
          password: value.password,
        };

        console.log('Mutation data:', mutationData);

        mutation.mutate(mutationData as User, {
          onSuccess: (user) => {
            console.log(user);
            setSuccess('Registration successful! Redirecting...');
            setTimeout(() => router.push('/profile'), 2000);
          },
          onError: (err) => {
            console.error('Mutation error:', err);
            setError(err.message || 'Registration failed');
          },
        });
      } catch (err) {
        console.error('Submission error:', err);
        setError('Failed to upload image');
      }
    },
  });

  return (
    <div className='min-h-screen px-10 flex flex-col justify-center py-12 '>
      <div className='sm:mx-auto  sm:w-full sm:max-w-md'>
        <h2 className='mt-6 text-center text-3xl font-extrabold '>Sign in to your account</h2>
      </div>

      <div className='mt-8 border border-white rounded-md sm:mx-auto sm:w-full sm:max-w-md'>
        <div className=' py-8 px-4 shadow sm:rounded-lg sm:px-10'>
          {error && (
            <div className='mb-4 bg-red-50 border-l-4 border-red-500 p-4'>
              <div className='flex'>
                <div className='flex-shrink-0'>
                  <svg
                    className='h-5 w-5 text-red-500'
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <div className='ml-3'>
                  <p className='text-sm text-red-700'>{error}</p>
                </div>
              </div>
            </div>
          )}
          {success && (
            <div className='mb-4 bg-green-50 border-l-4 border-green-500 p-4'>
              <div className='flex'>
                <div className='flex-shrink-0'>
                  <svg
                    className='h-5 w-5 text-green-500'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <div className='ml-3'>
                  <p className='text-sm text-green-700'>{success}</p>
                </div>
              </div>
            </div>
          )}

          <form
            className='space-y-6'
            onSubmit={(e) => {
              e.preventDefault();
              void form.handleSubmit();
            }}
          >
            <form.Field name='email'>
              {(field) => (
                <div>
                  <label htmlFor='email' className='block text-sm font-medium'>
                    Enter you email or username
                  </label>
                  <div className='mt-1'>
                    <input
                      id='email'
                      name='email'
                      type='email'
                      autoComplete='email'
                      required
                      className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className='mt-1 text-xs text-red-500'>
                        {field.state.meta.errors.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </form.Field>
            <form.Field name='password'>
              {(field) => (
                <div>
                  <label htmlFor='password' className='block text-sm font-medium '>
                    Password
                  </label>
                  <div className='mt-1'>
                    <div className='flex pr-2 items-center justify-between mt-1 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 shadow-sm'>
                      <input
                        id='password'
                        name='password'
                        type='password'
                        autoComplete='current-password'
                        required
                        className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />

                      <span onClick={() => setSee(!see)} className='cursor-pointer ml-2'>
                        {see ? <Eye /> : <EyeClosed />}
                      </span>
                    </div>
                    {field.state.meta.errors.length > 0 && (
                      <p className='mt-1 text-xs text-red-500'>
                        {field.state.meta.errors.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </form.Field>

            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <input
                  id='remember-me'
                  name='remember-me'
                  type='checkbox'
                  className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                />
                <label htmlFor='remember-me' className='ml-2 block text-sm '>
                  Remember me
                </label>
              </div>

              <div className='text-sm'>
                <a href='#' className='font-medium text-blue-600 hover:text-blue-500'>
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type='submit'
                disabled={mutation.isPending}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  mutation.isPending ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {mutation.isPending ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className='mt-6'>
            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-300'></div>
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-2 rounded-full bg-white text-gray-500'>
                  Or{' '}
                  <Link href='/register' className='font-medium text-blue-600 hover:text-blue-500'>
                    create a new account
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
