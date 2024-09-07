import { findUser } from '@/app/actions/authActions';
import {
  acceptUserToBeCompany,
  fetchAllCompaniesApplications,
} from '@/app/actions/companyActions';
import { AcceptButton, SubmitButton } from '@/components/form/Buttons';
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
import { redirect } from 'next/navigation';
import { FaDownload } from 'react-icons/fa6';
async function AdminManageApplications() {
  const applications = await fetchAllCompaniesApplications();
  if (!applications) return null;

  return (
    <div>
      <Table>
        <TableCaption>
          A list of recent applications requested by potential companies
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>User's name</TableHead>
            <TableHead>Potential company name</TableHead>
            <TableHead>User's submitted form</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => {
            return (
              <TableRow key={application.id}>
                <TableCell>{application.User.name}</TableCell>
                <TableCell>{application.companyName}</TableCell>
                <TableCell>
                  <a href={application.applicationFile} download>
                    <FaDownload className="w-4 h-4 text-blue-700" />
                  </a>
                </TableCell>
                <TableCell>{application.status}</TableCell>
                <TableCell>
                  {application.status === 'accepted'}
                  <AcceptUserAction
                    userId={application.userId}
                    applicationStatusStatus={application.status}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

const AcceptUserAction = ({
  userId,
  applicationStatusStatus,
}: {
  userId: string;
  applicationStatusStatus: string;
}) => {
  const updateUserRole = acceptUserToBeCompany.bind(null, { userId });
  return (
    <FormContainer action={updateUserRole}>
      <AcceptButton
        text={applicationStatusStatus === 'accepted' ? 'Updated' : 'Update'}
        disabled={applicationStatusStatus === 'accepted'}
      />
    </FormContainer>
  );
};
export default AdminManageApplications;
