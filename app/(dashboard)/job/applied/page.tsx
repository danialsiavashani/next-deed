import { fetchUsersAppliedJobs } from '@/app/actions/companyActions';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  EmploymentType,
  getEmploymentTypeClass,
  getStatusTypeClass,
  StatusType,
} from '@/utils/types';
import clsx from 'clsx';
import Link from 'next/link';

async function AppliedJobs() {
  const applications = await fetchUsersAppliedJobs();

  // Ensure that applications is an array
  if (!applications) {
    return <p>No applications found or an error occurred.</p>;
  }

  return (
    <div>
      <Table>
        <TableCaption>A list of recent applications you submitted</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Job Tile</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Your resume</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => {
            const statusTypeClass = getStatusTypeClass(
              application.status as StatusType
            );
            return (
              <TableRow key={application.id}>
                <TableCell>
                  <Link
                    href={`/jobs/${application.job.id}`}
                    className="underline text-muted-foreground tracking-wide"
                  >
                    {application.job.title}
                  </Link>
                </TableCell>
                <TableCell>{application.job?.company?.name}</TableCell>
                <TableCell>
                  <a href={application.resume} download>
                    resume
                  </a>
                </TableCell>
                <TableCell>
                  <span
                    className={clsx(
                      'text-sm px-3 py-1 rounded-full',
                      statusTypeClass
                    )}
                  >
                    {application.status}
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
export default AppliedJobs;
