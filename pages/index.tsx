// import { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { useDebounce } from "use-debounce";
import Layout from "src/components/layout";
import Map from "src/components/map";
// import HouseList from "src/components/houseList";
import { useLastData } from "src/utils/useLastData";
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

export default function Home() {
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

  const lastData = useLastData(data);

  if (error) return <Layout main={<div>Error loadding spots</div>} />;

  return (
    <Layout
      main={
        <div className="flex">
          <div
            className="w-1/4 pb-4"
            style={{ maxHeight: "calc(100vh - 64px)", overflow: "scroll" }}
          >
            Spots
          </div>
          <div className="w-3/4">
            <Map setDataBounds={setDatabounds} />
          </div>
        </div>
      }
    />
  );
}
