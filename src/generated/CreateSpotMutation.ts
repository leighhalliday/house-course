/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SpotInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateSpotMutation
// ====================================================

export interface CreateSpotMutation_createSpot {
  __typename: "Spot";
  id: string;
}

export interface CreateSpotMutation {
  createSpot: CreateSpotMutation_createSpot | null;
}

export interface CreateSpotMutationVariables {
  input: SpotInput;
}
