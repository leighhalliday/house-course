import { useRouter } from "next/router";
import { Image } from "cloudinary-react";
import { useQuery, gql } from "@apollo/client";
import Layout from "src/components/layout";
// import HouseNav from "src/components/houseNav";
// import SingleMap from "src/components/singleMap";
import {
  ShowSpotQuery,
  ShowSpotQueryVariables,
} from "src/generated/ShowSpotQuery";
import EditHouse from "./edit";

const SHOW_SPOT_QUERY = gql`
  query ShowSpotQuery($id: String!) {
    spot(id: $id) {
      id
      userId
      address
      publicId
      sports
      latitude
      longitude
    }
  }
`;

export default function ShowSpot() {
  const {
    query: { id },
  } = useRouter();

  if (!id) return null;
  return <SpotData id={id as string} />;
}

function SpotData({ id }: { id: string }) {
  const { data, loading } = useQuery<ShowSpotQuery, ShowSpotQueryVariables>(
    SHOW_SPOT_QUERY,
    { variables: { id } }
  );
  if (loading || !data) return <Layout main={<div>Loading...</div>} />;
  if (!data.spot) return <Layout main={<div>Unable to load spot {id}</div>} />;

  const { spot } = data;

  return (
    <Layout
      main={
        <div className="sm:block md:flex">
          <div className="sm:w-full md:w-1/2 p-4">
            <h1 className="text-3xl">{spot.address}</h1>
            <Image
              className="pb-2"
              cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
              publicId={spot.publicId}
              alt={spot.address}
              dpr="auto"
              quality="auto"
              width={900}
              height={Math.floor((9 / 16) * 900)}
              crop="fill"
              gravity="auto"
            />

            <p>Sports: {spot.sports}</p>
          </div>
          <div className="sm:w-full md:w-1/2">Singlemap</div>
        </div>
      }
    />
  );
}
