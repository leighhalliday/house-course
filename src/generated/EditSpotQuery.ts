/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: EditSpotQuery
// ====================================================

export interface EditSpotQuery_spot {
  __typename: "Spot";
  id: string;
  userId: string;
  address: string;
  image: string;
  publicId: string;
  sports: string;
  latitude: number;
  longitude: number;
}

export interface EditSpotQuery {
  spot: EditSpotQuery_spot | null;
}

export interface EditSpotQueryVariables {
  id: string;
}
