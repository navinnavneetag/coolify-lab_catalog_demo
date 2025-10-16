import { useState, useCallback, useMemo } from "react";

export function useSelectDropdown(options, name, setSelectedOptions) {
  const [searchTerm, setSearchTerm] = useState("");

  const toggleOption = useCallback(
    async (option, checked) => {
      const currentSelection = JSON.parse(localStorage.getItem(name)) || [];
      const newSelection = !checked
        ? currentSelection.filter((item) => item !== option)
        : [...currentSelection, option];


      localStorage.setItem(name, JSON.stringify(newSelection));
      setSelectedOptions(newSelection);

    },
    [name, setSelectedOptions]
  );

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return null;
    const normalizedSearchTerm = searchTerm
      ?.toLowerCase()
      .trim()
      .replace(/\s+/g, " ");
    return (
      options?.filter((option) =>
        option
          ?.toLowerCase()
          .trim()
          .replace(/\s+/g, " ")
          .includes(normalizedSearchTerm)
      ) || []
    );
  }, [searchTerm, options]);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  return {
    searchTerm,
    toggleOption,
    handleSearchChange,
    filteredOptions,
  };
}
