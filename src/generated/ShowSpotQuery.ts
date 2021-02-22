/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ShowSpotQuery
// ====================================================

export interface ShowSpotQuery_spot_nearby {
  __typename: "Spot";
  id: string;
  latitude: number;
  longitude: number;
}

export interface ShowSpotQuery_spot {
  __typename: "Spot";
  id: string;
  userId: string;
  address: string;
  publicId: string;
  sports: string;
  latitude: number;
  longitude: number;
  nearby: ShowSpotQuery_spot_nearby[];
}

export interface ShowSpotQuery {
  spot: ShowSpotQuery_spot | null;
}

export interface ShowSpotQueryVariables {
  id: string;
}
