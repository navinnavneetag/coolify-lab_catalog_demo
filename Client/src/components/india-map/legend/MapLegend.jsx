import PropTypes from "prop-types";
const MapLegend = ({ colorScale, data }) => {
  const sortedData = [...data].sort((a, b) => b.value.length - a.value.length);

  return (
    <div className="flex-1 flex flex-col gap-2 justify-center items-center">
      <div className="flex flex-col gap-2 max-h-full overflow-y-auto pr-2">
        {sortedData.map((item) => (
          <div className="flex gap-4" key={item.state}>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium w-4">
                {item.value.length}
              </span>
              <div
                className="w-10 h-4 rounded"
                style={{ backgroundColor: colorScale(item.value.length) }}
              />
              <span className="text-sm flex-1">{item.state}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

MapLegend.propTypes = {
  colorScale: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
};

export default MapLegend;
