import { getUserWithDetails } from '@/app/actions/authActions';
import { applyToBeCompany } from '@/app/actions/companyActions';
import { auth } from '@/auth';
import { SubmitButton } from '@/components/form/Buttons';
import FormContainer from '@/components/form/FormContainer';
import FormInput from '@/components/form/FormInput';
import { redirect } from 'next/navigation';
import { FaDownload } from 'react-icons/fa6';

async function CompanyApplicationPage() {
  const session = await auth();
  const userId = session?.user?.id;
  const user = await getUserWithDetails(userId as string);
  if (!user) return null;
  if (user.role != 'user') redirect('/');
  return (
    <section className="p-6 max-w-4xl mx-auto shadow-md rounded-lg bg-white dark:bg-slate-950">
      <div className="flex items-center mb-4">
        <h1 className="text-2xl font-bold mr-2">Apply to become a company</h1>
        <span className="text-lg text-gray-600">at next-deed</span>
      </div>
      <div className="border-b border-gray-300 pb-4 mb-6">
        <h2 className="text-xl font-semibold mb-2">Your Information</h2>
        <p className="mb-2">
          <strong className="font-medium">Name:</strong> {user.name}
        </p>
        <p>
          <strong className="font-medium">Email:</strong> {user.email}
        </p>
        <div className="download-section mt-6">
          <h2 className="text-lg font-semibold mb-2">
            Download the Application Form
          </h2>
          <p className="mb-4">
            Please download the company application form, fill it up, and submit
            your application.
          </p>
          <a
            href="/assets/Company%20Application%20Form.pdf"
            download="Company_Application_Form.pdf"
            className="download-link text-blue-700"
          >
            <FaDownload className="w-6 h-6 text-blue-700" />
          </a>
        </div>
      </div>
      <FormContainer action={applyToBeCompany}>
        <div className="grid md:grid-cols-2 gap-8 mb-4 mt-4">
          <FormInput name="companyName" type="text" label="Company Name" />
          <FormInput
            name="applicationFile"
            type="file"
            placeholder="Upload File"
          />
        </div>
        <SubmitButton text="Submit application" className="mt-12" />
      </FormContainer>
    </section>
  );
}
export default CompanyApplicationPage;
