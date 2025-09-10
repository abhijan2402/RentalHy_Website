import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const feedbackApi = createApi({
  reducerPath: "feedbackApi",
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
  tagTypes: ["feedback"],
  endpoints: (builder) => ({
    getTicketList: builder.query({
      query: () => "support/issues",
      providesTags: ["feedbackkkk"],
    }),
    submitFeedback: builder.mutation({
      query: (formdata) => {
        // Debug: log FormData entries here
        for (let [key, value] of formdata.entries()) {
          console.log(key, value);
        }

        return {
          url: "hostels/submit-review",
          method: "POST",
          body: formdata,
        };
      },
      invalidatesTags: ["feedback"],
    }),
  }),
});

export const { useGetTicketListQuery, useSubmitFeedbackMutation } = feedbackApi;
