import { IoIosSearch } from "react-icons/io";
import PropTypes from 'prop-types';
import { memo, useCallback, useMemo } from 'react';

const DropdownSearch = memo(function DropdownSearch({ 
  searchTerm, 
  onSearchChange, 
  searchInputRef 
}) {
  const handleChange = useCallback((e) => {
    onSearchChange(e);
  }, [onSearchChange]);

  const containerClasses = useMemo(() => 
    "flex items-center justify-start px-4 border-t border-b border-border gap-2"
  , []);

  const inputClasses = useMemo(() => 
    "w-full py-3 text-sm focus:outline-none"
  , []);

  return (
    <div className={containerClasses}>
      <IoIosSearch 
        size={20} 
        aria-hidden="true" 
      />
      <input
        ref={searchInputRef}
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleChange}
        className={inputClasses}
        aria-label="Search options"
      />
    </div>
  );
});

DropdownSearch.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  searchInputRef: PropTypes.object.isRequired,
};

export { DropdownSearch }; 