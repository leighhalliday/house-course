/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SpotInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateSpotMutation
// ====================================================

export interface UpdateSpotMutation_updateSpot {
  __typename: "Spot";
  id: string;
  image: string;
  publicId: string;
  latitude: number;
  longitude: number;
  sports: string;
  address: string;
}

export interface UpdateSpotMutation {
  updateSpot: UpdateSpotMutation_updateSpot | null;
}

export interface UpdateSpotMutationVariables {
  id: string;
  input: SpotInput;
}
