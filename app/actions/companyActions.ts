'use server'

import { signIn, signOut, auth } from '@/auth'
import prisma from "@/lib/db";
import { applyJob, companyApplicationSchema, jobSchema, resumeSchema, validateWithZodSchema } from '@/utils/schema';
import bcrypt from "bcryptjs";
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';
import { getUserRole, getUserWithDetails } from './authActions';
import { ZodError } from 'zod';
import { deleteResume, uploadResume } from '@/utils/supabase';
import { ApplicationStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';



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

    if(!userId) throw new Error('Unauthorized') || null

    return userId
}


export async function getUserById(id:string) {
    return prisma.user.findUnique({
        where:{
            id
        }
    })
}

const renderError = (error:unknown):{message:string}=>{
    return {message:error instanceof Error ? error.message : "An error occurred"}
}


export const createJobAction = async(prevState: any, formData: FormData):Promise<{message:string}>=>{
    try {
      const rawData = Object.fromEntries(formData)

        if (rawData.benefits) {
        rawData.benefits = JSON.parse(rawData.benefits as string);
    }

        if (rawData.minimumRequirements) {
        rawData.minimumRequirements = JSON.parse(rawData.minimumRequirements as string);
    }
      const validatedFields = validateWithZodSchema(jobSchema,rawData)

   
      const {
        title,
        tagline,
        description,
        location,
        employmentType,
        salary , // Default to empty string if undefined
        level,
        benefits=[],  // Default to empty array if undefined
        minimumRequirements=[]  // Default to empty array if undefined
      } = validatedFields;
      
      const session = await auth(); // Get session information
      if (!session || !session.user || !session.user.id) {
        return { message: "User not authenticated" };
      }
  
      const user = await getUserWithDetails(session.user.id);
      if (!user) {
        return { message: "User details not found" };
      }
  
      if (user.role !== 'company') {
        return { message: "Unauthorized: Only companies can create jobs" };
      }

      const companyId = user.company?.id;

      if (!companyId) {
        return { message: "Company details not found" };
      }
       // Create the job
    await prisma.job.create({
        data:{
            title,
            tagline,
            description,
            location,
            employmentType,
            salary,
            level,
            benefits,
            minimumRequirements,
            company: { connect: { id: companyId } },  // Connect job to the user's company
            postedBy: { connect: { id: user.id } }  // Connect job to the user who posted it
          },
          include: {
            company: { select: { name: true } } // Include company name in the response
          }
    });
      
        } catch (error) {
            if (error instanceof ZodError) {
                console.log(error.flatten());
            }
            return renderError(error)
        }
       redirect('/') 
  }
  

export const fetchAllJobs = async({ search = '', employmentTypes,salary,level }: { search?: string; employmentTypes?: string; salary?:string,level?:string })=>{
  const filter: any = {
    OR: [
      { title: { contains: search, mode: 'insensitive' } },
      { tagline: { contains: search, mode: 'insensitive' } },
      { location: { contains: search, mode: 'insensitive' } },
      { company: { name: { contains: search, mode: 'insensitive' } } },
    ],
  };

   // Initialize AND filter array if any filter needs to be added
   if (employmentTypes || salary || level) {
    filter.AND = [];
  }

  // Add employmentType filter if present
  if (employmentTypes) {
    filter.AND.push({ employmentType: employmentTypes });
  }

  // Add salary filter if present
  if (salary) {
    filter.AND.push({ salary: { equals: salary } });
  }

  if (level) {
    filter.AND.push({ level: { equals: level } });
  }

  // Fetch jobs with the constructed filter
  const jobs = await prisma.job.findMany({
    where: filter,
    select: {
      id: true,
      title: true,
      tagline: true,
      employmentType: true,
      location: true,
      salary: true,
      level:true,
      company: { select: { name: true } },
    },
  });

  return jobs;
}

