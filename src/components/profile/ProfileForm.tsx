import { User } from '@/app/generated/prisma/browser';
import { useState, useRef } from 'react';

export default function ProfileForm({ user }: { user: Partial<User> }) {
  const [formData, setFormData] = useState({
    username: user.username || '',
    email: user.email || '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const profilePicRef = useRef<HTMLInputElement>(null);
  const coverPicRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      const formDataToSend = new FormData();

      // Append text fields
      formDataToSend.append('username', formData.username);
      formDataToSend.append('email', formData.email);

      // Append profile picture if selected
      if (profilePicRef.current?.files?.[0]) {
        formDataToSend.append('profilePic', profilePicRef.current.files[0]);
      }

      // Append cover photo if selected
      if (coverPicRef.current?.files?.[0]) {
        formDataToSend.append('coverPic', coverPicRef.current.files[0]);
      }

      const response = await fetch('/api/users', {
        method: 'PUT',
        body: formDataToSend,
        // Don't set Content-Type header - the browser will set it automatically with the correct boundary
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <label htmlFor='username' className='block text-sm font-medium'>
          Username
        </label>
        <input
          type='text'
          id='username'
          name='username'
          value={formData.username}
          onChange={handleChange}
          className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
        />
      </div>

      <div>
        <label htmlFor='email' className='block text-sm font-medium'>
          Email
        </label>
        <input
          type='email'
          id='email'
          name='email'
          value={formData.email}
          onChange={handleChange}
          className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
        />
      </div>

      <div>
        <label htmlFor='profilePic' className='block text-sm font-medium'>
          Profile Picture
        </label>
        <input
          type='file'
          id='profilePic'
          name='profilePic'
          ref={profilePicRef}
          accept='image/*'
          className='mt-1 block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100'
        />
      </div>

      <div>
        <label htmlFor='coverPic' className='block text-sm font-medium'>
          Cover Photo (optional)
        </label>
        <input
          type='file'
          id='coverPic'
          name='coverPic'
          ref={coverPicRef}
          accept='image/*'
          className='mt-1 block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100'
        />
      </div>

      {error && <div className='text-red-600 text-sm'>{error}</div>}
      {success && <div className='text-green-600 text-sm'>Profile updated successfully!</div>}

      <div>
        <button
          type='submit'
          className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700'
        >
          Update Profile
        </button>
      </div>
    </form>
  );
}
