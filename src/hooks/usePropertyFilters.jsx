import { useEffect, useState } from "react";
import { useGetPropertiesQuery } from "../redux/api/propertyApi";

export function usePropertyFilters() {
  // _____________Manage States______________________
  const [filters, setFilters] = useState({
    bhk: [],
    propertyType: [],
    roomSize: { min: "", max: "" },
    priceRange: [], // empty by default
    furnishing: [], // 👈 keep same name for consistency
    availability: [],
    bathrooms: [],
    parking: [],
    facing: [],
    advance: [],
    tenant: [],
    parking: [],
  });
  const [search, setSearch] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sort, setSort] = useState("");
  const [perpage, setPerPage] = useState("");
  const [pageno, setPageNo] = useState(1);
  console.log(pageno);
  // _____________Manage States Ends Here______________________

  // *******************Manage APIs**********************

  // Helper to serialize arrays as indexed keys for backend

  // Prepare filters for API call
  const filterPayload = {
    search: searchKeyword || search || "",
    location: "",
    bhk: filters.bhk,
    parking: filters.parking,
    furnishing_status: filters.furnishing, // 👈 fixed mismatch
    availability: filters.availability,
    bathrooms: filters.bathrooms,
    min_price: filters.priceRange?.[0] || "",
    max_price: filters.priceRange?.[1] || "",
    min_area: filters.roomSize?.min || "",
    max_area: filters.roomSize?.max || "",
    sort_by: sort || "",
    per_page: perpage || "",
  };

  // Fetch data
  const { data, isLoading, error } = useGetPropertiesQuery({
    filterPayload,
    pageno,
  });

  // Property Listing Data
  const [propertyData, setPropertyData] = useState([]);

  useEffect(() => {
    if (data?.data?.data) {
      setPropertyData(data.data.data);
    } else {
      setPropertyData([]);
    }
  }, [data?.data?.data, pageno, perpage]);

  // useEffect(() => {
  //   refetch();
  // }, [refetch, filters]);

  // *******************Manage APIs Ends Here**********************

  //---------------------- Filter Methods Starts From Here ----------------------

  const handleItemsPerPage = (item) => {
    setPerPage(item);
  };

  const handleCheckboxChange = (key, value) => {
    setFilters((prev) => {
      const arr = prev[key];
      const updated = arr.includes(value)
        ? arr.filter((v) => v !== value)
        : [...arr, value];
      const newFilters = { ...prev, [key]: updated };
      console.log(newFilters);
      return newFilters;
    });
  };

  const handleInputChange = (key, field, value) => {
    setFilters((prev) => {
      const updated = { ...prev[key], [field]: value };
      const newFilters = { ...prev, [key]: updated };
      console.log(newFilters);
      return newFilters;
    });
  };

  const handlePriceChange = (range) => {
    setFilters((prev) => {
      const newFilters = { ...prev, priceRange: range };
      console.log(newFilters);
      return newFilters;
    });
  };

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleFilterValue = (key, value) => {
    setFilters((prev) => {
      const arr = prev[key] || [];
      const updated = arr.includes(value)
        ? arr.filter((v) => v !== value)
        : [...arr, value];
      return { ...prev, [key]: updated };
    });
  };

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

  const resetCategory = (tab) => {
    setFilters((prev) => {
      const reset = { ...prev };
      switch (tab) {
        case "BHK":
          reset.bhk = [];
          break;
        case "Property Type":
          reset.propertyType = [];
          break;
        case "Room Size":
          reset.roomSize = { min: "", max: "" };
          break;
        case "Price":
          reset.priceRange = [5000, 50000];
          break;
        case "Furnishing":
          reset.furnishing = [];
          break;
        case "Availability":
          reset.availability = [];
          break;
        case "Bathrooms":
          reset.bathrooms = [];
          break;
        case "Parking":
          reset.parking = [];
          break;
        case "Facing":
          reset.facing = [];
          break;
        case "Advance":
          reset.advance = [];
          break;
        case "Tenant Type":
          reset.tenant = [];
          break;
        default:
          break;
      }
      console.log("Reset:", reset);
      return reset;
    });
  };

  //---------------------- Filter Methods Starts From Here ----------------------

  return {
    filters,
    setFilters,
    updateFilter,
    toggleFilterValue,
    resetCategory,
    handlePriceChange,
    handleInputChange,
    handleCheckboxChange,
    data,
    propertyData,
    isLoading,
    error,
    search,
    searchKeyword,
    sort,
    handleSearchInputChange,
    handleSearchButton,
    handleSortChange,
    handleItemsPerPage,
    perpage,
    setPageNo,
  };
}
