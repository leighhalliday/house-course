/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ShowHouseQuery
// ====================================================

export interface ShowHouseQuery_house_nearby {
  __typename: "House";
  id: string;
  latitude: number;
  longitude: number;
}

export interface ShowHouseQuery_house {
  __typename: "House";
  id: string;
  userId: string;
  address: string;
  publicId: string;
  bedrooms: number;
  latitude: number;
  longitude: number;
  nearby: ShowHouseQuery_house_nearby[];
}

export interface ShowHouseQuery {
  house: ShowHouseQuery_house | null;
}

export interface ShowHouseQueryVariables {
  id: string;
}
