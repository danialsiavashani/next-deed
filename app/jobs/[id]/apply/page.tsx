import { getUserWithDetails } from '@/app/actions/authActions';
import { applyForJob, fetchJobDetails } from '@/app/actions/companyActions';
import { auth } from '@/auth';
import { SubmitButton } from '@/components/form/Buttons';
import FormContainer from '@/components/form/FormContainer';
import FormInput from '@/components/form/FormInput';
import { EmploymentType, getEmploymentTypeClass } from '@/utils/types';

async function JobApplyPage({ params }: { params: { id: string } }) {
  const job = await fetchJobDetails(params.id);
  const session = await auth();
  if (!session) return false;

  const user = session?.user;
  if (!user || !job) return null;
  return (
    <section className="p-6 max-w-4xl mx-auto bg-white dark:bg-slate-950 shadow-md rounded-lg">
      <div className="flex items-center mb-4">
        <h1 className="text-2xl font-bold mr-2">Apply for {job.title}</h1>
        <span className="text-lg text-gray-600">at {job.company?.name}</span>
      </div>
      <div className="border-b border-gray-300 pb-4 mb-6">
        <h2 className="text-xl font-semibold mb-2">Your Information</h2>
        <p className="mb-2">
          <strong className="font-medium">Name:</strong> {user?.name}
        </p>
        <p>
          <strong className="font-medium">Email:</strong> {user?.email}
        </p>
      </div>
      <FormContainer action={applyForJob}>
        <input type="hidden" name="jobId" value={job.id} />
        <div className="grid md:grid-cols-2 gap-8 mb-4 mt-4">
          <FormInput name="resume" type="file" placeholder="Upload Resume" />
        </div>
        <SubmitButton text="Submit application" className="mt-12" />
      </FormContainer>
    </section>
  );
}
export default JobApplyPage;
