import { DefaultSession } from "next-auth";

declare module 'next-auth' {
    interface User {
        role:string
    }

    interface session {
        user:{
            role:string;
        } & DefaultSession['user']
    }
}

declare module 'next-auth/jwt' {
    interface User {
        role:string
    }

    interface session {
        user:{
            role:string;
        } & DefaultSession['user']
    }
}