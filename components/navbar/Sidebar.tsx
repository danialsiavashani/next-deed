'use client';

import {
  adminSidebarLinks,
  employerSidebarLinks,
  jobSeekerSidebarLinks,
} from '@/utils/links';
import Link from 'next/link';

import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';

export function Sidebar({
  role,
}: {
  role: 'user' | 'company' | 'admin' | null;
}) {
  const pathname = usePathname();

  const links =
    role === 'user'
      ? jobSeekerSidebarLinks
      : role === 'admin'
      ? adminSidebarLinks
      : employerSidebarLinks;
  return (
    <aside className="w-64 bg-muted h-full p-6 py-16 fixed top-0 left-0 border-r shadow-lg transition-transform transform duration-300">
      <div className="flex flex-col mt-20 gap-y-4">
        {links.map((link) => {
          return (
            <Button
              asChild
              key={link.href}
              variant={pathname === link.href ? 'ghost' : 'link'}
            >
              <Link href={link.href} className="flex items-center gap-x-2">
                {/* might add {link.icon}  */}
                <span className="capitalize">{link.label}</span>
              </Link>
            </Button>
          );
        })}
      </div>
    </aside>
  );
}
