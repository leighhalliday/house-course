import { useMutation, gql } from "@apollo/client";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "src/auth/useAuth";
import { DeleteSpot, DeleteSpotVariables } from "src/generated/DeleteSpot";

const DELETE_MUTATION = gql`
  mutation DeleteSpot($id: String!) {
    deleteSpot(id: $id)
  }
`;
interface IProps {
  spot: {
    id: string;
    userId: string;
  };
}

export default function SpotNav({ spot }: IProps) {
  const router = useRouter();
  const { user } = useAuth();
  const canManage = !!user && user.uid === spot.userId;
  const [deleteSpot, { loading }] = useMutation<
    DeleteSpot,
    DeleteSpotVariables
  >(DELETE_MUTATION);

  return (
    <>
      <Link href="/">
        <a>back to overview</a>
      </Link>
      {canManage && (
        <>
          {" | "}
          <Link href={`/spots/${spot.id}/edit`}>
            <a>edit</a>
          </Link>
          {" | "}
          <button
            disabled={loading}
            type="button"
            onClick={async () => {
              if (confirm("Are you sure?")) {
                await deleteSpot({ variables: { id: spot.id } });
                router.push("/");
              }
            }}
          >
            delete
          </button>
        </>
      )}
    </>
  );
}
