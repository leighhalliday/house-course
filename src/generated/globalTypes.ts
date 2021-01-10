/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export interface BoundsInput {
  ne: CoordinatesInput;
  sw: CoordinatesInput;
}

export interface CoordinatesInput {
  latitude: number;
  longitude: number;
}

export interface HouseInput {
  address: string;
  bedrooms: number;
  coordinates: CoordinatesInput;
  image: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
