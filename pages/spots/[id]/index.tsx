import { useRouter } from "next/router";
import { Image, Transformation } from "cloudinary-react";
import { useQuery, gql, ApolloClient } from "@apollo/client";
import Layout from "src/components/layout";
import SpotNav from "src/components/spotNav";
import SingleMap from "src/components/singleMap";
import {
  ShowSpotQuery,
  ShowSpotQueryVariables,
} from "src/generated/ShowSpotQuery";
import EditSpot from "./edit";
import SpotReview from "src/components/spotReview";
import { useAuth } from "src/auth/useAuth";

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
      nearby {
        id
        latitude
        longitude
      }
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

  const { authenticated } = useAuth();

  return (
    <Layout
      main={
        <div className="sm:block md:flex ">
          <div className="sm:w-full md:w-1/2 p-8">
            <SpotNav spot={spot} />

            <h1 className="text-4xl mb-4">{spot.address}</h1>
            <Image
              className="pb-8"
              cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
              publicId={spot.publicId}
              alt={spot.address}
              dpr="auto"
              quality="auto"
              width={900}
              height={Math.floor((9 / 16) * 900)}
              crop="fill"
              gravity="auto"
            >
              <Transformation defaultImage="default-image_ltmvxz.jpg" />
            </Image>
            {authenticated ? (
              <div className="flex mb-4">
                <p className="pr-2">Review this spot:</p>
                <SpotReview />
              </div>
            ) : (
              <div></div>
            )}

            <p>Sports: {spot.sports}</p>
          </div>
          <div className="sm:w-full md:w-1/2">
            <SingleMap spot={spot} nearby={spot.nearby} />
          </div>
        </div>
      }
    />
  );
}
