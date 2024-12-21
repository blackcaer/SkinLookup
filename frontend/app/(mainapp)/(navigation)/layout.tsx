import type { Metadata } from "next";
import '@/app/ui/global.css';


import SideNav from "@/app/ui/sidenav";

export const metadata: Metadata = {
  title: {
    template: '%s | SkinLookup',
    default: 'SkinLookup',
  },
  description: 'Rust skins charts and statistics',
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {

  return  (
    <span lang='en' suppressHydrationWarning>
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-10">{children}</div>
    </div>
    </span>
  );
}
