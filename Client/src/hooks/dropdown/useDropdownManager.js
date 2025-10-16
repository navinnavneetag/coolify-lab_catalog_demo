import { useState } from 'react';

export function useDropdownManager() {
  const [openDropdown, setOpenDropdown] = useState(false);
  const handleDropdownToggle = () => {
    setOpenDropdown((prev) => !prev);
  };

  return {
    openDropdown,
    handleDropdownToggle,
  };
} 