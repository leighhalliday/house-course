import { useState } from "react";
import Link from "next/link";
import ReactMapGL, { Marker, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface IHouse {
  id: string;
  latitude: number;
  longitude: number;
}

interface IProps {
  house: IHouse;
  nearby: IHouse[];
}

export default function SingleMap({ house, nearby }: IProps) {
  const [viewport, setViewport] = useState({
    latitude: house.latitude,
    longitude: house.longitude,
    zoom: 13,
  });

  return (
    <div className="text-black">
      <ReactMapGL
        {...viewport}
        width="100%"
        height="calc(100vh - 64px)"
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
        mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN}
        mapStyle="mapbox://styles/leighhalliday/ckhjaksxg0x2v19s1ovps41ef"
        scrollZoom={false}
        minZoom={8}
      >
        <div className="absolute top-0 left-0 p-4">
          <NavigationControl showCompass={false} />
        </div>

        <Marker
          latitude={house.latitude}
          longitude={house.longitude}
          offsetLeft={-15}
          offsetTop={-15}
        >
          <button
            type="button"
            style={{ width: "30px", height: "30px", fontSize: "30px" }}
          >
            <img src="/home-color.svg" className="w-8" alt="selected house" />
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
            <Link href={`/houses/${near.id}`}>
              <a style={{ width: "30px", height: "30px", fontSize: "30px" }}>
                <img src="/home-solid.svg" className="w-8" alt="nearby house" />
              </a>
            </Link>
          </Marker>
        ))}
      </ReactMapGL>
    </div>
  );
}
