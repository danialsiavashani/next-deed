import { EmploymentType, JobCardProps } from '@/utils/types';
import clsx from 'clsx';
import Link from 'next/link';
import SaveToggleButton from '../card/SaveToggleButton';

export const getEmploymentTypeClass = (type: EmploymentType) => {
  switch (type) {
    case 'Full-Time':
      return 'bg-green-100 text-green-600';
    case 'Part-Time':
      return 'bg-yellow-100 text-yellow-600';
    case 'Contract':
      return 'bg-red-100 text-red-600';
    case 'Freelance':
      return 'bg-purple-100 text-purple-600';
    case 'Internship':
      return 'bg-blue-100 text-blue-600';
    case 'Remote':
      return 'bg-gray-100 text-gray-600';
    default:
      return 'bg-gray-100 text-gray-600'; // Default style
  }
};
export default async function JobCard({ job }: { job: JobCardProps }) {
  const employmentTypeClass = getEmploymentTypeClass(
    job.employmentType as EmploymentType
  );

  return (
    <article className="group relative shadow-2xl rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 bg-white dark:bg-slate-950">
      <Link href={`/jobs/${job.id}`}>
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold  group-hover:text-blue-600 transition-colors duration-300">
                {job.title}
              </h2>
              <p className="text-sm  mt-1">{job.company?.name}</p>
            </div>
            <span
              className={clsx(
                'text-sm px-3 py-1 rounded-full',
                employmentTypeClass
              )}
            >
              {job.employmentType}
            </span>
            <h1 className="ml-2 text-sm">{job.level}</h1>
          </div>

          <p className="text-gray-500 mt-4 text-sm">{job.location}</p>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-md font-medium text-gray-700">{job.tagline}</p>
          </div>
          <h2>{job.salary}</h2>
        </div>
      </Link>
      <div className="absolute bottom-5 right-5 z-5">
        <SaveToggleButton jobId={job.id} />
      </div>
    </article>
  );
}
