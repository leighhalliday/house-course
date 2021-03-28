import { GetServerSideProps, NextApiRequest } from "next";
import { useRouter } from "next/router";
import { useQuery, useMutation, gql } from "@apollo/client";
import { loadIdToken } from "src/auth/firebaseAdmin";
import Layout from "src/components/layout";
import SpotReview from "src/components/spotReview";
import { useAuth } from "src/auth/useAuth";
import {
  createSpotReview,
  createSpotReviewVariables,
} from "src/generated/createSpotReview";



export default function GetReview() {
  const {
    query: { id },
  } = useRouter();
  if (!id) return null;
  return <ReviewData id={id as string} />;
}
function ReviewData({ id }: { id: string }) {
  const { user } = useAuth();
  

  return <Form>
    <input type="text"></input> 

   />;
}
