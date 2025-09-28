import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const cmsApi = createApi({
  reducerPath: "cmsApi",
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
  tagTypes: ["cms"],
  endpoints: (builder) => ({
    getcms: builder.query({
      query: () => "cms/terms-conditions",
      providesTags: ["cms"],
    }),
    getcmsPrivacy: builder.query({
      query: () => "cms/privacy-policy",
      providesTags: ["cms"],
    }),
  }),
});

export const { useGetcmsQuery, useGetcmsPrivacyQuery } = cmsApi;
