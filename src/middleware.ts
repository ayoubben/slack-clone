import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";
 
const isPublicPage= createRouteMatcher(["/auth"]); 


export default convexAuthNextjsMiddleware((request, { convexAuth }) => {

  console.log("isPublicPage(request)+++N", isPublicPage(request));
  console.log("convexAuth.isAuthenticated()+++N", convexAuth.isAuthenticated());

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