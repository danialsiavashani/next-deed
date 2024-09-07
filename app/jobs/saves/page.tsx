import { fetchUserSaves } from '@/app/actions/companyActions';
import EmptyList from '@/components/home/EmptyList';
import JobsList from '@/components/home/JobsList';
import { ClearFilter } from '@/utils/types';
import Link from 'next/link';
import { IoReturnUpBack } from 'react-icons/io5';

async function SavesPage() {
  const saves = await fetchUserSaves();
  if (saves.length === 0) {
    return <EmptyList />;
  }
  const all: ClearFilter = {
    label: 'all',
    icon: IoReturnUpBack,
  };
  return (
    <>
      <div className="flex gap-12">
        <Link href="/">
          <article className="p-3 flex flex-col items-center cursor-pointer duration-300  hover:text-primary ">
            <all.icon className="w-10 h-10 text-primary mb-2" />
          </article>
        </Link>
      </div>

      <JobsList jobs={saves} />
    </>
  );
}
export default SavesPage;
