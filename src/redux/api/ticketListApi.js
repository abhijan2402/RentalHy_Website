import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ticketListApi = createApi({
  reducerPath: "ticketListApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
  }),
  tagTypes: ["ticketList"],
  endpoints: (builder) => ({
    getTicketList: builder.query({
      query: () => "admin/tickets-list",
      providesTags: ["ticketList"],
    }),
    replyToTicket: builder.mutation({
      query: ({ id, message }) => ({
        url: `admin/tickets/${id}/reply`,
        method: "POST",
        body: { message },
      }),
      invalidatesTags: ["ticketList"],
    }),
  }),
});

export const { useGetTicketListQuery, useReplyToTicketMutation } =
  ticketListApi;
