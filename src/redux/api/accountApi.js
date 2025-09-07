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

    // Save / Update Account
    saveAccount: builder.mutation({
      query: (formdata) => ({
        url: "account/store",
        method: "POST",
        body: formdata,
      }),
      invalidatesTags: ["account"],
    }),
  }),
});

export const { useGetAccountListQuery, useSaveAccountMutation } = accountApi;
