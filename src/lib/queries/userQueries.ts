import { User } from '@/app/generated/prisma/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { getUserById, updateUser, deleteUser } from '@/app/actions/auth';
import axios from 'axios';
import { ApiError, ApiErrorType } from '@/utils/NextApiError';
// Define the response type for registerUser (matches NextResponse JSON)
type UserResponse = Omit<User, 'password'>;

// Query keys for consistent cache management
const QUERY_KEYS = {
  userById: (id: string) => ['user', id],
  userProfile: (id: string) => ['userProfile', id],
};

// Register a new user
export function useRegisterUser() {
  const router = useRouter();
  return useMutation<
    Partial<UserResponse> | ApiErrorType,
    Error,
    Omit<
      User,
      | 'id'
      | 'coverPic'
      | 'profilePic'
      | 'createdAt'
      | 'updatedAt'
      | 'isBlocked'
      | 'isDeleted'
      | 'role'
    >
  >({
    mutationFn: async (d) => {
      const formData = new FormData();
      Object.entries(d).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });
      const response = await axios.post<Partial<UserResponse> | ApiErrorType>(
        '/api/auth/register/',
        formData
      );
      const user = response.data; // Extract JSON from NextResponse
      return user;
    },
    onSuccess: (user) => {
      console.log(user);
      router.push('/profile');
    },
    onError: (error) => {
      console.error('Registration failed:', error);
    },
    retry: 1,
  });
}

// login a user
export function useLoginUser() {
  const router = useRouter();
  return useMutation<
    Partial<UserResponse> | ApiErrorType,
    Error,
    Pick<Partial<User>, 'email' | 'username' | 'password'>,
    unknown
  >({
    mutationFn: async (d) => {
      if ((!d.email && !d.username) || !d.password) {
        throw new ApiError(400, 'Email or username and password are required.');
      }
      const formData = new FormData();
      Object.entries(d).forEach(([key, value]) => {
        if (value && value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });
      const response = await axios.post<Partial<UserResponse> | ApiErrorType>(
        '/api/auth/login/',
        formData
      );
      const user = response.data; // Extract JSON from NextResponse
      return user;
    },
    onSuccess: (user) => {
      console.log(user);
      router.push('/profile');
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
    retry: 1,
  });
}

// Fetch user by ID
export function useGetUserById(userId: string) {
  return useQuery<Omit<User, 'password'>, Error>({
    queryKey: QUERY_KEYS.userById(userId),
    queryFn: async () => {
      const user = await getUserById(userId);
      if (!user) throw new Error('User not found');
      return user;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

// Update user profile
export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation<Omit<User, 'password'>, Error, { id: string; data: Partial<User> }, unknown>({
    mutationFn: async ({ id, data }) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value instanceof File ? value : value.toString());
        }
      });
      return await updateUser(id, formData);
    },
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userById(updatedUser.id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userProfile(updatedUser.id) });
    },
    onError: (error) => {
      console.error('Update user failed:', error.message);
    },
    retry: 1,
  });
}

// Delete user (soft delete)
export function useDeleteUser() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation<void, Error, string, unknown>({
    mutationFn: async (userId: string) => {
      await deleteUser(userId);
    },
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userById(userId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userProfile(userId) });
      router.push('/login');
    },
    onError: (error) => {
      console.error('Delete user failed:', error.message);
    },
    retry: 0,
  });
}

// Fetch user profile (optimized for profile page)
export function useGetUserProfile(userId: string) {
  return useQuery<Omit<User, 'password'>, Error>({
    queryKey: QUERY_KEYS.userProfile(userId),
    queryFn: async () => {
      const user = await getUserById(userId);
      if (!user) throw new Error('User not found');
      return user;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 15,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}