export const fetchJobDetails = async(id:string)=>{
  try {
    // Fetch the job details regardless of authentication status
    const job = await prisma.job.findUnique({
      where: {
        id,
      },
      include: {
        company: { select: { name: true } }, // Include company name
      },
    });

    // Handle case where job might not be found
    if (!job) {
      return null; // or return appropriate response
    }

    return job;
  } catch (error) {
    console.error('Error fetching job details:', error);
    return null; // or handle the error as needed
  }
};


export const applyForJob = async (prevState: any, formData: FormData): Promise<{ message: string }> => {
  
  try {
    
    const userId = await getAuthUserId();
    if (!userId) return  { message: 'Unauthorized' } 

    const jobId = formData.get('jobId')?.toString();
    if (!jobId) return { message: 'Job ID is required' };

    const file = formData.get('resume') as File;

    // Validate file
    const validatedFile = validateWithZodSchema(resumeSchema, { resume: file });
    const fullPath = await uploadResume(validatedFile.resume);

    await prisma.application.create({
      data: {
        jobId: jobId, // Ensure jobId is correctly typed
        resume: fullPath,
        userId: userId,
        status: 'pending',
        // Make sure only the fields defined in Prisma schema are included
      },
    });
    revalidatePath('job/applications/manage')
    return { message: 'Application submitted successfully' };
  } catch (error) {
    console.error(error);
    if (error instanceof ZodError) {
      return { message: 'Validation failed: ' + error.errors.map(e => e.message).join(', ') };
    }
    return { message: 'An unexpected error occurred' };
  }
};

export const fetchCompanyById = async()=>{

}

export const getCompanyApplications = async(companyId:string)=>{
  const jobs = await prisma.job.findMany({
    where:{
      companyId: companyId
    },
    select:{
      id:true
    }
  });

  const jobIds = jobs.map(job => job.id)

  // Fetch all applications related to these jobs
  const applications = await prisma.application.findMany({
    where:{
      jobId:{
        in: jobIds
      }
    },
    include:{
      job:true,
      user:true
    },
    // Optional: Add sorting to maintain consistent order
    orderBy: [
      { createdAt: 'asc' }  // Adjust sorting criteria as needed
    ]
  });
  return applications
}


export const updateApplicationStatus = async (applicationId: string, newStatus: string): Promise<void> => {
  try {
    const userId = await getAuthUserId()
    const userRole = await getUserRole(userId)// Implement this function to fetch user role
    if (userRole !== 'company') {
      throw new Error('Unauthorized: Only companies can update application status');
    }
    // Validate and cast newStatus to ApplicationStatus
    const validStatuses = ['pending','interview', 'rejected'] as const;
    if (!validStatuses.includes(newStatus as ApplicationStatus)) {
      throw new Error('Invalid status');
    }

    // Update the application status in the database
    await prisma.application.update({
      where: { id: applicationId },
      data: { status: newStatus as ApplicationStatus },
    });
    revalidatePath('/job/applications/manage')
    console.log('Application status updated successfully');
  } catch (error) {
    console.error('Error updating application status:', error);

    // Optionally, rethrow the error or handle it as needed
    throw error;
  }
};


export const deleteJobApplication = async(prevState:{applicationId:string})=>{
  const {applicationId} = prevState
  
  try {
    console.log('Starting deletion process for application:', applicationId);

    // Retrieve the application first to access the resume path
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      select: { resume: true } // Ensure 'resume' matches the correct field in your schema
    });

    if (!application) {
      console.error('Application not found:', applicationId);
      throw new Error('Application not found');
    }

    console.log('Application found, resume:', application.resume);

    if (application.resume) {
      // Delete the resume file from Supabase storage first
      const deleteResumeResult = await deleteResume(application.resume);
      
      if (deleteResumeResult.error) {
        console.error('Error deleting resume:', deleteResumeResult.error);
        throw new Error(deleteResumeResult.error);
      }
    }

    // Now delete the application from the database
    await prisma.application.delete({
      where: { id: applicationId }
    });

    console.log('Application deleted successfully');

    // Optionally revalidate the path or perform other actions after deletion
    revalidatePath('job/applications/manage');

    console.log('Revalidated path successfully');

    
  } catch (error) {
    console.error('Error during application and/or resume deletion:', error);
    return { error: 'An error occurred while deleting the application or resume.' };
  }
  return { message: 'Application and resume deleted successfully' };
}

