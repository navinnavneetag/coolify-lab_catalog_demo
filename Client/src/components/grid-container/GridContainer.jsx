import { memo } from "react";
import PropTypes from "prop-types";
import { ChemicalGlass } from "iconsax-react";
import { Data } from "iconsax-react";
import { Category2 } from "iconsax-react";
import { Category } from "iconsax-react";

const GridContainer = memo(function GridContainer({ name, value }) {
  return (
    <>
      <div className="rounded border bg-card text-card-foreground shadow p-4 flex gap-4 items-center justify-start">
        <div
          className={`items-center gap-2 p-1 lg:p-3 rounded lg:block hidden`}
          style={{ backgroundColor: "#8b5cf6" }}
        >
          {name === "Total Labs" && (
            <ChemicalGlass size="28 " color="#d9e3f0" variant="TwoTone" />
          )}
          {name === "Total Unique Parameters" && (
            <Data size="28" color="#d9e3f0" variant="TwoTone" />
          )}
          {name === "Main Food Categories" && (
            <Category size="28" color="#d9e3f0" variant="TwoTone" />
          )}
          {name === "Test Sub Categories" && (
            <Category2 size="28" color="#d9e3f0" variant="TwoTone" />
          )}
        </div>
        <div className="flex flex-col ">
          <div className="text-xs lg:text-sm font-medium text-muted-foreground">
            {name}
          </div>
          <div className="text-2xl lg:text-3xl font-semibold">{value}</div>
        </div>
      </div>
    </>
  );
});

GridContainer.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default GridContainer;
