/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { BoundsInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: SpotsQuery
// ====================================================

export interface SpotsQuery_spots_reviews {
  __typename: "SpotReview";
  rating: number;
}

export interface SpotsQuery_spots {
  __typename: "Spot";
  id: string;
  latitude: number;
  longitude: number;
  address: string;
  publicId: string;
  sports: string;
  reviews: SpotsQuery_spots_reviews[];
}

export interface SpotsQuery {
  spots: SpotsQuery_spots[] | null;
}

export interface SpotsQueryVariables {
  bounds: BoundsInput;
}
