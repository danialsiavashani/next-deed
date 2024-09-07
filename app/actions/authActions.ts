'use server'

import { signIn, signOut, auth } from '@/auth'
import prisma from "@/lib/db";
import { sendPasswordResetEmail } from '@/lib/mail';
import { generateToken, getTokenByToken } from '@/lib/tokens';
import { forgetPasswordSchema, loginSchema, passwordSchema, registerSchema, validateWithZodSchema } from '@/utils/schema';
import { TokenType } from '@prisma/client';
import bcrypt from "bcryptjs";
import { AuthError } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { ActionResult } from 'next/dist/server/app-render/types';
import { redirect } from 'next/navigation';
import { ZodError } from 'zod';



export async function getUserByEmail(email:string) {
    return prisma.user.findUnique({
        where:{
            email
        }
    })
}

export async function getAuthUserId (){
    const session = await auth()
    const userId = session?.user?.id

    if(!userId) throw new Error('Unauthorized')

    return userId
}


export async function getUserById(id:string) {
    return prisma.user.findUnique({
        where:{
            id
        }
    })
}

export const getUserRole = async (userId: string): Promise<string> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user.role;
};


export const findUser = async ()=>{
  const session = await auth()
  const userId = session?.user?.id
  const user = await prisma.user.findUnique({
    where:{
      id:userId
    }
  })
  return user
}

export const findCompany = async ()=>{
  const session = await auth()
  const userId = session?.user?.id
  const company = await prisma.company.findUnique({
    where:{
      userId:userId
    }
  });
  return company
}


const renderError = (error:unknown):{message:string}=>{
    return {message:error instanceof Error ? error.message : "An error occurred"}
}



export const registerUserAction = async(prevState: any, formData: FormData):Promise<{message:string}>=>{
        try {
            const rawData = Object.fromEntries(formData)
            const validatedFields = validateWithZodSchema(registerSchema,rawData)
            const {name,email,password} = validatedFields

            const hashedPassword = await bcrypt.hash(password,10)

            const existingUser = await prisma.user.findUnique({
                where:{email: validatedFields.email as string}
            })
    
            if(existingUser) {
                return {message:'User already exist'}
            }


      // Create user and company in a single transaction
           await prisma.user.create({
        data: {
          name,
          email,
          passwordHash: hashedPassword,
          role: 'user', 
        }
      });
   
  
    return { message: 'User registered successfully' };

        } catch (error) {
            return renderError(error)
        }
}



export async function getUserWithDetails(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,          // Include the role
        company: true,       // Include the related company if it exists
        jobs: true,          // Include jobs posted by the user
        applications: true, // Include applications made by the user
        accounts: true,     // Include accounts if needed
        createdAt: true,
      },
    });
    if (!user) {
      return{message:'User not found'}
    }

    const { id, name, email, role, company, jobs, applications, accounts, createdAt } = user;
    return { id, name, email, role, company, jobs, applications, accounts, createdAt };
  } catch (error) {
    renderError(error)
  }
}

export const signInUserAction = async(prevState: any, formData: FormData):Promise<{message:string}>=>{
  try {
    
    const rawData = Object.fromEntries(formData)
    const validatedFields = validateWithZodSchema(loginSchema,rawData)
    const {email,password}= validatedFields
    const existingUser = await getUserByEmail(email)

    if(!existingUser || !existingUser.email) return {message:'Invalid credentials'}

    const result = await signIn('credentials',{
      email,
      password,
      redirect: false
    });
    if(!result || result.error){
      return {message:'Invalid credentials'}
    }
  } catch (error) {
    if( error instanceof AuthError){
      switch(error.type){
        case 'CredentialsSignin':     
        return {message:'Invalid credentials'}
      default:
        return {message:'Something went wrong'}
      }
    } else {
      return {message:'Something else went wrong'}
    }
    
  }
  redirect('/')
}


export const generateResetPasswordEmail = async(prevState: any, formData: FormData):Promise<{message:string}>=>{
  try {
    const rawData = Object.fromEntries(formData)
    const validatedFields = validateWithZodSchema(forgetPasswordSchema,rawData)
    const {email}= validatedFields
    const existingUser = await getUserByEmail(email)
    console.log(email);
    
    if(!existingUser){
      return {message:'Email not found'}
    }

    const token = await generateToken(email,TokenType.PASSWORD_RESET);
    await sendPasswordResetEmail(token.email, token.token)


  } catch (error) {
    console.log(error);
    renderError(error)
  }
  return {message:'Password reset email has been sent, please check your email'}
}

export async function signOutUser (){
  await signOut({redirectTo:'/'})
}

