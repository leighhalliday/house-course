import { useState } from "react";
import Link from "next/link";
import ReactMapGL, { Marker, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface ISpot {
  id: string;
  latitude: number;
  longitude: number;
}
interface IProps {
  spot: ISpot;
  nearby: ISpot[];
}

export default function SingleMap({ spot, nearby }: IProps) {
  const [viewport, setViewport] = useState({
    latitude: spot.latitude,
    longitude: spot.longitude,
    zoom: 15,
  });

  return (
    <div className="text-black">
      <ReactMapGL
        {...viewport}
        width="100%"
        height="calc(100vh - 64px)"
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
        mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN}
        mapStyle={"mapbox://styles/sezayi/ckkjxz1uw2a9017nwzr3wfimk"}
        scrollZoom={true}
        minZoom={8}
      >
        <div className="absolute top-0 left-0 p-4">
          <NavigationControl showCompass={false} />
        </div>

        <Marker
          latitude={spot.latitude}
          longitude={spot.longitude}
          offsetLeft={-15}
          offsetTop={-15}
        >
          <button type="button">
            <img
              src="/spot-marker.svg"
              className="w-8"
              alt="selected spot"
            ></img>
          </button>
        </Marker>

        {nearby.map((near) => (
          <Marker
            key={near.id}
            latitude={near.latitude}
            longitude={near.longitude}
            offsetLeft={-15}
            offsetTop={-15}
          >
            <Link href={`/spots/${near.id}`}>
              <a>
                <img
                  src="/spot-nearby-marker.svg"
                  className="w-8"
                  alt="nearby spot"
                ></img>
              </a>
            </Link>
          </Marker>
        ))}
      </ReactMapGL>
    </div>
  );
}
