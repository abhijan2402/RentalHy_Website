import { useState } from "react";
import { useGetConventionPropertiesQuery } from "../redux/api/conventionApi";

export function useConventionFilters(initialValues) {
  const defaultFilters = {
    priceRange: [0, 0],
    seatingCapacity: [0, 0],

    yesNoToggles: {
      valetParking: "",
      acAvailable: "",
      roomsAvailable: "",
      royaltyForDecoration: "",
      royaltyForKitchen: "",
      generatorAvailable: "",
      normalWaterForCooking: "",
      drinkingWaterAvailable: "",
      providesCateringPerson: "",
      // cateringPersons: "",
      alcoholAllowed: "",
      photoShootsAllowed: "",
      childrenGames: "",
      // swimmingPoll: "",
      // waterForCooking: "",
      // photographersRequired: "",
    },
    timeOfOccasion: [],
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
    seating_capacity_min:
      filters.seatingCapacity?.[0] > 0 ? filters.seatingCapacity[0] : "",
    seating_capacity_max:
      filters.seatingCapacity?.[1] > 0 ? filters.seatingCapacity[1] : "",

    min_area: filters.roomSize?.min || "",
    max_area: filters.roomSize?.max || "",
    sort_by: sort || "",
    per_page: perpage || "",
    valet_parking: filters?.yesNoToggles?.valetParking,
    ac_available: filters?.yesNoToggles?.acAvailable,
    rooms_available: filters?.yesNoToggles?.roomsAvailable,
    royalty_decoration: filters?.yesNoToggles?.royaltyForDecoration,
    royalty_kitchen: filters?.yesNoToggles?.royaltyForKitchen,
    generator_available: filters?.yesNoToggles?.generatorAvailable,
    normal_water_cooking: filters?.yesNoToggles?.normalWaterForCooking,
    drinking_water_available: filters?.yesNoToggles?.drinkingWaterAvailable,
    // catering_persons: filters?.yesNoToggles?.cateringPersons,
    alcohol_allowed: filters?.yesNoToggles?.alcoholAllowed,
    photo_shoots_allowed: filters?.yesNoToggles?.photoShootsAllowed,
    children_games: filters?.yesNoToggles?.childrenGames,
    // swimming_poll: filters?.yesNoToggles?.swimmingPoll,
    // water_for_cooking: filters?.yesNoToggles?.waterForCooking,
    provides_catering_person: filters?.yesNoToggles?.providesCateringPerson,
    // photographers_required: filters?.yesNoToggles?.photographersRequired,
    time_of_occasion: filters.timeOfOccasion || [],
  };

  
  // Fetch data
  const { data, isLoading, error } = useGetConventionPropertiesQuery({
    filterPayload,
    pageno,
  });

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

  const handleRangeChange = (key, value) => {
    setPendingFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

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
