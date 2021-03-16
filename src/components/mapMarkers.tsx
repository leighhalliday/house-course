import { SpotsQuery_spots } from "../generated/SpotsQuery";
import { memo } from "react";
import { Marker } from "react-map-gl";
import SvgMarker from "./svgMarker";
import { SPORTS } from "../utils/sports";

type Sport = typeof SPORTS[number];

const sportColorMap: Record<Sport, string> = {
  BASKETBAL: "green",
  BEACHVOLLEY: "red",
  FITNESS: "blue",
  JEUDEBOULES: "yellow",
  OVERIG: "orange",
  SKATE: "purple",
  SWIMMING: "magenta",
  TAFELTENNIS: "gray",
  TENNIS: "black",
  VOETBAL: "brown",
  voetbal: "#00ff00",
};

const DEFAULT_COLOR = "#ffff00";

interface MapMarkersProps {
  spots: SpotsQuery_spots[];
  highlightedId: string | null;
  onSelect: (spot: SpotsQuery_spots) => void;
}
const MapMarkers: React.FC<MapMarkersProps> = ({
  spots,
  highlightedId,
  onSelect,
}) => (
  <>
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
          onClick={() => onSelect(spot)}
        >
          <SvgMarker
            baseColor={sportColorMap[spot.sports as Sport] ?? DEFAULT_COLOR}
          />
        </button>
      </Marker>
    ))}
  </>
);

export default memo(MapMarkers);
