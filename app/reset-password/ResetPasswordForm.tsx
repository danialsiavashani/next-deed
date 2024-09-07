'use client';
import { SubmitButton } from '@/components/form/Buttons';
import FormContainer from '@/components/form/FormContainer';
import FormInput from '@/components/form/FormInput';
import Image from 'next/image';
import ResetImage from '@/assets/reset.svg';
import { resetPasswordAction } from '../actions/authActions';
import { useSearchParams } from 'next/navigation';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') as string;
  return (
    <div>
      <>
        <section className="max-w-6xl mx-auto px-4 sm:px-8 grid lg:grid-cols-[1fr,600px] items-center gap-8 mt-20">
          <div className="text-center lg:text-left -mt-20">
            <h1 className="capitalize text-3xl md:text-4xl font-extrabold mb-3 mr-3 ">
              Reset your password
              <span className="text-primary"> with Next-</span>
              Auth
            </h1>
            <p className="text-base md:text-lg text-gray-600 mb-4">
              one of the most advance auth technologies
            </p>
          </div>
          <div className=" shadow-lg bordered p-6 rounded-lg w-full max-w-lg mx-auto lg:mx-0 bg-white dark:bg-slate-950  ">
            <FormContainer action={resetPasswordAction}>
              <input type="hidden" name="token" value={token || ''} />
              <FormInput type="password" name="password" label="Password" />
              <FormInput
                type="password"
                name="confirmPassword"
                label="Confirm Password"
              />
              <SubmitButton text="Reset Password" className="mt-4 w-full" />
            </FormContainer>
          </div>
          <Image
            src={ResetImage}
            alt="reset"
            className="hidden lg:block -mt-20"
            width={300}
            height={200}
          />
        </section>
      </>
    </div>
  );
}
export default ResetPasswordForm;
