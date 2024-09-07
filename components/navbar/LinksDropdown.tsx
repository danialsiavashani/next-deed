import Link from 'next/link';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { HiBars3 } from 'react-icons/hi2';
import { adminLinks, employerLinks, jobSeekerLinks } from '@/utils/links';
import SignOut from '../form/SignOut';
import { auth } from '@/auth';
import { getUserWithDetails } from '@/app/actions/authActions';

async function LinksDropdown({
  role,
}: {
  role: 'user' | 'company' | 'admin' | null;
}) {
  const links =
    role === 'user'
      ? jobSeekerLinks
      : role === 'admin'
      ? adminLinks
      : employerLinks;
  const session = await auth();
  const userId = session?.user?.id;
  const user = await getUserWithDetails(userId as string);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex gap-4 mx-w-[100px]">
          {role === 'company' ? user?.company?.name : user?.name}{' '}
          <HiBars3 className="w-6 h-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52 " align="start" sideOffset={10}>
        {!session && (
          <>
            <DropdownMenuItem>
              <Link href="/login">
                <button className="w-full text-left">Login</button>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/register">
                <button className="w-full text-left">Register</button>
              </Link>
            </DropdownMenuItem>
          </>
        )}

        {session && (
          <>
            {links.map((link) => (
              <DropdownMenuItem key={link.href}>
                <Link href={link.href} className="capitalize w-full">
                  {link.label}
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <div className=" ml-2">
              <SignOut />
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default LinksDropdown;
