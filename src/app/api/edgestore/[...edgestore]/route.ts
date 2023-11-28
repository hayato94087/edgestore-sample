import { auth, clerkClient } from "@clerk/nextjs";
import { initEdgeStore } from "@edgestore/server";
import {
  type CreateContextOptions,
  createEdgeStoreNextHandler,
} from "@edgestore/server/adapters/next/app";
import { z } from "zod";

type Context = {
  userId: string | null;
  userRole: "admin" | "user" | "guest";
};

async function createContext({ req }: CreateContextOptions): Promise<Context> {
  const user = await auth();

  if (user && user.userId) {
    const clerkUser = await clerkClient.users.getUser(user.userId);
    const role = clerkUser?.privateMetadata?.role;
    if (!role) {
      return { userId: user.userId, userRole: "guest" };
    }

    if (role === "admin" || role === "user") {
      return {
        userId: user.userId,
        userRole: role,
      };
    }

    return { userId: user.userId, userRole: "guest" };
  }
  return { userId: null, userRole: "guest" };
}

const es = initEdgeStore.context<Context>().create();

/**
 * This is the main router for the Edge Store buckets.
 */
const edgeStoreRouter = es.router({
  publicFiles: es.fileBucket(),
  filesBucket: es
    .fileBucket()
    .path(({ ctx }) => [{ author: ctx.userId }])
    .accessControl({
      OR: [
        {
          // this will make sure that only the author of the file can access it
          userId: { path: "author" },
        },
        {
          // or if the user is an admin
          userRole: {
            eq: "admin",
          }, // same as { userRole: 'admin' }
        },
      ],
    }),
});

const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
  createContext,
});
export { handler as GET, handler as POST };
/**
 * This type is used to create the type-safe client for the frontend.
 */
export type EdgeStoreRouter = typeof edgeStoreRouter;
