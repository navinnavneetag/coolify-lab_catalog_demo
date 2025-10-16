import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import SelectDropdown from "./select-dropdown/SelectDropdown";
import { memo } from "react";

const DropdownContainer = memo(function DropdownContainer({ name, options }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    document.dispatchEvent(
      new CustomEvent("closeOtherDropdowns", {
        detail: { currentDropdown: name },
      })
    );
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleCloseDropdown = (event) => {
      if (event.detail.currentDropdown !== name) {
        setIsOpen(false);
      }
    };

    document.addEventListener("closeOtherDropdowns", handleCloseDropdown);

    return () => {
      document.removeEventListener("closeOtherDropdowns", handleCloseDropdown);
    };
  }, [name]);

  return (
    <div
      ref={dropdownRef}
      className="dropdown-container w-full bg-background rounded border"
      role="region"
      aria-label={`${name} dropdown section`}
    >
      <SelectDropdown
        name={name}
        options={options}
        isOpen={isOpen}
        onToggle={handleToggle}
      />
    </div>
  );
});

DropdownContainer.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default DropdownContainer;
