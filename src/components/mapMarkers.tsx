import { SpotsQuery_spots } from "../generated/SpotsQuery";
import { memo } from "react";
import { Marker } from "react-map-gl";
import SvgMarker from "./svgMarker";
import { SPORTS } from "../utils/sports";

type Sport = typeof SPORTS[number];

const sportColorMap: Record<Sport, string> = {
  BASKETBAL: "orange",
  BEACHVOLLEY: "BurlyWood",
  FITNESS: "blue",
  JEUDEBOULES: "fuchsia",
  OVERIG: "yellow",
  SKATE: "purple",
  SWIMMING: "magenta",
  TAFELTENNIS: "gray",
  TENNIS: "black",
  VOETBAL: "green",
  voetbal: "#00ff00",
  BOKSEN: "#4361ee",
};

const DEFAULT_COLOR = "#ffff00";

const HIGHLIGHT_COLOR = "#FF0000";

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
        // className={highlightedId === spot.id ? "marker-active" : ""}
      >
        <button
          type="button"
          style={{ width: "24px", height: "24px", fontSize: "24px" }}
          onClick={() => onSelect(spot)}
        >
          <SvgMarker
            baseColor={
              highlightedId === spot.id
                ? HIGHLIGHT_COLOR
                : sportColorMap[spot.sports as Sport]
            }
          />
        </button>
      </Marker>
    ))}
  </>
);

export default memo(MapMarkers);
