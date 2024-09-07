import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import authConfig from "./utils/auth.config"
import prisma from "./lib/db";



 
export const { auth, handlers:{GET,POST}, signIn, signOut } = NextAuth({
  callbacks:{
    async jwt({user,token}){
      if(user) {
        token.role = user.role
        console.log(token.role);
        
        
      }
      return token
    },
    async session({token, session}){
      if(token.sub && session.user){
        session.user.id = token.sub;
        session.user.role = token.role as string
      }
      return session;
    }
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,

})