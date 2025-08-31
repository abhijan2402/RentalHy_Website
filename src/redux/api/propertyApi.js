import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

function filtersToFormData(filters) {
  console.log(filters);
  const formData = new FormData();
  for (const key in filters) {
    if (!filters.hasOwnProperty(key)) continue;
    const value = filters[key];
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        formData.append(`${key}[${index}]`, item);
      });
    } else if (value !== undefined && value !== null && value !== "") {
      formData.append(key, value);
    }
  }
  return formData;
}

export const propertyApi = createApi({
  reducerPath: "propertyApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://hotpink-rook-901841.hostingersite.com/public/api/",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("authToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // 1. Get properties (listing)
    getProperties: builder.query({
      query: ({ filterPayload, pageno }) => {
        const formData = filtersToFormData(filterPayload);
        console.group(pageno, filterPayload);
        for (let pair of formData.entries()) {
          console.log(pair[0] + ": " + pair[1]);
        }

        return {
          url: `properties?page=${pageno}`,
          method: "POST",
          body: formData,
        };
      },
      providesTags: ["property"],
    }),

    // 2. Property details
    getPropertyDetails: builder.query({
      query: (id) => `properties/${id}`,
    }),

    // 3. Store property view
    addPropertyView: builder.mutation({
      query: (propertyId) => {
        const formData = new FormData();
        formData.append("property_id", propertyId);

        return {
          url: "property-views/store",
          method: "POST",
          body: formData,
        };
      },
    }),

    // 4. Add to wishlist
    addToWishlist: builder.mutation({
      query: (id) => {
        const formData = new FormData();
        formData.append("property_id", id);
        return {
          url: "wishlist/add",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["property", "wishlistStats"],
    }),

    // 5. Add to wishlist
    removeToWishlist: builder.mutation({
      query: (id) => {
        // const formData = new FormData();
        // formData.append("property_id", id);
        return {
          url: `wishlist/remove/${id}`,
          method: "POST",
          body: {},
        };
      },
      invalidatesTags: ["property", "wishlistStats"],
    }),

    // 6. Wishlist stats
    getWishlistStats: builder.query({
      query: () => "wishlist/stats",
      providesTags: ["wishlistStats"],
    }),

    // 7. My properties (owned by user)
    getMyProperties: builder.query({
      query: () => "my-property",
    }),

    // 8.  Upload Property
    addProperty: builder.mutation({
      query: (formdata) => ({
        url: `properties/add`,
        method: "POST",
        body: formdata,
      }),
      invalidatesTags: ["property"],
    }),
  }),
});

export const {
  useGetPropertiesQuery,
  useGetPropertyDetailsQuery,
  useAddPropertyViewMutation,
  useAddToWishlistMutation,
  useRemoveToWishlistMutation,
  useGetWishlistStatsQuery,
  useGetMyPropertiesQuery,
  useAddPropertyMutation,
} = propertyApi;
