'use client';
import { SubmitButton } from '@/components/form/Buttons';
import FormContainer from '@/components/form/FormContainer';
import FormInput from '@/components/form/FormInput';
import { registerUserAction } from '../actions/authActions';
import Image from 'next/image';
import JobCompany from '@/assets/register 2.svg';
function RegisterFormComponent() {
  return (
    <div>
      <section className="max-w-6xl mx-auto px-4 sm:px-8 grid lg:grid-cols-[1fr,600px] items-center gap-8 mt-20">
        <div className="text-center lg:text-left -mt-20">
          <h1 className="capitalize text-3xl md:text-4xl font-extrabold mb-3 mr-3 ">
            Let's give that <span className="text-primary">resume</span> a kick
          </h1>
          <p className="text-base md:text-lg text-gray-600 mb-4">
            Stay on top of your daily job-searching jobs and streamline your job
            search with our easy-to-use job app.
          </p>
        </div>
        {/* Form Section */}
        <div className=" shadow-lg bordered p-6 rounded-lg w-full max-w-lg mx-auto lg:mx-0 bg-white dark:bg-slate-950  ">
          <FormContainer action={registerUserAction}>
            <FormInput
              type="text"
              name="name"
              label="Name"
              defaultValue="danial"
            />
            <FormInput
              type="email"
              name="email"
              label="Email"
              defaultValue="danialsiavashani@yahoo.com"
            />
            <FormInput
              type="password"
              name="password"
              label="Password"
              defaultValue="123456"
            />
            <SubmitButton text="Register" className="mt-4 w-full" />
          </FormContainer>
        </div>
        {/* Image Section */}
        <div className="hidden lg:block  ">
          <Image
            src={JobCompany}
            alt="register"
            className="-mt-20"
            width={300}
            height={300}
          />
        </div>
      </section>
    </div>
  );
}
export default RegisterFormComponent;
