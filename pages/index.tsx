import { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { useDebounce } from "use-debounce";
import Layout from "src/components/layout";
import Map from "src/components/map";
import SpotList from "src/components/spotList";
import { useLastData } from "src/utils/useLastData";
import { useLocalState } from "src/utils/useLocalState";
import { SpotsQuery, SpotsQueryVariables } from "src/generated/SpotsQuery";
import { SPOTS_QUERY } from "../src/queries/spots";

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
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
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
    <>
      <Layout
        main={
          <div className="flex flex-col-reverse lg:flex lg:flex-row">
            <div
              className="lg:w-2/5 pb-4"
              style={{ maxHeight: "calc(100vh - 64px)", overflow: "scroll" }}
            >
              <SpotList
                spots={lastData ? lastData.spots : []}
                setHighlightedId={setHighlightedId}
              />
            </div>
            <div className="lg:w-3/5 sm:hidden md:block lg:block">
              <Map
                setDataBounds={setDatabounds}
                spots={lastData ? lastData.spots : []}
                highlightedId={highlightedId}
              />
            </div>
          </div>
        }
      />
    </>
  );
}
