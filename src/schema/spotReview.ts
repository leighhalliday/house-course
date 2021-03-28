import {
  ObjectType,
  InputType,
  Field,
  ID,
  Int,
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  Authorized,
} from "type-graphql";
import { Context, AuthorizedContext } from "./context";
import { Spot } from "./spot";

@InputType()
class SpotReviewInput {
  @Field((_type) => ID)
  spotId!: number;

  @Field((_type) => String)
  comments!: string;

  @Field((_type) => Int)
  rating!: number;
}

@ObjectType()
export class SpotReview {
  @Field((_type) => ID)
  id!: number;

  @Field((_type) => String)
  creator!: string;

  @Field((_type) => ID)
  spotId!: number;

  @Field((_type) => Int)
  rating!: string;

  @Field((_type) => String)
  comments!: string;

  @Field((_type) => Spot)
  async spot(@Ctx() ctx: Context) {
    return ctx.prisma.spot.findOne({
      where: {
        id: this.spotId,
      },
    });
  }
}

@Resolver()
export class SpotReviewResolver {
  @Query((_returns) => SpotReview, { nullable: true })
  async spotReview(@Arg("id") id: string, @Ctx() ctx: Context) {
    return ctx.prisma.spot.findOne({ where: { id: parseInt(id, 10) } });
  }

  @Mutation((_returns) => SpotReview, { nullable: true })
  async createSpotReview(
    @Arg("input") input: SpotReviewInput,
    @Ctx() ctx: Context
  ) {
    const spot = await ctx.prisma.spot.findOne({
      where: {
        id: Number(input.spotId),
      },
    });
    if (spot === null) {
      throw new Error("no such spot");
    }

    return await ctx.prisma.spotReview.create({
      data: {
        spot: {
          connect: {
            id: Number(input.spotId),
          },
        },
        creator: "anonymous",
        comments: input.comments,
        rating: input.rating,
      },
    });
  }
}
