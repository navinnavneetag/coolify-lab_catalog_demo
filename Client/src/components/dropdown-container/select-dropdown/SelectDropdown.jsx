import { useRef, useEffect, memo, useCallback, useState } from "react";
import PropTypes from "prop-types";
import { DropdownTrigger } from "./dropdown-trigger/DropdownTrigger";
import { useSelectDropdown } from "@/hooks/dropdown/useSelectDropdown";
import { DropdownOptions } from "./dropdown-options/DropdownOptions";

const SelectDropdown = memo(function SelectDropdown({
  name,
  options,
  isOpen,
  onToggle,
}) {
  const [selectedOptions, setSelectedOptions] = useState(
    JSON.parse(localStorage.getItem(name))
  );
  const [selectedCount, setSelectedCount] = useState(selectedOptions?.length);

  const triggerRef = useRef(null);
  const searchInputRef = useRef(null);

  const {
    searchTerm,
    toggleOption,
    handleSearchChange,
    filteredOptions,
  } = useSelectDropdown(options, name, setSelectedOptions);

  useEffect(() => {
    const handleReset = () => {
      setSelectedOptions([]);
      setSelectedCount(0);
    };

    window.addEventListener('filtersReset', handleReset);
    
    return () => {
      window.removeEventListener('filtersReset', handleReset);
    };
  }, []);

  useEffect(() => {
    const storedOptions = JSON.parse(localStorage.getItem(name));
    setSelectedOptions(storedOptions);

    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [name, isOpen]);

  const handleTriggerClick = useCallback(
    (e) => {
      e.stopPropagation();
      onToggle();
    },
    [onToggle]
  );

  console.log("SelectDropdown");
  
  return (
    <div className="relative">
      <DropdownTrigger
        name={name}
        onClick={handleTriggerClick}
        isOpen={isOpen}
        triggerRef={triggerRef}
        selectedCount={selectedCount}
      />

      {isOpen && (
        <div
          className="absolute bg-card mt-1 z-50 overflow-x-hidden text-card-foreground min-w-full border rounded w-full text-wrap"
          role="listbox"
          id="dropdown-list"
        >
          <div className="z-50">
            <DropdownOptions
              options={filteredOptions == null ? options : filteredOptions}
              onToggleOption={toggleOption}
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              searchInputRef={searchInputRef}
              selectedOptions={selectedOptions}
            />
          </div>
        </div>
      )}
    </div>
  );
});

SelectDropdown.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default SelectDropdown;
