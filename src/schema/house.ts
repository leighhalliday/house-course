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
class HouseInput {
  @Field((_type) => String)
  address!: string;

  @Field((_type) => String)
  image!: string;

  @Field((_type) => CoordinatesInput)
  coordinates!: CoordinatesInput;

  @Field((_type) => Int)
  bedrooms!: number;
}

@ObjectType()
class House {
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
    const parts = this.image.split("/");
    return parts[parts.length - 1];
  }

  @Field((_type) => Int)
  bedrooms!: number;

  @Field((_type) => [House])
  async nearby(@Ctx() ctx: Context) {
    const bounds = getBoundsOfDistance(
      { latitude: this.latitude, longitude: this.longitude },
      10000
    );

    return ctx.prisma.house.findMany({
      where: {
        latitude: { gte: bounds[0].latitude, lte: bounds[1].latitude },
        longitude: { gte: bounds[0].longitude, lte: bounds[1].longitude },
        id: { not: { equals: this.id } },
      },
      take: 25,
    });
  }
}

@Resolver()
export class HouseResolver {
  @Query((_returns) => House, { nullable: true })
  async house(@Arg("id") id: string, @Ctx() ctx: Context) {
    return ctx.prisma.house.findOne({ where: { id: parseInt(id, 10) } });
  }

  @Query((_returns) => [House], { nullable: false })
  async houses(@Arg("bounds") bounds: BoundsInput, @Ctx() ctx: Context) {
    return ctx.prisma.house.findMany({
      where: {
        latitude: { gte: bounds.sw.latitude, lte: bounds.ne.latitude },
        longitude: { gte: bounds.sw.longitude, lte: bounds.ne.longitude },
      },
      take: 50,
    });
  }

  @Authorized()
  @Mutation((_returns) => House, { nullable: true })
  async createHouse(
    @Arg("input") input: HouseInput,
    @Ctx() ctx: AuthorizedContext
  ) {
    return await ctx.prisma.house.create({
      data: {
        userId: ctx.uid,
        image: input.image,
        address: input.address,
        latitude: input.coordinates.latitude,
        longitude: input.coordinates.longitude,
        bedrooms: input.bedrooms,
      },
    });
  }

  @Authorized()
  @Mutation((_returns) => House, { nullable: true })
  async updateHouse(
    @Arg("id") id: string,
    @Arg("input") input: HouseInput,
    @Ctx() ctx: AuthorizedContext
  ) {
    const houseId = parseInt(id, 10);
    const house = await ctx.prisma.house.findOne({ where: { id: houseId } });

    if (!house || house.userId !== ctx.uid) return null;

    return await ctx.prisma.house.update({
      where: { id: houseId },
      data: {
        image: input.image,
        address: input.address,
        latitude: input.coordinates.latitude,
        longitude: input.coordinates.longitude,
        bedrooms: input.bedrooms,
      },
    });
  }

  @Authorized()
  @Mutation((_returns) => Boolean, { nullable: false })
  async deleteHouse(
    @Arg("id") id: string,
    @Ctx() ctx: AuthorizedContext
  ): Promise<boolean> {
    const houseId = parseInt(id, 10);
    const house = await ctx.prisma.house.findOne({ where: { id: houseId } });

    if (!house || house.userId !== ctx.uid) return false;

    await ctx.prisma.house.delete({
      where: { id: houseId },
    });
    return true;
  }
}
