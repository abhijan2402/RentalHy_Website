import { useState } from "react";
import { useGetHostelListQuery } from "../redux/api/hostelApi";

export function useHostelFilters(initialValues) {
  // ------- Categories matching the image -------
  const defaultFilters = {
    priceRange: [0, 500000],
    roomTypes: [],
    genders: [],
    facilities: [],
    foodOptions: [],
    stayTypes: [],
    occupancyCapacity: [],
  };
  const [filters, setFilters] = useState(initialValues || defaultFilters); // ------- Local staging of filters before apply -------

  // console.log(filters);

  const [pendingFilters, setPendingFilters] = useState(filters);
  const [search, setSearch] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sort, setSort] = useState("");
  const [perpage, setPerPage] = useState("");
  const [pageno, setPageNo] = useState(1);

  // Prepare filters for API call
  const filterPayload = {
    search: searchKeyword || search || "",
    sort_by: sort || "",
    per_page: perpage || "",
    room_types: filters.roomTypes,
    genders: filters.genders,
    facilities: filters.facilities,
    food_options: filters.foodOptions,
    stay_types: filters.stayTypes,
    occupancy_capacity: filters.occupancyCapacity,
    price_min: filters.priceRange?.[0] || "",
    price_max: filters.priceRange?.[1] || "",
  };

  // Fetch data
  const { data, isLoading, error } = useGetHostelListQuery({
    filterPayload,
    pageno,
  });

  console.log(data);

  // ------- Chip/tag multi-select handler -------

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
