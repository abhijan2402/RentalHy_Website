import { configureStore } from "@reduxjs/toolkit";
import { ticketListApi } from "../api/ticketListApi";
import { authApi } from "../api/authApi";
import { profileApi } from "../api/profileApi";
import { propertyApi } from "../api/propertyApi";
import { conventionApi } from "../api/conventionApi";
import { hostelApi } from "../api/hostelApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [propertyApi.reducerPath]: propertyApi.reducer,
    [ticketListApi.reducerPath]: ticketListApi.reducer,
    [conventionApi.reducerPath]: conventionApi.reducer,
    [hostelApi.reducerPath]: hostelApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(ticketListApi.middleware)
      .concat(authApi.middleware)
      .concat(profileApi.middleware)
      .concat(propertyApi.middleware)
      .concat(conventionApi.middleware)
      .concat(hostelApi.middleware),
});
