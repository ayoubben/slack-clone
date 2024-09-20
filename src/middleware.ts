import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";
 
const isPublicPage= createRouteMatcher(["/signin"]); 


export default convexAuthNextjsMiddleware((request, { convexAuth }) => {
  if (!isPublicPage(request) && !convexAuth.isAuthenticated()) {
    return nextjsMiddlewareRedirect(request, "/signin");
  }

});
 
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};