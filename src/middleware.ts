// import { NextRequest, NextResponse } from "next/server";
import {
  clerkMiddleware,
  createRouteMatcher,
  // currentUser,
} from "@clerk/nextjs/server";

// import prisma from "clients/prisma";

const isProtectedRoute = createRouteMatcher(["/app(.*)"]);

// App project middleware
// Validate if project exists and belongs to current user
// async function projectMiddleware(req: NextRequest) {
//   // const projectId = request.nextUrl.searchParams.get("projectId");
//   // console.log({ projectId });
//   console.log(req.nextUrl.pathname);

//   if (req.nextUrl.pathname.startsWith("/app/project/")) {
//     const user = await currentUser();
//     const userEmail = user?.emailAddresses.at(0)?.emailAddress as string;
//     const dbUser = await prisma.user.findUnique({
//       where: { email: userEmail },
//     });
//     const projectId = req.nextUrl.pathname
//       .replace("/app/project/", "")
//       .split("/")
//       .at(0);
//     const project = await prisma.project.findUnique({
//       where: {
//         id: projectId,
//         createdById: dbUser?.id,
//       },
//     });

//     if (project === null) {
//       return NextResponse.redirect(
//         new URL(`/app`)
//         // new URL(`${req.nextUrl.pathname}/`, req.nextUrl)
//       )
//     }

//     console.log({ projectId });
//   }

//   return NextResponse.next();
// }

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();

  // return projectMiddleware(req);
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
