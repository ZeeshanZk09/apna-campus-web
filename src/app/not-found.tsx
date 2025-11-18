import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f5f9ff] to-[#e6f0ff] dark:bg-[#081015]'>
      <div className='text-center'>
        <h2 className='text-3xl font-bold mb-4'>Page Not Found</h2>
        <p className='mb-6'>Could not find the requested resource</p>
        <Link
          href='/'
          className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
