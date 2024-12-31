'use client'
import Link from 'next/link';
import NavLinks from '@/app/ui/nav/nav-links';
import SomeLogo from '@/app/ui/nav/some-logo';
import { PowerIcon,ArrowRightEndOnRectangleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { getToken, logOut } from '@/services/authServise';
import { useState,useEffect } from 'react';

export default function SideNav() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);  
  
  useEffect(() => {
    setIsLoggedIn(!!getToken());
  }, []);
  
  const handleLoginLogout = async () => {
    if (isLoggedIn) {
      await logOut();
      setIsLoggedIn(false);
      window.location.reload();
      return;
    }else{
      
      router.push("/login");
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
          onClick={handleLoginLogout}
          className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-xl bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
        >
          
          {isLoggedIn ? <PowerIcon className="w-6" /> : <ArrowRightEndOnRectangleIcon className="w-6" />}
          <div className="hidden md:block">{isLoggedIn ? "Sign Out" : "Sign In"}</div>
        </button>
      </div>
    </div>
  );
}