export const fetchCompanyJobs = async(companyId:string)=>{
  try {
    const jobs = await prisma.job.findMany({
      where:{
        companyId: companyId
      },
      orderBy:[
        {createdAt:'asc'}
      ],
      select:{
        id:true,
        title: true,
        description: true,
        tagline: true,
        employmentType: true,
        salary: true,
        benefits: true,
        minimumRequirements: true,
        location: true,
        createdAt: true, 
      }
    });
    return jobs
  } catch (error) {
    renderError(error)
  }
}

export const fetchUsersAppliedJobs = async()=>{
  try {
     const userId = await getAuthUserId();   
 
  const applications= await prisma.application.findMany({
    where:{
      userId:userId
    },
    select: {
      id: true,
      status: true,
      resume: true,
      createdAt: true,
      job:{
        select:{
          id: true,
          title: true,
          company:{
            select:{
              name:true
            }
          }
        }
      }
 },
  });   
   return applications
  } catch (error) {
    renderError(error)
  }
}


export const applyToBeCompany = async(prevState:any, formData:FormData):Promise<{message:string}>=>{
  try {
    const userId = await getAuthUserId();
    if (!userId) return { message: 'Unauthorized' };

    const companyName= formData.get('companyName') as string
    const file = formData.get('applicationFile') as File;

    // Validate file
    const validatedFile = validateWithZodSchema(companyApplicationSchema, { application: file });
    const fullPath = await uploadResume(validatedFile.application);
    await prisma.companyApplication.create({
      data: {
        applicationFile: fullPath,
        companyName:companyName,
        userId: userId,
        status: 'pending',
        // Make sure only the fields defined in Prisma schema are included
      },
    });

    return { message: 'Application submitted successfully' };
  } catch (error) {
    console.error(error);
    if (error instanceof ZodError) {
      return { message: 'Validation failed: ' + error.errors.map(e => e.message).join(', ') };
    }
    return { message: 'An unexpected error occurred' };
  }
}

export const fetchAllCompaniesApplications = async()=>{
  const applications = await prisma.companyApplication.findMany({
    include:{
      User: true
    }
  })
  return applications
}

export const acceptUserToBeCompany = async(prevState:{userId:string}):Promise<{message:string}>=>{
  try {
    const {userId} = prevState
  
    const application = await prisma.companyApplication.findUnique({
      where: { 
        userId
       },
    });
    if(!application) renderError({message:'Not a valid application'})
      if( !application?.companyName) renderError({message:'Not a valid application'})
     await prisma.user.update({
      where:{id:userId},
      data:{role: 'company'}
    }),
    await prisma.company.create({
      data:{
       name: application?.companyName as string,
       user:{connect:{id:userId}}
      }  
    })
      // Update the application status
      await prisma.companyApplication.update({
        where: { userId },
        data: { status: 'accepted' },
      });
    revalidatePath('/admin/manage/application')

  } catch (error) {
    console.log(error);
    
    renderError(error)
  }
  return{message:'Company and role updated successfully successfully'}
}



