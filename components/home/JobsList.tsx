import { JobCardProps } from '@/utils/types';
import JobCard from './JobCard';

function JobsList({ jobs }: { jobs: JobCardProps[] }) {
  return (
    <section className="mt-4 gap-8 grid xl:gid-col-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 ">
      {jobs.map((job) => {
        return <JobCard key={job.id} job={job} />;
      })}
    </section>
  );
}
export default JobsList;
