import { getUserWithDetails } from '@/app/actions/authActions';
import { auth } from '@/auth';
import LinksDropdown from './LinksDropdown';
import Logo from './Logo';
import DarkMode from './DarkMode';
import NavSearch from './NavSearch';
import SavesJobs from './SavesJobs';

async function Navbar() {
  const session = await auth();
  const userId = session?.user?.id;

  let role: 'user' | 'company' | 'admin' | null = null;

  if (userId) {
    const user = await getUserWithDetails(userId);
    role = user?.role ?? null; // Ensures role is 'user' | 'company' | null, no undefined
  }
  return (
    <nav className="sticky  top-0 left-0 right-0  z-50 ">
      <div className="container mx-auto flex flex-col sm:flex-row sm:justify-between items-center flex-wrap gap-4 py-4 sm:py-8">
        <Logo />
        <NavSearch />
        <div className="flex gap-4 items-center">
          <DarkMode />
          {userId && <SavesJobs />}
          <LinksDropdown role={role} />
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
