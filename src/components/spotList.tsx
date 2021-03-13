import Link from "next/link";
import { Image, Transformation } from "cloudinary-react";
import { SpotsQuery_spots } from "src/generated/SpotsQuery";

import SpotFilter from "./spotFilter";

interface IProps {
  spots: SpotsQuery_spots[];
  setHighlightedId: (id: string | null) => void;
}

export default function SpotList({ spots, setHighlightedId }: IProps) {
  return (
    <>
      <SpotFilter spots={spots} />
      {spots.map((spot) => (
        <Link key={spot.id} href={`/spots/${spot.id}`}>
          <div
            className="px-8 pt-4 cursor-pointer flex flex-row"
            onMouseEnter={() => setHighlightedId(spot.id)}
            onMouseLeave={() => setHighlightedId(null)}
          >
            <div className="w-full divide-y divide-y-reverse divide-white divide-opacity-25">
              <div className="sm:w-full md:w-full flex">
                <Image
                  className="rounded pb-2"
                  cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
                  publicId={spot.publicId}
                  alt={spot.address}
                  secure
                  dpr="auto"
                  quality="auto"
                  width={320}
                  height={Math.floor((9 / 16) * 320)}
                  crop="fill"
                  gravity="auto"
                >
                  <Transformation defaultImage="default-image_ltmvxz.jpg" />
                </Image>
                <div className="sm-w-full sm:pl-4">
                  <h2 className="text-lg">{spot.address}</h2>
                  <p className="pb-2 text-gray-200">Sport: {spot.sports}</p>
                </div>
              </div>
              <hr className="mt-4" />
            </div>
          </div>
        </Link>
      ))}
    </>
  );
}
