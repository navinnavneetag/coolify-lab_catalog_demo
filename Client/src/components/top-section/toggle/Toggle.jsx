import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { memo } from "react";
import PropTypes from "prop-types";

const Toggle = memo(function Toggle({
  toggleValue,
  setToggleValue,
}) {
  const handleValueChange = (value) => {
    if (value) {
      setToggleValue(value);
      localStorage.setItem("Test Category", value);
    }
  };

  return (
    <ToggleGroup
      variant="outline"
      type="single"
      size="sm"
      value={toggleValue}
      onValueChange={handleValueChange}
    >
      <ToggleGroupItem value="Chemical" className="bg-background">
        Chemical
      </ToggleGroupItem>
      <ToggleGroupItem value="Biological" className=" bg-background">
        Biological
      </ToggleGroupItem>
      <ToggleGroupItem value="Both" className=" bg-background">
        Both
      </ToggleGroupItem>
    </ToggleGroup>
  );
});

Toggle.propTypes = {
  toggleValue: PropTypes.string.isRequired,
  setToggleValue: PropTypes.func.isRequired,
};

export default Toggle;
