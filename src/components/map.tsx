import { useRef, useState } from "react";
import Link from "next/link";
import { Image } from "cloudinary-react";
import ReactMapGL, { Marker, Popup, ViewState } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useLocalState } from "src/utils/useLocalState";
import { SpotsQuery_spots } from "src/generated/SpotsQuery";
// import { SearchBox } from "./searchBox";

interface IProps {
  setDataBounds: (bounds: string) => void;
  spots: SpotsQuery_spots[];
  highlightedId: string | null;
}

export default function Map({ setDataBounds, spots, highlightedId }: IProps) {
  const [selected, setSelected] = useState<SpotsQuery_spots | null>(null);
  const mapRef = useRef<ReactMapGL | null>(null);
  const [viewport, setViewport] = useLocalState<ViewState>("viewport", {
    latitude: 52.379189,
    longitude: 4.899431,
    zoom: 14,
  });

  return (
    <div className="text-black relative">
      <ReactMapGL
        {...viewport}
        width="100%"
        height="calc(100vh - 64px)"
        mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN}
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
        ref={(instance) => (mapRef.current = instance)}
        minZoom={10}
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
        {spots.map((spot) => (
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
              <h3 className="px-4">{selected.address.substr(0, 30)}</h3>
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
