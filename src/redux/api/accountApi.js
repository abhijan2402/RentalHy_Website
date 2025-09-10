import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const accountApi = createApi({
  reducerPath: "accountApi",
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
  tagTypes: ["account"],
  endpoints: (builder) => ({
    // Fetch Account List
    getAccountList: builder.query({
      query: () => "account/list",
      providesTags: ["account"],
    }),

    // Save
    saveAccount: builder.mutation({
      query: (formData) => ({
        url: "account/store",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["account"],
    }),

    //  Update Account
    updateAccount: builder.mutation({
      query: ({ id, formData }) => ({
        url: `account/update/${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["account"],
    }),
  }),
});

export const {
  useGetAccountListQuery,
  useSaveAccountMutation,
  useUpdateAccountMutation,
} = accountApi;
