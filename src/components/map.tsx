import {
  useRef,
  useState,
  useContext,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import Link from "next/link";
import { Image } from "cloudinary-react";
import ReactMapGL, { Popup, ViewState } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useLocalState } from "src/utils/useLocalState";
import { SpotsQuery_spots } from "src/generated/SpotsQuery";
import { SearchBox } from "./searchBox";
import { SportFilterContext } from "../context/sportFilter";
import MapMarkers from "./mapMarkers";

interface IProps {
  setDataBounds: (bounds: string) => void;
  spots: SpotsQuery_spots[] | any;
  highlightedId: string | null;
}

export default function Map({ setDataBounds, spots, highlightedId }: IProps) {
  const { filteredSports } = useContext(SportFilterContext);

  const [selected, setSelected] = useState<SpotsQuery_spots | null>(null);
  const mapRef = useRef<ReactMapGL | null>(null);
  const [viewport, setViewport] = useLocalState<ViewState>("viewport", {
    latitude: 52.379189,
    longitude: 4.899431,
    zoom: 15,
  });

  const filteredSpots = useMemo(
    () => spots.filter((spot: any) => filteredSports.includes(spot.sports)),
    [spots, filteredSports]
  );

  useEffect(() => {
    mapRef.current?.forceUpdate();
  }, [filteredSpots]);

  const handleSelect = useCallback((spot: SpotsQuery_spots) => {
    setSelected(spot);
  }, []);

  const search = useMemo(
    () => (
      <div className="top-0 left-0 absolute z-50 p-2 flex w-full">
        <div className="w-full">
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
    ),
    []
  );

  const popup = useMemo(
    () => (
      <>
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
      </>
    ),
    [selected]
  );
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
        {search}
        <MapMarkers
          highlightedId={highlightedId}
          onSelect={handleSelect}
          spots={filteredSpots}
        />
        {popup}
      </ReactMapGL>
    </div>
  );
}
