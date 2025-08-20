import { configureStore } from "@reduxjs/toolkit";
import { ticketListApi } from "../api/ticketListApi";
import { authApi } from "../api/authApi";
import { profileApi } from "../api/profileApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [ticketListApi.reducerPath]: ticketListApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(ticketListApi.middleware)
      .concat(authApi.middleware)
      .concat(profileApi.middleware),
});
