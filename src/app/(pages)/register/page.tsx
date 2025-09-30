'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '@/hooks/ThemeChanger';
import { useForm } from '@tanstack/react-form';
import { useRegisterUser } from '@/lib/queries/userQueries';
import type { User } from '@/app/generated/prisma/client/client';
import { Eye, EyeClosed } from 'lucide-react';

export default function RegisterForm() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [see, setSee] = useState<boolean>(true);

  const mutation = useRegisterUser();

  const form = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
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

        if (value.confirmPassword !== value.password) {
          setError('Passwords do not match');
          return;
        }

        console.log('Mutation data:', mutationData);

        mutation.mutate(mutationData as User, {
          onSuccess: (user) => {
            console.log(user);
            setSuccess('Registration successful! Redirecting...');
            setTimeout(() => router.push('/profile'), 2000);
          },
          onError: (err) => {
            console.log('Mutation error:', err.message as any);
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
    <div className='min-h-screen flex flex-col justify-center py-12 px-10'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <h2 className='mt-6 text-center text-4xl font-extralight'>Create a new account</h2>
      </div>

      <div
        className={`mt-8 rounded sm:rounded-lg ${
          !isDarkMode ? 'shadow-lg shadow-blue-500' : ''
        } sm:mx-auto sm:w-full sm:max-w-md`}
      >
        <div className='border border-white rounded py-8 px-4 shadow sm:rounded-lg sm:px-10'>
          {error && (
            <div className='mb-4 bg-red-50 border-l-4 border-red-500 p-4'>
              <div className='flex'>
                <div className='flex-shrink-0'>
                  <svg
                    className='h-5 w-5 text-red-500'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                    xmlns='http://www.w3.org/2000/svg'
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
            className='rounded sm:rounded-lg space-y-6'
            onSubmit={(e) => {
              e.preventDefault();
              void form.handleSubmit();
            }}
          >
            <form.Field name='username'>
              {(field) => (
                <div>
                  <label htmlFor='username' className='block text-sm font-medium'>
                    Username
                  </label>
                  <div>
                    <input
                      id='username'
                      type='text'
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

            <form.Field name='email'>
              {(field) => (
                <div>
                  <label htmlFor='email' className='block text-sm font-medium'>
                    Email address
                  </label>
                  <div className='mt-1'>
                    <input
                      id='email'
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
                  <label htmlFor='password' className='block text-sm font-medium'>
                    Password
                  </label>
                  <div className='flex pr-2 items-center justify-between mt-1 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 shadow-sm'>
                    <input
                      id='password'
                      type={see ? 'text' : 'password'}
                      required
                      minLength={6}
                      className='px-3 py-2 appearance-none block placeholder-gray-400 sm:text-sm w-full'
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
              )}
            </form.Field>

            <form.Field name='confirmPassword'>
              {(field) => (
                <div>
                  <label htmlFor='confirmPassword' className='block text-sm font-medium'>
                    Confirm Password
                  </label>
                  <div className='flex px-2 items-center justify-between mt-1 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 shadow-sm'>
                    <input
                      id='confirmPassword'
                      type={see ? 'text' : 'password'}
                      required
                      minLength={6}
                      className='px-3 py-2 appearance-none block placeholder-gray-400 w-full'
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
              )}
            </form.Field>

            {/* <form.Field name="profilePic">
              {(field) => (
                <div>
                  <label
                    htmlFor="profilePic"
                    className="block text-sm font-medium"
                  >
                    Profile Picture 
                  </label>
                  <div className="mt-1">
                    <input
                      id="profilePic"
                      type="file"
                      accept="image/*"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(e.target.files?.[0] ?? undefined)
                      }
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      JPEG, PNG, or WEBP (Max 5MB)
                    </p>
                    {field.state.meta.errors.length > 0 && (
                      <p className="mt-1 text-xs text-red-500">
                        {field.state.meta.errors.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </form.Field> */}

            {/* <form.Field name="coverPic">
              {(field) => (
                <div>
                  <label
                    htmlFor="coverPic"
                    className="block text-sm font-medium"
                  >
                    Cover Photo (optional)
                  </label>
                  <div className="mt-1">
                    <input
                      id="coverPic"
                      type="file"
                      accept="image/*"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(e.target.files?.[0] ?? undefined)
                      }
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      JPEG, PNG, or WEBP (Max 5MB)
                    </p>
                    {field.state.meta.errors.length > 0 && (
                      <p className="mt-1 text-xs text-red-500">
                        {field.state.meta.errors.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </form.Field> */}

            <div>
              <button
                type='submit'
                disabled={mutation.isPending}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  mutation.isPending ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {mutation.isPending ? 'Registering...' : 'Register'}
              </button>
            </div>
          </form>

          <div className='mt-6'>
            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-300'></div>
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-2 rounded-full bg-white text-gray-600'>
                  Already have an account?{' '}
                  <Link href='/login' className='font-medium text-blue-600 hover:text-blue-500'>
                    Sign in
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
