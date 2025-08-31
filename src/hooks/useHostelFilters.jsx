import { useState } from "react";

export function useHostelFilters(initialValues) {
  // ------- Categories matching the image -------
  const defaultFilters = {
    priceRange: [100, 25000],
    roomTypes: [],
    genders: [],
    facilities: [],
    foodOptions: [],
    stayTypes: [],
    occupancyCapacity: [],
  };
  const [filters, setFilters] = useState(initialValues || defaultFilters); // ------- Local staging of filters before apply -------

  console.log(filters);

  const [pendingFilters, setPendingFilters] = useState(filters); // ------- Chip/tag multi-select handler -------

  const toggleFilterValue = (category, value) => {
    setPendingFilters((prev) => {
      const arr = prev[category] || [];
      const updated = arr.includes(value)
        ? arr.filter((v) => v !== value)
        : [...arr, value];
      return { ...prev, [category]: updated };
    });
  }; // ------- Range slider handler -------

  const handleRangeChange = (key, range) => {
    setPendingFilters((prev) => ({ ...prev, [key]: range }));
  }; // ------- Apply: commit staged filters -------

  const applyFilters = () => {
    setFilters(pendingFilters);
  }; // ------- Reset both filters -------

  const resetFilters = () => {
    setFilters(defaultFilters);
    setPendingFilters(defaultFilters);
  }; // ------- Use for UI: selected values --------

  const isSelected = (category, value) =>
    pendingFilters[category]?.includes(value);

  return {
    filters,
    setFilters,
    pendingFilters,
    setPendingFilters,
    toggleFilterValue,
    handleRangeChange,
    resetFilters,
    applyFilters,
    isSelected,
  };
}
