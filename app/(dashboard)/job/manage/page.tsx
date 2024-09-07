import { getUserWithDetails } from '@/app/actions/authActions';
import {
  deleteJobAction,
  fetchCompanyJobs,
} from '@/app/actions/companyActions';
import { auth } from '@/auth';
import { IconButton } from '@/components/form/Buttons';
import FormContainer from '@/components/form/FormContainer';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { truncateText } from '@/lib/utils';
import Link from 'next/link';
import { redirect } from 'next/navigation';

async function ManageJobs() {
  const session = await auth();
  const userId = session?.user?.id;
  const user = await getUserWithDetails(userId as string);
  if (!user) return null;
  const companyId = user?.company?.id;
  const jobs = await fetchCompanyJobs(companyId as string);
  if (!jobs) return null;

  return (
    <div>
      <Table>
        <TableCaption>list of jobs submitted by your company</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead> Tile</TableHead>
            <TableHead> Tagline</TableHead>
            <TableHead> Employment type</TableHead>
            <TableHead> Location</TableHead>
            <TableHead> posted on</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => {
            const {
              id,
              title,
              tagline,
              employmentType,
              salary,
              location,
              createdAt,
            } = job;
            return (
              <TableRow key={job.id}>
                <TableCell>
                  <Link
                    href={`/jobs/${job.id}`}
                    className="underline text-muted-foreground tracking-wide"
                  >
                    {job.title}
                  </Link>
                </TableCell>
                <TableCell>{truncateText(job.tagline, 20)}</TableCell>
                <TableCell>{job.employmentType}</TableCell>
                <TableCell>{job.location}</TableCell>
                <TableCell>{job.createdAt.toLocaleDateString()}</TableCell>
                <TableCell className="flex items-center gap-x-2">
                  <Link href={`/job/manage/${job.id}/edit`}>
                    <IconButton actionType="edit" />
                  </Link>

                  <DeleteJobAction jobId={job.id} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

const DeleteJobAction = ({ jobId }: { jobId: string }) => {
  const deleteAction = deleteJobAction.bind(null, { jobId });
  return (
    <FormContainer action={deleteAction}>
      <IconButton actionType="delete" className="text-red-500" />
    </FormContainer>
  );
};

export default ManageJobs;
