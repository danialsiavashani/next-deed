import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"
import { compare } from "bcryptjs"
import { getUserByEmail } from "@/app/actions/authActions"
import { loginSchema } from "./schema"


const customLogger = {
    error: (message: string, context?: any) => {
      console.error('ERROR:', message, context);
    },
    warn: (message: string, context?: any) => {
      console.warn('WARN:', message, context);
    },
    info: (message: string, context?: any) => {
      console.info('INFO:', message, context);
    },
    debug: (message: string, context?: any) => {
      console.debug('DEBUG:', message, context);
    }
  };

 
export default { providers: [Credentials({
    name: 'credentials',
    async authorize(creds){
        const validated = loginSchema.safeParse(creds);
        if (validated.success){
            const{email,password} = validated.data;
            const user = await getUserByEmail(email);
        
            if(!user || !(await compare(password, user.passwordHash))) return null;

            return user;
        }
        return null
    }
})],
} satisfies NextAuthConfig