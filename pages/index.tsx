// import { useState } from "react";
// import { useQuery, gql } from "@apollo/client";
import { useDebounce } from "use-debounce";
import Layout from "src/components/layout";
import Map from "src/components/map";
// import HouseList from "src/components/houseList";
// import { useLastData } from "src/utils/useLastData";
import { useLocalState } from "src/utils/useLocalState";
// import { HousesQuery, HousesQueryVariables } from "src/generated/HousesQuery";

type BoundsArray = [[number, number], [number, number]];

export default function Home() {
  const [dataBounds, setDatabounds] = useLocalState<string>(
    "bounds",
    "[[0,0],[0,0]]"
  );

  const [debounceDataBounds] = useDebounce(dataBounds, 200);

  console.log(debounceDataBounds);

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
