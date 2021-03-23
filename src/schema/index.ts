import { buildSchemaSync, Resolver, Query } from "type-graphql";
import { ImageResolver } from "./image";
import { SpotResolver } from "./spot";
import { authChecker } from "./auth";
import { SpotReviewResolver } from "./spotReview";

export const schema = buildSchemaSync({
  resolvers: [ImageResolver, SpotResolver, SpotReviewResolver],
  emitSchemaFile: process.env.NODE_ENV === "development",
  authChecker,
});
