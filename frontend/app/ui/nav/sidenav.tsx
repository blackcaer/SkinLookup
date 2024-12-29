'use client'
import Link from 'next/link';
import NavLinks from '@/app/ui/nav/nav-links';
import SomeLogo from '@/app/ui/nav/some-logo';
import { PowerIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { clearTokens } from '@/services/authServise';

export default function SideNav() {
  const router = useRouter();

  const handleLogout = async () => {
    console.log('logging out...');
    const refreshToken = localStorage.getItem('refresh_token');
    const accessToken = localStorage.getItem('access_token');
  
    if (refreshToken) {
      const response = await fetch('http://127.0.0.1:8000/api/logout/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`, // Dodano nagłówek autoryzacji
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });
  
      if (response.ok) {
        clearTokens();
        router.push('/login');
      } else {
        console.error('Logout failed with status:', response.status);
      }
    } else {
      console.log('No refresh token found. User might not be logged in.');
    }
  };

  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-xl bg-red-600 p-4 md:h-40"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          <SomeLogo />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-xl bg-gray-50 md:block"></div>
        <button
          onClick={handleLogout}
          className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-xl bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
        >
          <PowerIcon className="w-6" />
          <div className="hidden md:block">Sign Out</div>
        </button>
      </div>
    </div>
  );
}
