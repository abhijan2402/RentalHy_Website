import { useState } from "react";
import { useGetResortFarmPropertiesQuery } from "../redux/api/conventionApi";

export function useFarmFilters(initialValues) {
  const defaultFilters = {
    priceRange: [1000, 5000000],
    yesNoToggles: {
      swimmingPool: "",
      ac_available: "",
      foodAvailable: "",
      outsideFoodAllowed: "",
      cctvAvailable: "",
      soundSystemAvailable: "",
      childrenGames: "",
      adultGames: "",
      kitchenSetupWithMaterials: "",
      valet_parking: "",
      alcohol_allowed: "",
    },
  };

  const [filters, setFilters] = useState(initialValues || defaultFilters);
  const [pendingFilters, setPendingFilters] = useState(filters);
  const [search, setSearch] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sort, setSort] = useState("");
  const [perpage, setPerPage] = useState("");
  const [pageno, setPageNo] = useState(1);

  // Prepare filters for API call
  const filterPayload = {
    search: searchKeyword || search || "",
    location: "",
    price_min: filters.priceRange?.[0] || "",
    price_max: filters.priceRange?.[1] || "",
    seating_capacity_min: filters.seatingCapacity?.[0] || "",
    seating_capacity_max: filters.seatingCapacity?.[1] || "",
    min_area: filters.roomSize?.min || "",
    max_area: filters.roomSize?.max || "",
    sort_by: sort || "",
    per_page: perpage || "",
    ac_available: filters?.yesNoToggles?.ac_available,
    valet_parking: filters?.yesNoToggles?.parkingAvailable,
    alcohol_allowed: filters?.yesNoToggles?.swimmingPool,
  };

  // Fetch data
    const { data, isLoading, error } = useGetResortFarmPropertiesQuery({
      filterPayload,
      pageno,
    });

    // console.log(data);

  // Chip multi-select toggle
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

  const handleSearchInputChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchButton = () => {
    if (searchKeyword === "") {
      if (search.trim() !== "") setSearchKeyword(search);
    } else {
      setSearch("");
      setSearchKeyword("");
    }
  };

  // Handlers for sorting
  const handleSortChange = (e) => {
    setSort(e.target.value);
  };


  return {
    data,
    isLoading,
    error,
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
    handleSearchInputChange,
    handleSearchButton,
    handleSortChange,
    search,
    searchKeyword,
    sort,
    setPageNo,
  };
}
