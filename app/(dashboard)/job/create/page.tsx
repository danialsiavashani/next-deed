import { getUserWithDetails } from '@/app/actions/authActions';
import { createJobAction } from '@/app/actions/companyActions';
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

async function CreateJob() {
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
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Create job</h1>
      <div className="bordered p-8 rounded -mt-2">
        <FormContainer action={createJobAction}>
          <div className="grid md:grid-cols-2 gap-8 mb-4">
            <FormInput
              name="title"
              type="text"
              defaultValue="Full-stack"
              label="Title"
            />
            <FormInput
              name="tagline"
              type="text"
              defaultValue="MongoDB, Node.js, Express, React developer needed ASAP"
              label="Tagline"
            />
          </div>

          <TextAreaInput
            name="description"
            labelText="Description"
            defaultValue="We need someone who is specialized in front-end and back-end development and is an expert in JavaScript and TypeScript is a plus"
          />
          <div className="grid sm:grid-cols-2 gap-8 mt-4">
            <FormInput
              name="location"
              type="text"
              label="Location"
              defaultValue="Sacramento"
            />
            <EmploymentTypeInput />
            <SalaryInput />
            <LevelInput />
          </div>

          <div className="grid sm:grid-cols-2 gap-8  mb-8">
            <div>
              <h3 className="text-lg mb-4 mt-4 font-medium">Benefits</h3>
              <BenefitsInput />
            </div>

            <div>
              <h3 className="text-lg mb-4 mt-4 font-medium">
                Minimum Requirements
              </h3>
              <RequirementsInput />
            </div>
          </div>

          <SubmitButton text="Create" className=" px-[180px] " />
        </FormContainer>
      </div>
    </section>
  );
}
export default CreateJob;
