import { useRef, useState, useContext, useMemo, useEffect } from "react";
import Link from "next/link";
import { Image } from "cloudinary-react";
import ReactMapGL, { Marker, Popup, ViewState } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useLocalState } from "src/utils/useLocalState";
import { SpotsQuery_spots } from "src/generated/SpotsQuery";
import { SearchBox } from "./searchBox";
import { SportFilterContext } from "../context/sportFilter";

interface IProps {
  setDataBounds: (bounds: string) => void;
  spots: SpotsQuery_spots[];
  highlightedId: string | null;
}

const colorForSport = (sport: string): string => {
  if (sport === "TENNIS") {
    return "#ffff00";
  } else {
    return "#ff0000";
  }
};

export default function Map({ setDataBounds, spots, highlightedId }: IProps) {
  const { filteredSports } = useContext(SportFilterContext);

  const [selected, setSelected] = useState<SpotsQuery_spots | null>(null);
  const mapRef = useRef<ReactMapGL | null>(null);
  const [viewport, setViewport] = useLocalState<ViewState>("viewport", {
    latitude: 52.379189,
    longitude: 4.899431,
    zoom: 14,
  });

  const filteredSpots = useMemo(
    () => spots.filter((spot) => filteredSports.includes(spot.sports)),
    [spots, filteredSports]
  );

  useEffect(() => {
    mapRef.current?.forceUpdate();
  }, [filteredSpots]);

  return (
    <div className="text-black relative">
      <ReactMapGL
        {...viewport}
        width="100%"
        height="calc(100vh - 64px)"
        mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN}
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
        ref={(instance) => (mapRef.current = instance)}
        minZoom={12}
        maxZoom={15}
        mapStyle={"mapbox://styles/sezayi/ckkjxz1uw2a9017nwzr3wfimk"}
        onLoad={() => {
          if (mapRef.current) {
            const bounds = mapRef.current.getMap().getBounds();
            setDataBounds(JSON.stringify(bounds.toArray()));
          }
        }}
        onInteractionStateChange={(extra) => {
          if (!extra.isDragging && mapRef.current) {
            const bounds = mapRef.current.getMap().getBounds();
            setDataBounds(JSON.stringify(bounds.toArray()));
          }
        }}
      >
        <div className="top-0 left-0 z-10 p-4 flex justify-end">
          <div className="w-1/2">
            <SearchBox
              defaultValue=""
              onSelectAddress={(_address, latitude, longitude) => {
                if (latitude && longitude) {
                  setViewport((old) => ({
                    ...old,
                    latitude,
                    longitude,
                    zoom: 15,
                  }));
                  if (mapRef.current) {
                    const bounds = mapRef.current.getMap().getBounds();
                    setDataBounds(JSON.stringify(bounds.toArray()));
                  }
                }
              }}
            />
          </div>
        </div>
        {filteredSpots.map((spot) => (
          <Marker
            key={spot.id}
            latitude={spot.latitude}
            longitude={spot.longitude}
            offsetLeft={-15}
            offsetTop={-15}
            className={highlightedId === spot.id ? "marker-active" : ""}
          >
            <button
              type="button"
              style={{ width: "24px", height: "24px", fontSize: "24px" }}
              onClick={() => setSelected(spot)}
            >
              <img
                src={
                  highlightedId === spot.id
                    ? "/spot-marker.svg"
                    : "/spot-inactive-marker.svg"
                }
                alt="spot"
                className="w-8"
              />
            </button>
          </Marker>
        ))}

        {selected && (
          <Popup
            latitude={selected.latitude}
            longitude={selected.longitude}
            onClose={() => setSelected(null)}
            closeOnClick={false}
          >
            <div className="text-center">
              <h3 className="px-4 truncate">
                {selected.address.substr(0, 30)}
              </h3>
              <h4 className="px-4 text-sm">{selected.sports}</h4>
              <Image
                className="mx-auto my-4"
                cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
                publicId={selected.publicId}
                secure
                dpr="auto"
                quality="auto"
                width={200}
                height={Math.floor((9 / 16) * 200)}
                crop="fill"
                gravity="auto"
              />
              <Link href={`/spots/${selected.id}`}>
                <a>View spot</a>
              </Link>
            </div>
          </Popup>
        )}
      </ReactMapGL>
    </div>
  );
}
