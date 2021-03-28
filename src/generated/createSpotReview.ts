/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SpotReviewInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: createSpotReview
// ====================================================

export interface createSpotReview_createSpotReview_spot_reviews {
  __typename: "SpotReview";
  id: string;
}

export interface createSpotReview_createSpotReview_spot {
  __typename: "Spot";
  id: string;
  reviews: createSpotReview_createSpotReview_spot_reviews[];
}

export interface createSpotReview_createSpotReview {
  __typename: "SpotReview";
  id: string;
  creator: string;
  spotId: string;
  rating: number;
  comments: string;
  spot: createSpotReview_createSpotReview_spot;
}

export interface createSpotReview {
  createSpotReview: createSpotReview_createSpotReview | null;
}

export interface createSpotReviewVariables {
  input: SpotReviewInput;
}
