'use client';

import { WithSidebar } from '@/components/with-sidebar';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <WithSidebar sidebarContent={SidebarContent} mobileDashboardHeader={CustomHeader}>
      <div className="p-10">
        <p>dashboard</p>
      </div>
    </WithSidebar>
  );
}

const CustomHeader = () => {
  return (
    <div className="flex px-4">
      <span className="text-2xl font-extrabold">Memospark</span>
    </div>
  );
};

const SidebarContent = () => {
  return (
    <div>
      <CustomHeader />
      <div className="mt-6">
        {['Inicio', 'Preguntas'].map((item, index) => (
          <Link
            key={index}
            href="#"
            className="block rounded px-2 py-1 transition duration-75 hover:bg-gray-100"
          >
            {item}
          </Link>
        ))}
      </div>
    </div>
  );
};
