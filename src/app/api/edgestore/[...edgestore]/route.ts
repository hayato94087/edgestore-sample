import { initEdgeStore } from "@edgestore/server";
import {
  type CreateContextOptions,
  createEdgeStoreNextHandler,
} from "@edgestore/server/adapters/next/app";
import { z } from "zod";

type Context = {
  userId: string;
  userRole: "admin" | "user";
};

async function createContext({ req }: CreateContextOptions): Promise<Context> {
  const id = "123456789";
  const role = "admin";

  return {
    userId: id,
    userRole: role,
  };
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
