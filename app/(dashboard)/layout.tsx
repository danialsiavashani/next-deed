import { auth } from '@/auth';
import { Sidebar } from '@/components/navbar/Sidebar';
import { PropsWithChildren } from 'react';
import { getUserWithDetails } from '../actions/authActions';
import Upbar from '@/components/navbar/Upbar';

async function layout({ children }: PropsWithChildren) {
  const session = await auth();
  const userId = session?.user?.id;

  let role: 'user' | 'company' | 'admin' | null = null;

  if (userId) {
    const user = await getUserWithDetails(userId);
    role = user?.role ?? null; // Ensures role is 'user' | 'company' | null, no undefined
  }
  return (
    <main className="grid lg:grid-cols-5">
      {/* first-col hide on small screen */}
      <div className="hidden lg:block lg:col-span-1 lg:min-h-screen">
        <Sidebar role={role} />
      </div>

      {/* second-col hide dropdown on big screen */}
      <div className="lg:col-span-4">
        <Upbar role={role} />
        <div className="py-0 px-4 sm:px-8">{children}</div>
      </div>
    </main>
  );
}
export default layout;
