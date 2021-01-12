import { useMutation, gql } from "@apollo/client";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "src/auth/useAuth";
import { DeleteHouse, DeleteHouseVariables } from "src/generated/DeleteHouse";

const DELETE_MUTATION = gql`
  mutation DeleteHouse($id: String!) {
    deleteHouse(id: $id)
  }
`;

interface IProps {
  house: {
    id: string;
    userId: string;
  };
}

export default function HouseNav({ house }: IProps) {
  const router = useRouter();
  const { user } = useAuth();
  const canManage = !!user && user.uid === house.userId;
  const [deleteHouse, { loading }] = useMutation<
    DeleteHouse,
    DeleteHouseVariables
  >(DELETE_MUTATION);

  return (
    <>
      <Link href="/">
        <a>map</a>
      </Link>
      {canManage && (
        <>
          {" | "}
          <Link href={`/houses/${house.id}/edit`}>
            <a>edit</a>
          </Link>
          {" | "}
          <button
            disabled={loading}
            type="button"
            onClick={async () => {
              if (confirm("Are you sure?")) {
                await deleteHouse({ variables: { id: house.id } });
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
