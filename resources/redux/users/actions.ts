import { GenesisUser, SubscriptionResponse } from '@/core/module/core.types';

export const setUser = (user: GenesisUser) => ({
  type: "SET_USER",
  payload: user,
});

export const setSubscription = (subscription: SubscriptionResponse) => ({
  type: "SET_SUBSCRIPTION",
  payload: subscription,
});

export const clearUser = () => ({
  type: "CLEAR_USER",
});