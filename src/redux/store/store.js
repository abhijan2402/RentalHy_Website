import { configureStore } from "@reduxjs/toolkit";
import { ticketListApi } from "../api/ticketListApi";
import { authApi } from "../api/authApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [ticketListApi.reducerPath]: ticketListApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(ticketListApi.middleware)
      .concat(authApi.middleware),
});
