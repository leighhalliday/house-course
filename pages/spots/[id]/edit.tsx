import { GetServerSideProps, NextApiRequest } from "next";
import { useRouter } from "next/router";
import { useQuery, gql } from "@apollo/client";
import { loadIdToken } from "src/auth/firebaseAdmin";
import Layout from "src/components/layout";
import SpotForm from "src/components/spotForm";
import { useAuth } from "src/auth/useAuth";
import {
  EditSpotQuery,
  EditSpotQueryVariables,
} from "src/generated/EditSpotQuery";

const EDIT_HOUSE_QUERY = gql`
  query EditSpotQuery($id: String!) {
    spot(id: $id) {
      id
      userId
      address
      image
      publicId
      sports
      latitude
      longitude
    }
  }
`;

export default function EditHouse() {
  const {
    query: { id },
  } = useRouter();

  if (!id) return null;
  return <SpotData id={id as string} />;

  return <div>EditHouse</div>;
}

function SpotData({ id }: { id: string }) {
  const { user } = useAuth();
  const { data, loading } = useQuery<EditSpotQuery, EditSpotQueryVariables>(
    EDIT_HOUSE_QUERY,
    { variables: { id } }
  );

  if (!user) return <Layout main={<div>Please login</div>} />;
  if (loading) return <Layout main={<div>loading...</div>} />;
  if (data && !data.spot)
    return <Layout main={<div> We were unable to load the spot</div>} />;
  if (user.uid !== data?.spot?.userId)
    return <Layout main={<div> You don't have edit permissions</div>} />;

  return <Layout main={<SpotForm spot={data.spot} />} />;
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const uid = await loadIdToken(req as NextApiRequest);

  if (!uid) {
    res.setHeader("location", "/auth");
    res.statusCode = 302;
    res.end();
  }

  return { props: {} };
};
