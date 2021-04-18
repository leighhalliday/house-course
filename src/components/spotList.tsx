import Link from "next/link";
import { Image, Transformation } from "cloudinary-react";
import { SpotsQuery_spots } from "src/generated/SpotsQuery";
import { useContext, useMemo } from "react";
import { SportFilterContext } from "../context/sportFilter";
import SpotFilter from "./spotFilter";

interface IProps {
  spots: SpotsQuery_spots[] | any;
  setHighlightedId: (id: string | null) => void;
}

export default function SpotList({ spots, setHighlightedId }: IProps) {
  const { filteredSports } = useContext(SportFilterContext);
  const filteredSpots = useMemo(
    () => spots.filter((spot: any) => filteredSports.includes(spot.sports)),
    [spots, filteredSports]
  );
  return (
    <>
      <div
        className="sticky top-0"
        style={{ backgroundColor: "rgb(34, 34, 34)" }}
      >
        <SpotFilter spots={spots} />
      </div>
      {filteredSpots.map((spot: any) => (
        <Link key={spot.id} href={`/spots/${spot.id}`}>
          <div
            className="px-8 pt-4 cursor-pointer lg:flex"
            onMouseEnter={() => setHighlightedId(spot.id)}
            onMouseLeave={() => setHighlightedId(null)}
          >
            <div className="w-full divide-y divide-y-reverse divide-white divide-opacity-25">
              <div className="w-full w-full lg:flex">
                <Image
                  className="rounded pb-2"
                  cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
                  publicId={spot.publicId}
                  alt={spot.address}
                  secure
                  dpr="auto"
                  quality="auto"
                  width={360}
                  height={Math.floor((9 / 16) * 360)}
                  crop="fill"
                  gravity="auto"
                >
                  <Transformation defaultImage="default-image_ltmvxz.jpg" />
                </Image>
                <div className="sm-w-full lg:pl-4">
                  <h2 className="text-xl">{spot.address}</h2>
                  <p className="pb-2 text-lg text-gray-200">
                    Sport: {spot.sports}
                  </p>
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
