import { SubmitButton } from '@/components/form/Buttons';
import FormContainer from '@/components/form/FormContainer';
import FormInput from '@/components/form/FormInput';
import Image from 'next/image';
import LoginImage from '@/assets/login.svg';
import { signInUserAction } from '../actions/authActions';
import Link from 'next/link';

function LoginFormComponent() {
  return (
    <div>
      <>
        <section className="max-w-6xl mx-auto px-4 sm:px-8 grid lg:grid-cols-[1fr,600px] items-center gap-8 mt-20">
          <div className="text-center lg:text-left -mt-20">
            <h1 className="capitalize text-3xl md:text-4xl font-extrabold mb-3 mr-3 ">
              Dive in securely
              <span className="text-primary"> with Next-</span>
              Auth
            </h1>
            <p className="text-base md:text-lg text-gray-600 mb-4">
              one of the most advance auth technologies
            </p>
          </div>
          <div className=" shadow-2xl bordered p-6 rounded-lg w-full max-w-lg mx-auto lg:mx-0  bg-white dark:bg-slate-950  ">
            <FormContainer action={signInUserAction}>
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
              <div className="flex justify-end hover:underline text-sm">
                <Link href="/forgot-password">Forgot password?</Link>
              </div>
              <SubmitButton text="Login" className="mt-4 w-full" />
            </FormContainer>
          </div>
          <Image
            src={LoginImage}
            alt="register"
            className="hidden lg:block -mt-20"
            width={400}
            height={300}
          />
        </section>
      </>
    </div>
  );
}
export default LoginFormComponent;