export const updateJobActions = async(prevState:any, formData:FormData):Promise<{message:string}>=>{
  try {
    const userId = await getAuthUserId()
    const jobId = formData.get('id') as string
    if(!userId) renderError({message:'Not a valid user'})
      const rawData = Object.fromEntries(formData)

    if (rawData.benefits) {
      rawData.benefits = JSON.parse(rawData.benefits as string);
  }

      if (rawData.minimumRequirements) {
      rawData.minimumRequirements = JSON.parse(rawData.minimumRequirements as string);
  }
    const validatedFields = validateWithZodSchema(jobSchema,rawData)

 
    const {
      title,
      tagline,
      description,
      location,
      employmentType,
      salary , // Default to empty string if undefined
      level,
      benefits=[],  // Default to empty array if undefined
      minimumRequirements=[]  // Default to empty array if undefined
    } = validatedFields;
    
    const user = await getUserWithDetails(userId);
      if (!user) {
        return { message: "User details not found" };
      }
  
      if (user.role !== 'company') {
        return { message: "Unauthorized: Only companies can create jobs" };
      }

      const companyId = user.company?.id;

      if (!companyId) {
        return { message: "Company details not found" };
      }

      await prisma.job.update({
        where: { id: jobId },
        data:{
          title,
          tagline,
          description,
          location,
          employmentType,
          salary,
          level,
          benefits,
          minimumRequirements,
          company: { connect: { id: companyId } },  // Connect job to the user's company
          postedBy: { connect: { id: user.id } }  // Connect job to the user who posted it
        },
        include: {
          company: { select: { name: true } } // Include company name in the response
        }
  });
    
      } catch (error) {
          if (error instanceof ZodError) {
              console.log(error.flatten());
          }
          return renderError(error)
      }
     redirect('/job/manage') 
}


export const deleteJobAction = async(prevState:{jobId:string})=>{
    const {jobId} = prevState
    const userId =await getAuthUserId()

    try {
      await prisma.job.delete({
        where:{
          id:jobId,
          postedById:userId
        }
      })
      revalidatePath('/job/manage')
      return{message:'Job deleted successfully'}
    } catch (error:any) {
      console.log(error);
      if(error.code === 'P2003'){
        return {message:'There are applications on pending still related to this job, this job can not be deleted at the moment'}
      } else{
       return renderError(error) 
      }
     
    }
}


export const toggleSaveAction = async(prevSate:{
  jobId:string;
  saveId: string | null;
  pathname: string;
})=>{
  
  const { jobId, saveId , pathname } = prevSate;
  try {
      const userId = await getAuthUserId()
  if (!userId) {
    // Return a message that can be handled in the UI
    return { message: 'Please log in to save jobs' };
  }
    if(saveId){
      await prisma.save.delete({
        where:{
          id:saveId
        },
      });
    } else {
      await prisma.save.create({
        data:{
          jobId,
          userId
        }
      })
    }
     revalidatePath(pathname);
     return {message: saveId ? 'Removed from saved jobs' : 'Added to saved jobs'}
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Unauthorized') {
        return { message: 'Please login to use this action' };
      }
      return { message: error.message }; // handle other errors
    }
  
    return { message: 'An unknown error occurred' }; // fallback for non-Error type
  }
}

export const fetchSaveId = async({jobId}:{jobId:string})=>{
  try {
    
    const session = await auth()

    if(!session) return null

    const userId = session?.user?.id

    // If the user is not logged in, return null immediately
    if (!userId) {
      return null;
    }

    const save = await prisma.save.findFirst({
      where: {
        jobId,
        userId,
      },
      select: {
        id: true,
      },
    });

    return save?.id || null;
  } catch (error) {
    console.error('Error fetching save ID:', error);
    return null;
  }
}


export const fetchUserSaves = async () => {
  try {
    const session = await auth()

    if(!session) return null

    const userId = session?.user?.id

    // If the user is not logged in, return null immediately
    if (!userId) {
      return null;
    }

    const saves = await prisma.save.findMany({
      where: {
        userId,
      },
      select: {
        job: {
          select: {
            id: true,
            title: true,
            tagline: true,
            location: true,
            employmentType: true,
            salary: true,
            level: true,
            company: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return saves.map((save)=> save.job)
  } catch (error) {
    console.error('Error fetching user saves:', error);
    // Handle error or return a default value
    return [];
  }
};