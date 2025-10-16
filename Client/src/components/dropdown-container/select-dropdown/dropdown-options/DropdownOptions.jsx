import PropTypes from "prop-types";
import { memo, useMemo } from "react";
import { DropdownSearch } from "./dropdown-search/DropdownSearch";
import DropdownRow from "./dropdown-row/DropdownRow";

const DropdownOptions = memo(function DropdownOptions({
  options,
  onToggleOption,
  searchTerm,
  onSearchChange,
  searchInputRef,
  selectedOptions = [],
}) {
  
  const sortedOptions = useMemo(() => {
    if (!Array.isArray(options)) return [];
    const selected = options?.filter((option) =>
      selectedOptions?.includes(option)
    );
    const unselected = options?.filter(
      (option) => !selectedOptions?.includes(option)
    );
    return [...selected, ...unselected];
  }, [options, selectedOptions]);

  const optionsList = useMemo(
    () =>
      sortedOptions.map((option, index) => (
        <DropdownRow
          key={`${index}`}
          index={index}
          option={option}
          selectedOptions={selectedOptions}
          onToggleOption={onToggleOption}
        />
      )),
    [sortedOptions, selectedOptions, onToggleOption]
  );

  return (
    <>
      <DropdownSearch
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        searchInputRef={searchInputRef}
      />

      <div className="overflow-auto max-h-[200px] max-w-full">
        {sortedOptions.length === 0 ? (
          <div className="py-2 px-4 text-sm text-muted-foreground">
            No options found
          </div>
        ) : (
          <div className="flex flex-col">{optionsList}</div>
        )}
      </div>
    </>
  );
});

DropdownOptions.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string),
  selectedOptions: PropTypes.arrayOf(PropTypes.string),
  onToggleOption: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  searchInputRef: PropTypes.object.isRequired,
};

export { DropdownOptions };
