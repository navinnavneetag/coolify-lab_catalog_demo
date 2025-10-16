import PropTypes from 'prop-types';
import { memo, useMemo } from 'react';

const DropdownTrigger = memo(function DropdownTrigger({ 
  name, 
  onClick, 
  isOpen, 
  triggerRef,
  selectedCount
}) {
  const buttonClasses = useMemo(() => (
    "flex h-9 w-full items-center justify-between whitespace-nowrap rounded " +
    " bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background " +
    "placeholder:text-muted-foreground hover:bg-secondary"
  ), []);

  const ariaProps = useMemo(() => ({
    'aria-expanded': isOpen,
    'aria-haspopup': "listbox",
    'aria-controls': isOpen ? "dropdown-list" : undefined
  }), [isOpen]);

  console.log("DropdownTrigger");

  return (
    <button
      ref={triggerRef}
      className={buttonClasses}
      onClick={onClick}
      {...ariaProps}
    >
      <span className='font-medium'>{name}</span>
      {selectedCount > 0 && (
        <span className="ml-2 text-xs text-muted-foreground">
          {selectedCount}
        </span>
      )}
    </button>
  );
});

DropdownTrigger.propTypes = {
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  triggerRef: PropTypes.object.isRequired,
  selectedCount: PropTypes.number.isRequired,
};

export { DropdownTrigger }; 