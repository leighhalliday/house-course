import {
  ObjectType,
  InputType,
  Field,
  ID,
  Float,
  Int,
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  Authorized,
} from "type-graphql";
import { Min, Max } from "class-validator";
import { getBoundsOfDistance } from "geolib";
import { Context, AuthorizedContext } from "./context";
import { parseType } from "graphql";

@InputType()
class CoordinatesInput {
  @Min(-90)
  @Max(90)
  @Field((_type) => Float)
  latitude!: number;

  @Min(-180)
  @Max(180)
  @Field((_type) => Float)
  longitude!: number;
}
@InputType()
class BoundsInput {
  @Field((_type) => CoordinatesInput)
  sw!: CoordinatesInput;

  @Field((_type) => CoordinatesInput)
  ne!: CoordinatesInput;
}

@InputType()
class SpotInput {
  @Field((_type) => String)
  address!: string;

  @Field((_type) => String)
  image!: string;

  @Field((_type) => CoordinatesInput)
  coordinates!: CoordinatesInput;

  @Field((_type) => String)
  sports!: string;
}

@ObjectType()
class Spot {
  @Field((_type) => ID)
  id!: number;

  @Field((_type) => String)
  userId!: string;

  @Field((_type) => Float)
  latitude!: number;

  @Field((_type) => Float)
  longitude!: number;

  @Field((_type) => String)
  address!: string;

  @Field((_type) => String)
  image!: string;

  @Field((_type) => String)
  publicId(): string {
    const match = this.image.match(/.*\/v\d*\/(.*)$/);
    if (match && match.length === 2) {
      return match[1];
    } else {
      return "default-image_ltmvxz.jpg";
    }
  }

  @Field((_type) => String)
  sports!: string;

  @Field((_type) => [Spot])
  async nearby(@Ctx() ctx: Context) {
    const bounds = getBoundsOfDistance(
      { latitude: this.latitude, longitude: this.longitude },
      1000
    );

    return ctx.prisma.spot.findMany({
      where: {
        latitude: { gte: bounds[0].latitude, lte: bounds[1].latitude },
        longitude: { gte: bounds[0].longitude, lte: bounds[1].longitude },
        id: { not: { equals: this.id } },
      },
      take: 1000,
    });
  }
}

@Resolver()
export class SpotResolver {
  @Query((_returns) => Spot, { nullable: true })
  async spot(@Arg("id") id: string, @Ctx() ctx: Context) {
    return ctx.prisma.spot.findOne({ where: { id: parseInt(id, 10) } });
  }

  @Query((_returns) => [Spot], { nullable: true })
  async spots(@Arg("bounds") bounds: BoundsInput, @Ctx() ctx: Context) {
    return ctx.prisma.spot.findMany({
      where: {
        latitude: { gte: bounds.sw.latitude, lte: bounds.ne.latitude },
        longitude: { gte: bounds.sw.longitude, lte: bounds.ne.longitude },
      },
      take: 800,
    });
  }

  @Authorized()
  @Mutation((_returns) => Spot, { nullable: true })
  async createSpot(
    @Arg("input") input: SpotInput,
    @Ctx() ctx: AuthorizedContext
  ) {
    return await ctx.prisma.spot.create({
      data: {
        userId: ctx.uid,
        image: input.image,
        address: input.address,
        latitude: input.coordinates.latitude,
        longitude: input.coordinates.longitude,
        sports: input.sports,
      },
    });
  }
  @Authorized()
  @Mutation((_returns) => Spot, { nullable: true })
  async updateSpot(
    @Arg("id") id: string,
    @Arg("input") input: SpotInput,
    @Ctx() ctx: AuthorizedContext
  ) {
    const spotId = parseInt(id, 10);
    const spot = await ctx.prisma.spot.findOne({ where: { id: spotId } });

    if (!spot || spot.userId !== ctx.uid) return null;

    return await ctx.prisma.spot.update({
      where: { id: spotId },
      data: {
        image: input.image,
        address: input.address,
        latitude: input.coordinates.latitude,
        longitude: input.coordinates.longitude,
        sports: input.sports,
      },
    });
  }

  @Authorized()
  @Mutation((_returns) => Boolean, { nullable: false })
  async deleteSpot(
    @Arg("id") id: string,
    @Ctx() ctx: AuthorizedContext
  ): Promise<boolean> {
    const spotId = parseInt(id, 10);
    const spot = await ctx.prisma.spot.findOne({ where: { id: spotId } });

    if (!spot || spot.userId !== ctx.uid) return false;

    await ctx.prisma.spot.delete({
      where: { id: spotId },
    });
    return true;
  }
}
