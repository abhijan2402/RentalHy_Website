import { useState } from "react";

export function useFarmFilters(initialValues) {
  const defaultFilters = {
    priceRange: [1000, 1000000],
    yesNoToggles: {
      swimmingPool: "",
      foodAvailable: "",
      outsideFoodAllowed: "",
      cctvAvailable: "",
      soundSystemAvailable: "",
      childrenGames: "",
      adultGames: "",
      kitchenSetupWithMaterials: "",
      parkingAvailable: "",
    },
  };

  const [filters, setFilters] = useState(initialValues || defaultFilters);
  const [pendingFilters, setPendingFilters] = useState(filters); // Chip multi-select toggle
  console.log(filters);
  const toggleFilterValue = (category, value) => {
    setPendingFilters((prev) => {
      const arr = prev[category] || [];
      const updated = arr.includes(value)
        ? arr.filter((v) => v !== value)
        : [...arr, value];
      return { ...prev, [category]: updated };
    });
  }; // Yes/No toggle handler for yesNoToggles object keys

  const toggleYesNo = (key, value) => {
    setPendingFilters((prev) => ({
      ...prev,
      yesNoToggles: { ...prev.yesNoToggles, [key]: value },
    }));
  }; // Range slider change

  const handleRangeChange = (key, range) => {
    setPendingFilters((prev) => ({ ...prev, [key]: range }));
  }; // Apply filters (commit)

  const applyFilters = () => {
    setFilters(pendingFilters);
  }; // Reset filters

  const resetFilters = () => {
    setFilters(defaultFilters);
    setPendingFilters(defaultFilters);
  }; // UI helper for chip selection

  const isSelected = (category, value) =>
    pendingFilters[category]?.includes(value);

  return {
    filters,
    setFilters,
    pendingFilters,
    setPendingFilters,
    toggleFilterValue,
    toggleYesNo,
    handleRangeChange,
    resetFilters,
    applyFilters,
    isSelected,
  };
}
