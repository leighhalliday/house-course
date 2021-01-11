import { useRouter } from "next/router";
import { Image } from "cloudinary-react";
import { useQuery, gql } from "@apollo/client";
import Layout from "src/components/layout";
import HouseNav from "src/components/houseNav";
import SingleMap from "src/components/singleMap";
import {
  ShowHouseQuery,
  ShowHouseQueryVariables,
} from "src/generated/ShowHouseQuery";

const SHOW_HOUSE_QUERY = gql`
  query ShowHouseQuery($id: String!) {
    house(id: $id) {
      id
      userId
      address
      publicId
      bedrooms
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

export default function ShowHouse() {
  const {
    query: { id },
  } = useRouter();

  if (!id) return null;
  return <HouseData id={id as string} />;
}

function HouseData({ id }: { id: string }) {
  const { data, loading } = useQuery<ShowHouseQuery, ShowHouseQueryVariables>(
    SHOW_HOUSE_QUERY,
    { variables: { id } }
  );

  if (loading || !data) return <Layout main={<div>Loading...</div>} />;
  if (!data.house)
    return <Layout main={<div>Unable to load house {id}</div>} />;

  const { house } = data;

  return (
    <Layout
      main={
        <div className="sm:block md:flex">
          <div className="sm:w-full md:w-1/2 p-4">
            <HouseNav house={house} />

            <h1 className="text-3xl my-2">{house.address}</h1>

            <Image
              className="pb-2"
              cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
              publicId={house.publicId}
              alt={house.address}
              secure
              dpr="auto"
              quality="auto"
              width={900}
              height={Math.floor((9 / 16) * 900)}
              crop="fill"
              gravity="auto"
            />

            <p>{house.bedrooms} 🛌 house</p>
          </div>
          <div className="sm:w-full md:w-1/2">
            <SingleMap house={house} nearby={house.nearby} />
          </div>
        </div>
      }
    />
  );
}
