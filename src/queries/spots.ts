import { gql } from "@apollo/client";

export const SPOTS_QUERY = gql`
  query SpotsQuery($bounds: BoundsInput!) {
    spots(bounds: $bounds) {
      id
      latitude
      longitude
      address
      publicId
      sports
      reviews {
        rating
      }
    }
  }
`;
