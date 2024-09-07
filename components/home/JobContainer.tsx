import { JobCardProps } from '@/utils/types';
import JobsList from './JobsList';
import { fetchAllJobs } from '@/app/actions/companyActions';
import EmptyList from './EmptyList';

async function JobContainer({
  level,
  employmentTypes,
  salary,
  search,
}: {
  level?: string;
  employmentTypes?: string;
  salary?: string;
  search?: string;
}) {
  const jobs: JobCardProps[] = await fetchAllJobs({
    level,
    search,
    salary,
    employmentTypes,
  });

  if (jobs.length === 0) {
    return (
      <EmptyList
        heading="No Jobs"
        message="Try Changing or removing some of your filters"
      />
    );
  }

  return <JobsList jobs={jobs} />;
}
export default JobContainer;
