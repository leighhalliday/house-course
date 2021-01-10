/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { BoundsInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: HousesQuery
// ====================================================

export interface HousesQuery_houses {
  __typename: "House";
  id: string;
  latitude: number;
  longitude: number;
  address: string;
  publicId: string;
  bedrooms: number;
}

export interface HousesQuery {
  houses: HousesQuery_houses[];
}

export interface HousesQueryVariables {
  bounds: BoundsInput;
}
