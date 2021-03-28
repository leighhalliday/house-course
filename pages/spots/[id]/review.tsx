import { GetServerSideProps, NextApiRequest } from "next";
import { useRouter } from "next/router";
import { useQuery, gql } from "@apollo/client";
import { loadIdToken } from "src/auth/firebaseAdmin";
import Layout from "src/components/layout";
import SpotReview from "src/components/spotReview";
import { useAuth } from "src/auth/useAuth";

const ADD_SPOTREVIEW_QUERY = gql`
  query AddSpotReviewQuery($id: String!) {
    SpotReview(id: $id) {
      spotId
      rating
      comments
    }
  }
`;

export default function Addreview() {
  const {
    query: { id },
  } = useRouter();

  if (!id) return null;

  return <ReviewData id={id as string} />;
}

function ReviewData({ id }: { id: string }) {
  const { user } = useAuth();
  const { data, loading } = useQuery<AddReviewQuery, AddReviewQueryVariables>(
    ADD_SPOTREVIEW_QUERY,
    { variables: { id } }
  );

  if (!user) return <Layout main={<div>Please login</div>} />;
  if (loading) return <Layout main={<div>loading...</div>} />;
  if (data && !data.spot)
    return <Layout main={<div> We were unable to load the review</div>} />;

  return <Layout main={<SpotReview spot={data.spot} />} />;
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
