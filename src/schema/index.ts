import { buildSchemaSync, Resolver, Query } from "type-graphql";
import { ImageResolver } from "./image";
import { SpotResolver } from "./spot";
import { authChecker } from "./auth";

export const schema = buildSchemaSync({
  resolvers: [ImageResolver, SpotResolver],
  emitSchemaFile: process.env.NODE_ENV === "development",
  authChecker,
});
