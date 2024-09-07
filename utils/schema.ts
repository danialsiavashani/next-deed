
import * as z from 'zod'
import { ZodSchema } from 'zod'



export function validateWithZodSchema<T>(schema:ZodSchema<T>,data:unknown):T{
    const result = schema.safeParse(data);
      if (!result.success) {
        const errors = result.error.errors.map((error) => error.message);
        throw new Error(errors.join(','));
      }
      return result.data;
}


export const loginSchema = z.object({
    email: z.string(),
    password: z.string()
  })
  
  export const forgetPasswordSchema = z.object({
    email: z.string(),
  })

  export const registerSchema = z.object({
    name: z.string().min(3, { message: "Name must be at least 3 characters long" }),
    email: z.string()
      .email({ message: "Must be a valid email address" })
      .regex(
        /@(yahoo|gmail|outlook|hotmail)\.com$/i, 
        { message: "Email must be a Yahoo, Gmail, Outlook, or Hotmail address" }
      ),
    password: z.string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
      .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[@$!%*?&]/, { message: "Password must contain at least one special character" }),

  });


  export const jobSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    tagline: z.string().min(1, 'Tagline is required'),
    description: z.string().min(1, 'Description is required'),
    location: z.string().min(1, 'Location is required'),
    employmentType: z.string().min(1, 'Employment Type is required'),
    salary: z.string().min(1, 'salary is required'),
    level: z.string().min(1, 'salary is required'),
    benefits: z.array(z.string()).optional(),
    minimumRequirements: z.array(z.string()).optional()
  });


  export const applyJob = z.object({
    jobId: z.string().nonempty('Job ID is required'),
    name: z.string().nonempty('Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z
      .string()
      .nonempty('Phone number is required')
      .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
  });



export const resumeSchema = z.object({
  resume:validateFile()
})

export const companyApplicationSchema = z.object({
  application:validateFile()
})

function validateFile(){
  const maxUploadSize = (1024 * 1024) * 2;
  const acceptedFileTypes = ['application/pdf']
  return z.instanceof(File).refine((file)=>{
    return !file || file.size <= maxUploadSize
  },'File size must be less than 2 MB').refine((file)=>{
    return !file || acceptedFileTypes.some((type)=> file.type.startsWith(type))
  },'File must be a pdf')
}


export const passwordSchema = z.object({
  
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[@$!%*?&]/, { message: "Password must contain at least one special character" }),

    confirmPassword: z.string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[@$!%*?&]/, { message: "Password must contain at least one special character" }),
 
});