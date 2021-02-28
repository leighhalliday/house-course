import { useMutation, gql } from "@apollo/client";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "src/auth/useAuth";
import { DeleteHouse, DeleteHouseVariables } from "src/generated/DeleteHouse";

interface IProps {
  spot: {
    id: string;
    userId: string;
  };
}

export default function SpotNav({ spot }: IProps) {
  const { user } = useAuth();
  const canManage = !!user && user.uid === spot.userId;

  return (
    <>
      <Link href="/">
        <a>Back to overview</a>
      </Link>
      {canManage && (
        <>
          {" | "}
          <Link href={`/spots/${spot.id}/edit`}>
            <a>edit</a>
          </Link>
        </>
      )}
    </>
  );
}
