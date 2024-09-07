import { getUserWithDetails } from '@/app/actions/authActions';
import {
  createJobAction,
  fetchJobDetails,
  updateJobActions,
} from '@/app/actions/companyActions';
import { auth } from '@/auth';
import BenefitsInput from '@/components/form/BenefitsInput';
import { SubmitButton } from '@/components/form/Buttons';
import EmploymentTypeInput from '@/components/form/EmploymentTypeInput';
import FormContainer from '@/components/form/FormContainer';
import FormInput from '@/components/form/FormInput';
import LevelInput from '@/components/form/LevelInput';
import RequirementsInput from '@/components/form/RequirementsInput';
import SalaryInput from '@/components/form/SalaryInput';
import TextAreaInput from '@/components/form/TextAreaInput';
import { redirect } from 'next/navigation';

async function EditJobDetails({ params }: { params: { id: string } }) {
  const job = await fetchJobDetails(params.id);

  if (!job) redirect('/');
  const session = await auth();
  const userId = session?.user?.id;
  const user = await getUserWithDetails(userId as string);
  let role: 'user' | 'company' | 'admin' | null = null;

  if (userId) {
    const user = await getUserWithDetails(userId);
    role = user?.role ?? null; // Ensures role is 'user' | 'company' | null, no undefined
  }
  if (role !== 'company') redirect('/');
  return (
    <section>
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Update job</h1>
      <div className="bordered p-8 rounded -mt-2">
        <FormContainer action={updateJobActions}>
          <input type="hidden" name="id" value={job.id} />
          <div className="grid md:grid-cols-2 gap-8 mb-4">
            <FormInput
              name="title"
              type="text"
              defaultValue={job.title}
              label="Title"
            />
            <FormInput
              name="tagline"
              type="text"
              defaultValue={job.tagline}
              label="Tagline"
            />
          </div>

          <TextAreaInput
            name="description"
            labelText="Description"
            defaultValue={job.description}
          />
          <div className="grid sm:grid-cols-2 gap-8 mt-4">
            <FormInput
              name="location"
              type="text"
              label="Location"
              defaultValue={job.location}
            />
            <EmploymentTypeInput defaultValue={job.employmentType} />
            <SalaryInput defaultValue={job.salary} />
            <LevelInput defaultValue={job.level} />
          </div>

          <div className="grid sm:grid-cols-2 gap-8  mb-8">
            <div>
              <h3 className="text-lg mb-4 mt-4 font-medium">Benefits</h3>
              <BenefitsInput benefitProps={job.benefits} />
            </div>

            <div>
              <h3 className="text-lg mb-4 mt-4 font-medium">
                Minimum Requirements
              </h3>
              <RequirementsInput requirementProps={job.minimumRequirements} />
            </div>
          </div>

          <SubmitButton text="Update" className=" px-[180px] " />
        </FormContainer>
      </div>
    </section>
  );
}

export default EditJobDetails;
