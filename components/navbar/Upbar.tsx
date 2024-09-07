import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { AlignLeft } from 'lucide-react';
import {
  adminSidebarLinks,
  employerSidebarLinks,
  jobSeekerSidebarLinks,
} from '@/utils/links';

import Link from 'next/link';
function Upbar({ role }: { role: 'user' | 'company' | 'admin' | null }) {
  const links =
    role === 'user'
      ? jobSeekerSidebarLinks
      : role === 'admin'
      ? adminSidebarLinks
      : employerSidebarLinks;
  return (
    <nav className="py-4 sm:px-16 lg:px-24 px-4 flex items-center">
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="lg:hidden">
            <Button
              variant="outline"
              size="icon"
              className="w-[200px] bg-blue-500"
            >
              <AlignLeft className=" w-20" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-52 lg:hidden  "
            align="start"
            sideOffset={25}
          >
            {links.map((link) => {
              return (
                <DropdownMenuItem key={link.href}>
                  <Link href={link.href} className="flex items-center gap-x-2 ">
                    <span className="capitalize">{link.label}</span>
                  </Link>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
export default Upbar;
