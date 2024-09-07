import EmploymentTypeList from '@/components/home/EmploymentTypeList';
import JobContainer from '@/components/home/JobContainer';
import LevelSearch from '@/components/home/LevelSearch';
import SalarySearch from '@/components/home/SalarySearch';
import { ClearFilter } from '@/utils/types';
import Link from 'next/link';
import { MdFilterAltOff } from 'react-icons/md';
export default async function Home({
  searchParams,
}: {
  searchParams: {
    employmentTypes?: string;
    search?: string;
    salary?: string;
    level?: string;
  };
}) {
  const all: ClearFilter = {
    label: 'all',
    icon: MdFilterAltOff,
  };
  return (
    <div>
      <div className="flex gap-12">
        <Link href="/">
          <article className="p-3 flex flex-col items-center cursor-pointer duration-300  hover:text-primary ">
            <all.icon className="w-10 h-10 text-primary mb-2" />
          </article>
        </Link>
        <EmploymentTypeList
          level={searchParams.level}
          employmentTypes={searchParams.employmentTypes}
          salary={searchParams.salary}
          search={searchParams.search}
        />

        <LevelSearch
          employmentTypes={searchParams.employmentTypes}
          level={searchParams.level}
          salary={searchParams.salary}
          search={searchParams.search}
        />

        <SalarySearch
          level={searchParams.level}
          salary={searchParams.salary}
          employmentTypes={searchParams.employmentTypes}
          search={searchParams.search}
        />
      </div>

      <JobContainer
        level={searchParams.level}
        employmentTypes={searchParams.employmentTypes}
        salary={searchParams.salary}
        search={searchParams.search}
      />
    </div>
  );
}
