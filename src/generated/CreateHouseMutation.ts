/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { HouseInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateHouseMutation
// ====================================================

export interface CreateHouseMutation_createHouse {
  __typename: "House";
  id: string;
}

export interface CreateHouseMutation {
  createHouse: CreateHouseMutation_createHouse | null;
}

export interface CreateHouseMutationVariables {
  input: HouseInput;
}
