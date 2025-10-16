import { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleQuantile } from "d3-scale";
import { Tooltip as ReactTooltip } from "react-tooltip";
import indiaTopoJson from "../../utils/india.topo.js";
import STATE_CODES from "@/lib/stateCodes.js";
import PropTypes from "prop-types";
const PROJECTION_CONFIG = {
  scale: 350,
  center: [78.9629, 22.5937],
};

const COLOR_RANGE = [
  "#fff7ed", // Lightest
  "#ffedd5",
  "#fed7aa",
  "#fdba74",
  "#fb923c",
  "#f97316",
  "#ea580c",
  "#c2410c",
  "#9a3412", // Darkest
];

const DEFAULT_COLOR = "#EEE";

const geographyStyle = {
  default: {
    outline: "none",
  },
  hover: {
    fill: "#ccc",
    transition: "all 250ms",
    outline: "none",
  },
  pressed: {
    outline: "none",
  },
};

function IndiaMap({ stateGroupedData }) {
  const [tooltipContent, setTooltipContent] = useState("");

  const data = stateGroupedData.map((item) => ({
    id: STATE_CODES[item.state],
    state: item.state,
    value: item.labs,
  }));

  const colorScale = scaleQuantile()
    .domain(data.map((d) => d.value.length))
    .range(COLOR_RANGE);

  const onMouseEnter = (geo, current = { value: [] }) => {
    return () => {
      const content = current?.value
        ? `${geo.properties.name.toUpperCase()}\n\n${current.value.join(
            "\n"
          )}`
        : `${geo.properties.name.toUpperCase()}\nNo labs`;
      setTooltipContent(content);
    };
  };

  const onMouseLeave = () => {
    setTooltipContent("");
  };

  return (
    <div className="rounded border text-card-foreground shadow p-4 bg-background flex flex-col">
      <div className="p-2 space-y-1.5 flex flex-col mb-4">
        <div className="font-semibold leading-none tracking-tight">
          Map View
        </div>
        <div className="text-sm text-muted-foreground">
          Geographic Distribution of Labs Across India
        </div>
      </div>
      <div className="full-width-height container flex justify-center items-center mb-2">
        <ReactTooltip
          id="map-tooltip"
          place="top"
          content={tooltipContent}
          className="whitespace-pre-line !bg-white !text-gray-800 !border !border-gray-200 !shadow-lg !rounded !py-2 !px-3"
        />

        <ComposableMap
          projectionConfig={PROJECTION_CONFIG}
          projection="geoMercator"
          width={600}
          height={200}
          className="flex-1 focus:outline-none"
          data-tooltip-id="map-tooltip"
        >
          <Geographies geography={indiaTopoJson}>
            {({ geographies, path }) =>
              geographies.map((geo) => {
                const current = data.find((s) => s.id === geo.id);
                const centroid = path.centroid(geo);
                
                return (
                  <g key={geo.rsmKey}>
                    <Geography
                      geography={geo}
                      fill={current ? colorScale(current.value.length) : DEFAULT_COLOR}
                      style={geographyStyle}
                      onMouseEnter={onMouseEnter(geo, current)}
                      onMouseLeave={onMouseLeave}
                      data-tooltip-id="map-tooltip"
                    />
                    {current && current.value.length > 0 && (
                      <text
                        x={centroid[0]}
                        y={centroid[1]}
                        textAnchor="middle"
                        fill="#000000"
                        fontSize={4}
                        style={{ pointerEvents: 'none' }}
                      >
                        {current.value.length}
                      </text>
                    )}
                  </g>
                );
              })
            }
          </Geographies>
        </ComposableMap>

        {/* <MapLegend colorScale={colorScale} data={data} /> */}
      </div>
    </div>
  );
}

IndiaMap.propTypes = {
  stateGroupedData: PropTypes.array.isRequired,
};

export default IndiaMap;
