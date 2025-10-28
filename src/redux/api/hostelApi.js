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

export const hostelApi = createApi({
  reducerPath: "hostelApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("authToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // 1. Get Hostel List
    getHostelList: builder.query({
      query: ({ filterPayload, pageno }) => {
        const formData = filtersToFormData(filterPayload);
        return {
          url: `hostels/list?page=${pageno}`,
          method: "POST",
          body: formData,
        };
      },
      providesTags: ["hostel"],
    }),

    // 2. Get Hostel Details
    getHostelDetails: builder.query({
      query: (id) => `hostels/${id}`,
    }),

    // 3. Upload Hostel
    addHostel: builder.mutation({
      query: (formdata) => ({
        url: `hostels`,
        method: "POST",
        body: formdata,
      }),
      invalidatesTags: ["hostel"],
    }),

    //4. Get My Hostel Mangement
    getMyHostelList: builder.query({
      query: () => "my-list/hostels",
      providesTags: ["hostel"],
    }),
    // 5. Edit My Hostel Capacity
    editMyHostelCapacity: builder.mutation({
      query: ({ body, id }) => ({
        url: `hostel-update/${id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["hostel"],
    }),
  }),
});

export const {
  useGetHostelListQuery,
  useGetHostelDetailsQuery,
  useAddHostelMutation,
  useEditMyHostelCapacityMutation,
  useGetMyHostelListQuery,
} = hostelApi;
