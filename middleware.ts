// export { auth as middleware } from "@/auth"

import { NextResponse } from "next/server";
import { auth } from "./auth";
import { adminRoutes, authRoutes, companyRoutes, publicRoutes } from "@/app/routes";



const isDynamicRoute = (routePattern: string, pathname: string) => {
    const regex = new RegExp(`^${routePattern.replace(/:\w+/g, '\\w+')}$`);
    return regex.test(pathname);
  };



  

export default auth(async (req)=>{
    const {nextUrl} = req;
    const isLoggedIn = !!req.auth;
    const session = await auth()

    const pathname = nextUrl.pathname;

 // Check if the route is public
 const isPublic = publicRoutes.some(route => 
    route === pathname || isDynamicRoute(route, pathname)
  );



  // Check if the route is for authenticated users only
  const isAuthRoute = authRoutes.some(route => 
    route === pathname || isDynamicRoute(route, pathname)
  );
  if (isPublic) {
    return NextResponse.next();
  }

  // Handle authenticated routes
  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/', nextUrl));
    }
    return NextResponse.next();
  }

//check if the route is for company
const isCompanyRoute = companyRoutes.some(route=>
  route === pathname || isDynamicRoute(route, pathname)
);

if(isCompanyRoute) {
  if(session?.user?.role !== 'company')
    return NextResponse.redirect(new URL('/', nextUrl)); 
    
}
 
//check if the route is for admin
const isAdminRoute = adminRoutes.some(route=>
  route === pathname || isDynamicRoute(route, pathname)
);

if(isAdminRoute) {
  if(session?.user?.role !== 'admin')
    return NextResponse.redirect(new URL('/', nextUrl)); 
    
}

  // Redirect non-authenticated users to login
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/login', nextUrl));
  }

  return NextResponse.next();
});

export const config = {
    matcher:[
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ]
}