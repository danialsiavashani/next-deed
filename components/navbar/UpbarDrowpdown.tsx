import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import { Button } from '../ui/button';
import { AlignLeft } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { employerSidebarLinks, jobSeekerSidebarLinks } from '@/utils/links';
import { DropdownMenuItem } from '../ui/dropdown-menu';
import Link from 'next/link';

function UpbarDrowpdown({ role }: { role: 'user' | 'company' | null }) {
  const pathname = usePathname();
  const links = role === 'user' ? jobSeekerSidebarLinks : employerSidebarLinks;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="lg:hidden">
        <Button variant="outline" size="icon">
          <AlignLeft />
          <span className="sr-only">Toggle Links</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-52 lg:hidden"
        align="start"
        sideOffset={25}
      >
        {links.map((link) => {
          return (
            <DropdownMenuItem key={link.href}>
              <Link href={link.href} className="flex items-center gap-x-2">
                <span className="capitalize">{link.label}</span>
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default UpbarDrowpdown;
