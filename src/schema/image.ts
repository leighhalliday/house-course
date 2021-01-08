import {
  ObjectType,
  Field,
  Int,
  Resolver,
  Mutation,
  Authorized,
} from "type-graphql";
const cloudinary = require("cloudinary").v2;

@ObjectType()
class ImageSignature {
  @Field((_type) => String)
  signature!: string;

  @Field((_type) => Int)
  timestamp!: number;
}

@Resolver()
export class ImageResolver {
  @Authorized()
  @Mutation((_returns) => ImageSignature)
  createImageSignature(): ImageSignature {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature: string = cloudinary.utils.api_sign_request(
      {
        timestamp,
      },
      process.env.CLOUDINARY_SECRET
    );
    return { timestamp, signature };
  }
}
