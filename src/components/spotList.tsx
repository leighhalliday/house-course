import Link from "next/link";
import { Image } from "cloudinary-react";
import { SpotsQuery_spots } from "src/generated/SpotsQuery";

interface IProps {
  spots: SpotsQuery_spots[];
  setHighlightedId: (id: string | null) => void;
}

export default function SpotList({ spots, setHighlightedId }: IProps) {
  return (
    <>
      {spots.map((spot) => (
        <Link key={spot.id} href={`/spots/${spot.id}`}>
          <div
            className="first:pt-0 px-8 pt-4 cursor-pointer flex flex-wrap"
            onMouseEnter={() => setHighlightedId(spot.id)}
            onMouseLeave={() => setHighlightedId(null)}
          >
            <div className="sm:w-full md:w1/2">
              <Image
                className="rounded pb-2"
                cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
                publicId={spot.publicId}
                alt={spot.address}
                secure
                dpr="auto"
                quality="auto"
                width={480}
                height={Math.floor((9 / 16) * 480)}
                crop="fill"
                gravity="auto"
              />
              <div className="sm-w-full md:w1/2 sm:pl-0">
                <h2 className="text-lg">{spot.address}</h2>
                <p className="pb-2">Sport: {spot.sports}</p>
                <hr></hr>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
}
