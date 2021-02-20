import "reflect-metadata";
import { NextApiRequest } from "next";
import { ApolloServer } from "apollo-server-micro";
import { schema } from "src/schema";
import { Context } from "src/schema/context";
import { prisma } from "src/prisma";
import { loadIdToken } from "src/auth/firebaseAdmin";

const server = new ApolloServer({
  schema,
  context: async ({ req }: { req: NextApiRequest }): Promise<Context> => {
    const uid = await loadIdToken(req);

    return {
      uid,
      prisma,
    };
  },
  tracing: process.env.NODE_ENV === "development",
});

const handler = server.createHandler({ path: "/api/graphql" });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
