import {
  changeNameAction,
  changePassword,
  changeUSerEmailAction,
  findCompany,
  findUser,
} from '@/app/actions/authActions';
import { SubmitButton } from '@/components/form/Buttons';
import FormContainer from '@/components/form/FormContainer';
import FormInput from '@/components/form/FormInput';

async function ProfilePage() {
  const user = await findUser();
  const company = await findCompany();
  if (!user) return null;

  const nameDefaultValue =
    user.role === 'user'
      ? user.name
      : user.role === 'admin'
      ? user.name
      : company?.name;
  return (
    <section>
      <h1 className="text-3xl font-semibold ">Profile Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Name Section */}
        <div className="p-6 bg-white dark:bg-slate-950  rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Change Name
          </h2>
          <FormContainer action={changeNameAction}>
            <FormInput
              type="text"
              name="name"
              label="Name"
              defaultValue={nameDefaultValue}
            />
            <SubmitButton text="Update Name" />
          </FormContainer>
        </div>
        {/* Email Section */}
        <div className="p-6 bg-white dark:bg-slate-950  rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Change Email
          </h2>
          <FormContainer action={changeUSerEmailAction}>
            <FormInput
              type="email"
              name="email"
              label="Email"
              defaultValue={user.email}
            />
            <SubmitButton text="Update Email" />
          </FormContainer>
        </div>
        {/* Password Section */}
        <div className="p-6 bg-white dark:bg-slate-950 -lg shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Change Password
          </h2>
          <FormContainer action={changePassword}>
            <FormInput type="password" name="password" label="New Password" />
            <FormInput
              type="password"
              name="confirmPassword"
              label="Confirm Password"
            />
            <SubmitButton text="Update Password" />
          </FormContainer>
        </div>
      </div>
    </section>
  );
}

export default ProfilePage;
