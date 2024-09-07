import { getUserWithDetails } from '@/app/actions/authActions';
import {
  deleteJobApplication,
  getCompanyApplications,
  updateApplicationStatus,
} from '@/app/actions/companyActions';
import { auth } from '@/auth';
import { IconButton } from '@/components/form/Buttons';
import FormContainer from '@/components/form/FormContainer';
import JobStatus from '@/components/form/JobStatus';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { FaDownload } from 'react-icons/fa6';

async function ManageApplications() {
  const session = await auth();
  const userId = session?.user?.id;
  const user = await getUserWithDetails(userId as string);
  if (!user) return null;
  const companyId = user?.company?.id;

  const applications = await getCompanyApplications(companyId as string);

  return (
    <div>
      <Table>
        <TableCaption>
          A list of recent applications submitted to your company
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Job Tile</TableHead>
            <TableHead>User email</TableHead>
            <TableHead>User resume</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => {
            const { id, resume, job } = application;
            return (
              <TableRow key={application.id}>
                <TableCell>
                  <Link
                    href={`/jobs/${job.id}`}
                    className="underline text-muted-foreground tracking-wide"
                  >
                    {job.title}
                  </Link>
                </TableCell>
                <TableCell>{application.user.email}</TableCell>
                <TableCell>
                  <a href={resume} download>
                    <FaDownload className="w-4 h-4 text-blue-700" />
                  </a>
                </TableCell>
                <TableCell className="flex items-center gap-x-2">
                  <JobStatus application={application} />
                  <DeleteApplicationAction applicationId={application.id} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

const DeleteApplicationAction = ({
  applicationId,
}: {
  applicationId: string;
}) => {
  const deleteAction = deleteJobApplication.bind(null, { applicationId });
  return (
    <FormContainer action={deleteAction}>
      <IconButton actionType="delete" className="text-red-500" />
    </FormContainer>
  );
};

export default ManageApplications;
