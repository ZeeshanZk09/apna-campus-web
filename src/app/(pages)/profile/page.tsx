'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Loader from '@/components/ui/Loader';
import PasswordForm from '@/components/profile/PasswordForm';
import ProfileForm from '@/components/profile/ProfileForm';
import { User } from '@/app/lib/models/User';
import Image from 'next/image';
import { Dialog } from '@headlessui/react';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const coverPicRef = useRef<HTMLInputElement>(null);
  const profilePicRef = useRef<HTMLInputElement>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCoverMenuOpen, setIsCoverMenuOpen] = useState(false);
  const [isProfilePicOpen, setIsProfilePicOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/current-user');
        if (!response.ok) throw new Error('Failed to fetch user');
        const data = await response.json();
        setUser(data.user);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch user');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleCoverPicChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      try {
        const formData = new FormData();
        formData.append('coverPic', e.target.files[0]);

        const response = await fetch(`/api/users/`, {
          method: 'PUT',
          body: formData,
        });

        if (!response.ok) throw new Error('Failed to update cover photo');

        const data = await response.json();
        setUser(data.user);
        setSuccess(true);
        setError('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update cover');
      }
    }
  };

  const handleProfilePicChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      try {
        const formData = new FormData();
        formData.append('profilePic', e.target.files[0]);

        const response = await fetch(`/api/users/`, {
          method: 'PUT',
          body: formData,
        });

        if (!response.ok) throw new Error('Failed to update profile picture');

        const data = await response.json();
        setUser(data.user);
        setSuccess(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update profile');
      }
    }
  };

  const deleteCoverPic = async () => {
    try {
      const formData = new FormData();
      formData.append('coverPic', ''); // Empty value indicates deletion

      const response = await fetch(`/api/users/`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to delete cover photo');

      const data = await response.json();
      setUser(data.user);
      setIsCoverMenuOpen(false);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete cover');
    }
  };

  const deleteProfilePic = async () => {
    try {
      const formData = new FormData();
      formData.append('profilePic', ''); // Empty value indicates deletion

      const response = await fetch(`/api/users/`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to delete profile picture');

      const data = await response.json();
      setUser(data.user);
      setIsProfilePicOpen(false);
      setSuccess(true);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete profile');
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen flex justify-center items-center scale-200'>
        <Loader />
      </div>
    );
  }

  if (!user) {
    return <div>Not authenticated</div>;
  }

  return (
    <div className='min-h-screen bg-transparent'>
      <div className='shadow'>
        <div className='px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center py-6'>
            <h1 className='text-3xl font-bold'>Profile</h1>
            <div className='flex space-x-4'>
              {user.isAdmin && (
                <Link
                  href='/admin/dashboard'
                  className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700'
                >
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='rounded px-4 sm:px-6 lg:px-8 py-12'>
        {error && (
          <div className='mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
            {error}
          </div>
        )}
        {success && (
          <div className='mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded'>
            Profile updated successfully!
          </div>
        )}

        <div className='bg-[#03005c36] shadow rounded-lg'>
          {/* Cover Photo Section */}
          <div className='relative min-h-40 rounded-t-lg h-48 bg-white'>
            {user.coverPic ? (
              <>
                <Image
                  src={user.coverPic}
                  alt='Cover'
                  width={1500}
                  height={500}
                  className='w-full h-full object-cover cursor-pointer'
                  onClick={() => setIsCoverMenuOpen(true)}
                />
              </>
            ) : (
              <div
                className='h-full w-full bg-white flex flex-col items-center justify-center cursor-pointer'
                onClick={() => setIsCoverMenuOpen(true)}
              >
                <span className='text-gray-500 text-lg mb-2'>Add Cover Photo</span>
                <span className='text-gray-400 text-sm'>Recommended: 1500x500 pixels</span>
              </div>
            )}

            {/* Cover Photo Menu Dialog */}
            <Dialog
              open={isCoverMenuOpen}
              onClose={() => setIsCoverMenuOpen(false)}
              className='relative z-50'
            >
              <div className='fixed inset-0 bg-black/30' aria-hidden='true' />
              <div className='fixed inset-0 flex items-center justify-center p-4'>
                <Dialog.Panel className='w-full max-w-sm rounded bg-white p-6'>
                  <Dialog.Title className='text-lg font-medium mb-4'>
                    Cover Photo Options
                  </Dialog.Title>

                  <div className='space-y-3'>
                    <label className='block w-full'>
                      <span className='sr-only'>Upload Cover Photo</span>
                      <input
                        type='file'
                        accept='image/*'
                        onChange={handleCoverPicChange}
                        className='hidden'
                        ref={coverPicRef}
                      />
                      <button
                        onClick={() => coverPicRef.current?.click()}
                        className='w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700'
                      >
                        Upload New Cover
                      </button>
                    </label>

                    {user.coverPic && (
                      <>
                        <button
                          onClick={() => {
                            window.open(user.coverPic!, '_blank');
                            setIsCoverMenuOpen(false);
                          }}
                          className='w-full px-4 py-2 bg-gray-200 rounded hover:bg-gray-300'
                        >
                          View Current Cover
                        </button>

                        <button
                          onClick={deleteCoverPic}
                          className='w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700'
                        >
                          Delete Cover Photo
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => setIsCoverMenuOpen(false)}
                      className='w-full px-4 py-2 border border-gray-300 rounded hover:bg-gray-100'
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </div>
            </Dialog>
          </div>

          {/* Profile Content */}
          <div className='px-6 py-4'>
            <div className='flex items-center xsm:flex-col sm:flex-row'>
              <div className='mr-6 relative'>
                <div className='w-32 h-32 bg-[#0000009d] rounded-full border-4 border-white -mt-16 shadow-lg overflow-hidden'>
                  {user.profilePic ? (
                    <Image
                      src={user.profilePic}
                      alt='Profile'
                      width={400}
                      height={400}
                      className='w-full h-full object-cover cursor-pointer'
                      onClick={() => setIsProfilePicOpen(true)}
                    />
                  ) : (
                    <div
                      className='w-full h-full flex items-center justify-center text-white cursor-pointer'
                      onClick={() => profilePicRef.current?.click()}
                    >
                      <span className='absolute bottom-0 right-0 text-xs text-gray-500'>
                        Recommended: 400x400 pixels
                      </span>
                    </div>
                  )}
                </div>
                <input
                  type='file'
                  accept='image/*'
                  onChange={handleProfilePicChange}
                  className='hidden'
                  ref={profilePicRef}
                />
              </div>

              <div>
                <h2 className='text-lg sm:text-2xl font-bold'>{user.username}</h2>
                <p>{user.email}</p>
                {user.isAdmin && (
                  <span className='inline-block mt-2 px-3 py-1 text-xs font-semibold bg-indigo-600 text-white rounded-full'>
                    Admin
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Profile Picture Fullscreen Dialog */}
          {user.profilePic && (
            <Dialog
              open={isProfilePicOpen}
              onClose={() => setIsProfilePicOpen(false)}
              className='relative z-50'
            >
              <div className='fixed inset-0 bg-black/90' aria-hidden='true' />
              <div className='fixed inset-0 flex items-center justify-center p-4'>
                <Dialog.Panel className='relative w-full h-full'>
                  <Image
                    src={user.profilePic}
                    alt='Profile'
                    width={400}
                    height={400}
                    className='w-full h-full object-contain'
                  />

                  <div className='absolute bottom-4 right-4 flex space-x-2'>
                    <label className='cursor-pointer'>
                      <span className='sr-only'>Upload New Profile Picture</span>
                      <input
                        type='file'
                        accept='image/*'
                        onChange={handleProfilePicChange}
                        className='hidden'
                        ref={profilePicRef}
                      />
                      <button
                        onClick={() => profilePicRef.current?.click()}
                        className='px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700'
                      >
                        Upload New
                      </button>
                    </label>

                    <button
                      onClick={deleteProfilePic}
                      className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700'
                    >
                      Delete
                    </button>

                    <button
                      onClick={() => setIsProfilePicOpen(false)}
                      className='px-4 py-2 bg-gray-200 rounded hover:bg-gray-300'
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </div>
            </Dialog>
          )}

          {/* Profile Form Section */}
          <div className='px-6 py-4 border-t border-gray-200'>
            <h3 className='text-lg font-medium mb-4'>Update Profile</h3>
            <ProfileForm
              user={{
                _id: user._id,
                username: user.username,
                email: user.email,
                profilePic: user.profilePic,
                coverPic: user.coverPic,
                password: user.password,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                isAdmin: user.isAdmin,
              }}
            />
          </div>

          {/* Password Form Section */}
          <div className='px-6 py-4 border-t border-gray-200'>
            <h3 className='text-lg font-medium mb-4'>Change Password</h3>
            <PasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
}
