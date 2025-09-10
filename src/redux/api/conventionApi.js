import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

function filtersToFormData(filters = {}) {
  const formData = new FormData();

  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        formData.append(`${key}[${index}]`, item);
      });
    } else {
      formData.append(key, value);
    }
  });

  return formData;
}

export const conventionApi = createApi({
  reducerPath: "conventionApi",
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
    // 1. Get Convention properties (listing)
    getConventionProperties: builder.query({
      query: ({ filterPayload, pageno }) => {
        const formData = filtersToFormData(filterPayload);
        // console.group(pageno, filterPayload);
        // for (let pair of formData.entries()) {
        //   console.log(pair[0] + ": " + pair[1]);
        // }

        return {
          url: `hall_listing?page=${pageno}`,
          method: "POST",
          body: formData,
        };
      },
      providesTags: ["conventionProperty"],
    }),

    // 2. Convention details
    getconventionDetails: builder.query({
      query: (id) => `/hall_deatils/${id}`,
    }),

    // 3. My Convention properties (owned by user)
    getMyConventionProperties: builder.query({
      query: () => "my-convention",
    }),

    // 4.  Upload Convention
    addConvention: builder.mutation({
      query: (formdata) => ({
        url: `hall_add/hall`,
        method: "POST",
        body: formdata,
      }),
      invalidatesTags: ["conventionProperty"],
    }),

    // 5. Get Convention properties (listing)
    getResortFarmProperties: builder.query({
      query: ({ filterPayload, pageno }) => {
        const formData = filtersToFormData(filterPayload);

        return {
          url: `farm_listing?page=${pageno}`,
          method: "POST",
          body: formData,
        };
      },
      providesTags: ["resortFarmProperty"],
    }),

    // 6.  Upload Resort/Farm
    addResortFarm: builder.mutation({
      query: (formdata) => ({
        url: `hall_add/farm`,
        method: "POST",
        body: formdata,
      }),
      invalidatesTags: ["conventionProperty"],
    }),
  }),
});

export const {
  useGetMyConventionPropertiesQuery,
  useGetconventionDetailsQuery,
  useGetConventionPropertiesQuery,
  useAddConventionMutation,
  useAddResortFarmMutation,
  useGetResortFarmPropertiesQuery,
} = conventionApi;
