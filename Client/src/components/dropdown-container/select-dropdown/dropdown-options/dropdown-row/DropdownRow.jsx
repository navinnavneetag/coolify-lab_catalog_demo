import { memo, useCallback, useMemo } from "react";
import PropTypes from "prop-types";

const DropdownRow = memo(function DropdownRow({
  index,
  option,
  selectedOptions,
  onToggleOption,
}) {
  const isSelected = useMemo(
    () => Array.isArray(selectedOptions) && selectedOptions.includes(option),
    [selectedOptions, option]
  );

  const handleClick = useCallback(
    (e) => {
      e.stopPropagation();
      const isCurrentlySelected =
        Array.isArray(selectedOptions) && selectedOptions.includes(option);
      onToggleOption(option, !isCurrentlySelected);
    },
    [selectedOptions, option, onToggleOption]
  );

  const rowClasses = useMemo(
    () =>
      `max-w-full cursor-pointer select-none items-center justify-start py-3 px-4 text-sm rounded ${
        isSelected
          ? "bg-primary text-primary-foreground hover:opacity-90"
          : "hover:bg-primary text-muted-foreground hover:text-primary-foreground"
      }`,
    [isSelected]
  );

  if (!option) return null;
  return (
    <div
      key={index}
      className={rowClasses}
      role="option"
      aria-selected={isSelected}
      onClick={handleClick}
    >
      {option}
    </div>
  );
});

DropdownRow.propTypes = {
  index: PropTypes.number.isRequired,
  option: PropTypes.string,
  selectedOptions: PropTypes.arrayOf(PropTypes.string),
  onToggleOption: PropTypes.func.isRequired,
};

export default DropdownRow;
