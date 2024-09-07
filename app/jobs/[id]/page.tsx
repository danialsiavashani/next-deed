import { fetchJobDetails } from '@/app/actions/companyActions';
import { Button } from '@/components/ui/button';
import { capitalizeFirstLetter } from '@/lib/utils';
import { EmploymentType, getEmploymentTypeClass } from '@/utils/types';
import clsx from 'clsx';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  hasUserAppliedForJob,
  userRejectedForJob,
} from '@/app/actions/authActions';
import SaveToggleButton from '@/components/card/SaveToggleButton';
import { auth } from '@/auth';

async function JobsDetailsPage({ params }: { params: { id: string } }) {
  const job = await fetchJobDetails(params.id);
  const hasUserApplied = await hasUserAppliedForJob(params.id);
  const userCantApply = await userRejectedForJob(params.id);
  if (!job) redirect('/');

  const employmentTypeClass = getEmploymentTypeClass(
    job.employmentType as EmploymentType
  );

  return (
    <div className="relative max-w-5xl mx-auto p-8 shadow-lg rounded-lg bg-white dark:bg-slate-950 ">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center mb-8">
        <div className="flex-1">
          <div className="flex items-center">
            <h1 className="text-4xl font-bold">{job.title}</h1>
          </div>
          <h2 className="text-2xl font-semibold text-gray-600 mt-1">
            at {job.company?.name}
          </h2>
        </div>

        <div className="w-full sm:flex-row sm:items-center flex-col flex gap-2 justify-between mt-4 md:mt-0 md:w-1/3">
          <h1 className="text-sm font-semibold lg:-ml-20 ">{job.level}</h1>
          <span
            className={clsx(
              'text-sm px-3 py-1 rounded-md ',
              employmentTypeClass
            )}
          >
            {job.employmentType}
          </span>
          <span className="text-md text-gray-500">
            {job.createdAt.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Tagline */}
      <p className="text-xl font-medium ">{job.tagline}</p>

      {/* Description */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold ">Job Description</h3>
        <p className="text-lg ">{job.description}</p>
      </div>

      {/* Minimum Requirements */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold ">Minimum Requirements</h3>
        <ul className="list-disc pl-5 text-lg ">
          <li>
            {job.minimumRequirements.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </li>
        </ul>
      </div>

      {/* Benefits */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold ">Benefits</h3>
        <ul className="list-disc pl-5 text-lg ">
          {job.benefits.map((benefit, index) => (
            <li key={index}>{benefit}</li>
          ))}
        </ul>
      </div>

      {/* Additional Information */}
      <div className="flex flex-col md:flex-row md:justify-between ">
        <div className="mb-6 md:mb-0">
          <h4 className="text-lg font-semibold mb-2">Location:</h4>
          <p className="text-lg">{job.location}</p>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-2">Salary Range:</h4>
          <p className="text-lg">{job.salary}</p>
        </div>
      </div>

      {/* Apply Button */}
      <div className="mt-4">
        {hasUserApplied ? (
          <Button className="capitalize" disabled>
            Application in review...
          </Button>
        ) : userCantApply ? (
          <div className="mt-4">
            <h1 className="text-2xl">
              You cant apply for this job at this time
            </h1>
          </div>
        ) : (
          <Link href={`/jobs/${job.id}/apply`}>
            <Button className="capitalize">Apply Now</Button>
          </Link>
        )}
      </div>

      <div className="absolute bottom-5 right-4 z-5">
        <SaveToggleButton jobId={job.id} />
      </div>
    </div>
  );
}
export default JobsDetailsPage;
