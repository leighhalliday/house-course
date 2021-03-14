import React, { createContext, useContext, useState, useEffect } from "react";

import { useQuery, gql } from "@apollo/client";
import { useDebounce } from "use-debounce";
import { useLocalState } from "src/utils/useLocalState";
import { SpotsQuery, SpotsQueryVariables } from "src/generated/SpotsQuery";

const SPOTS_QUERY = gql`
  query SpotsQuery($bounds: BoundsInput!) {
    spots(bounds: $bounds) {
      id
      latitude
      longitude
      address
      publicId
      sports
    }
  }
`;

type BoundsArray = [[number, number], [number, number]];

const parseBounds = (boundsString: string) => {
  const bounds = JSON.parse(boundsString) as BoundsArray;
  return {
    sw: {
      latitude: bounds[0][1],
      longitude: bounds[0][0],
    },
    ne: {
      latitude: bounds[1][1],
      longitude: bounds[1][0],
    },
  };
};

type SportFilterType = string[];

type ExportedType = {
  filteredSports: SportFilterType;
  setFilteredSports: (value: SportFilterType) => void;
};

export const SportFilterContext = createContext({
  filteredSports: [],
  setFilteredSports: () => null,
} as ExportedType);

export const SportFilterProvider: React.FC = ({ children }) => {
  const [value, setValue] = useState<SportFilterType>([]);

  const [dataBounds, setDatabounds] = useLocalState<string>(
    "bounds",
    "[[0,0],[0,0]]"
  );

  const [debouncedDataBounds] = useDebounce(dataBounds, 200);

  const { data, error } = useQuery<SpotsQuery, SpotsQueryVariables>(
    SPOTS_QUERY,
    {
      variables: { bounds: parseBounds(debouncedDataBounds) },
    }
  );

  useEffect(() => {
    const spots = data?.spots;

    if (spots && value.length === 0) {
      const spotSports = spots.map((spot) => spot.sports);

      const sports = spotSports.filter(
        (sport, index) => spotSports.indexOf(sport) === index
      );

      setValue(sports);
    }
  }, [data]);

  return (
    <SportFilterContext.Provider
      value={{
        filteredSports: value,
        setFilteredSports: (val: SportFilterType) => setValue(val),
      }}
    >
      {children}
    </SportFilterContext.Provider>
  );
};
