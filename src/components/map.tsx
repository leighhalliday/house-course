import { useRef, useState } from "react";
import Link from "next/link";
import { Image } from "cloudinary-react";
import ReactMapGL, { Marker, Popup, ViewState } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
// import { useLocalState } from "src/utils/useLocalState";
// import { HousesQuery_houses } from "src/generated/HousesQuery";
// import { SearchBox } from "./searchBox";

interface IProps {}

export default function Map({}: IProps) {
  const mapRef = useRef<ReactMapGL | null>(null);
  const [viewport, setViewport] = useState<ViewState>({
    latitude: 52.379189,
    longitude: 4.899431,
    zoom: 12,
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
      ></ReactMapGL>
    </div>
  );
}
