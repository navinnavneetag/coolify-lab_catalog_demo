import GridContainer from "@/components/grid-container/GridContainer";
import PropTypes from "prop-types";
import { memo } from "react";

const GridSection = memo(function GridSection({ gridItems }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {gridItems.map((item) => (
        <GridContainer key={item.id} name={item.name} value={item.value} />
      ))}
    </div>
  );
});

GridSection.propTypes = {
  gridItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ),
};

export default GridSection;