export const resetPasswordAction = async(prevState: any, formData: FormData):Promise<{message:string}>=>{
  try {
   
    const token = formData.get('token') as string;
    if (!token) {
      return { message: 'Invalid token' };
    }

    const existingToken = await getTokenByToken(token);
    if (!existingToken) {
      return { message: 'Invalid token' };
    }

    const existingUser = await getUserByEmail(existingToken.email);
    if (!existingUser) {
      return { message: 'Invalid user' };
    }
    const rawData = Object.fromEntries(formData.entries());
    const validatedFields = validateWithZodSchema(passwordSchema, rawData);
 
    const { password, confirmPassword } = validatedFields;
    if (password !== confirmPassword) {
      return { message: 'Passwords do not match' };
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: existingUser.id },
      data: { passwordHash: hashedPassword },
    });

    await prisma.token.delete({
      where: { id: existingToken.id },
    });
    
  } catch (error) {
   return renderError(error)
  }
    redirect('/login') 
}

export const changeNameAction = async(prevState: any, formData: FormData):Promise<{message:string}>=>{
   try {
    const user = await findUser()
    if(!user) renderError({message:'Not a valid user'});
    const newName = formData.get('name') as string;
    if (user?.role === 'company') {
      // Update the company name in the Company model
      await prisma.company.update({
        where: { userId: user.id },
        data: { name: newName }  // Assuming `name` is the field for company name
      });
    } else {
      // Update the user's personal name
      await prisma.user.update({
        where: { id: user?.id },
        data: { name: newName }
      });
    }
    revalidatePath('/profile');
   } catch (error) {
    console.log(error);
    
    renderError(error)
   }
    return { message: 'Name updated successfully' };
}


export const changeUSerEmailAction = async (prevState: any, formData:FormData):Promise<{message:string}>=>{
  try {
    const user = await findUser();
    if(!user) renderError({message:'Not a valid User'})
      const email = formData.get('email') as string;
    await prisma.user.update({
      where: { id: user?.id },
      data: { email: email }
    });
    revalidatePath('/profile');
   } catch (error) {
    console.log(error);
    
    renderError(error)
   }
    return { message: 'Email updated successfully' };
}

export const changePassword = async(prevState: any,formData: FormData):Promise<{message:string}>=>{
  try {
    const user = await findUser()
    if(!user) renderError({message:'Not a valid user'})

      const rawData = Object.fromEntries(formData)
      const validatedFields= validateWithZodSchema(passwordSchema, rawData)

      const {password, confirmPassword}= validatedFields

      if( password !== confirmPassword) {
        return{message:'Password do not match'}
      }
      const hashedPassword = await bcrypt.hash(password,10);
      await prisma.user.update({
        where:{
          id: user?.id
        },
        data:{
          passwordHash: hashedPassword
        }
      })
      return { message: 'Password updated successfully' };
    } catch (error) {
      if (error instanceof ZodError) {
          console.log(error.flatten());
      }
      return renderError(error)
  }    
}

export const hasUserAppliedForJob = async(jobId:string): Promise<boolean>=>{
  try {
    const user = await findUser();
    if (!user) {
      // If user is null, return false because they cannot apply
      return false;
    }

    const application = await prisma.application.findFirst({
      where: {
        jobId,
        userId: user.id,
        status: {
          in: ['pending', 'interview'], // Look for applications with status 'pending' or 'interview'
        },
      },
    });

    return !!application;
  } catch (error) {
// Use type guard to narrow down error type
if (error instanceof Error) {
  // Handle specific known error cases gracefully
  if (error.message.includes('Unauthorized')) {
    return false; // Handle specific known error cases gracefully
  }
} else {
  // Log if error is not an instance of Error
  console.error('Unexpected error:', error);
}
return false; // Return a default value in case of an error
}
}


export const userRejectedForJob = async(jobId:string): Promise<boolean>=>{
  
  try {
    const user = await findUser();
    if (!user) {
      // If user is null, return false because they cannot apply
      return false;
    }

    const application = await prisma.application.findFirst({
      where: {
        jobId,
        userId: user.id,
        status: {
          in: ['rejected'], // Look for applications with status 'rejected'
        },
      },
    });

    return !!application;
  } catch (error) {
 
    // Use type guard to narrow down error type
    if (error instanceof Error) {
      // Handle specific known error cases gracefully
      if (error.message.includes('Unauthorized')) {
        return false; // Handle specific known error cases gracefully
      }
    } else {
      // Log if error is not an instance of Error
      console.error('Unexpected error:', error);
    }
    return false; // Return a default value in case of an error
  }
}