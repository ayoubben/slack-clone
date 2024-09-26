import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";
 
const isPublicPage= createRouteMatcher(["/auth"]); 


export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {

  console.log("middleware", convexAuth.getToken())
  if (isPublicPage(request) && convexAuth.isAuthenticated()) {
    console.log("ixi")
    return nextjsMiddlewareRedirect(request, "/");
  }

  if (!isPublicPage(request) && !convexAuth.isAuthenticated()) {
    return nextjsMiddlewareRedirect(request, "/auth");
  }



});
 
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};