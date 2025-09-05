import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ticketListApi = createApi({
  reducerPath: "ticketListApi",
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
  tagTypes: ["ticketList"],
  endpoints: (builder) => ({
    getTicketList: builder.query({
      query: () => "support/issues",
      providesTags: ["ticketList"],
    }),
    replyToTicket: builder.mutation({
      query: ({ formdata }) => ({
        url: `support/issues`,
        method: "POST",
        body: formdata,
      }),
      invalidatesTags: ["ticketList"],
    }),
  }),
});

export const { useGetTicketListQuery, useReplyToTicketMutation } =
  ticketListApi;
