import { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import Service from "@/core/module/service.factory";
import moment from "moment";
import {
  setUser,
  setSubscription,
  clearUser,
} from "@/resources/redux/users/actions";
import { GenesisSubscription } from "@/core/module/core.types";

export const userValidation = (onReady: () => void) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { slug } = router.query as { slug: string };

  useEffect(() => {
    async function checkLogin(): Promise<boolean> {
      const userService = Service.require("oauth");
      const user = await userService.getLoggedUser();
      if (!user) {
        dispatch(clearUser());
        void router.push("/auth/login");
        return false;
      }

      dispatch(setUser(user));
      return true;
    }

    async function checkSubscription(): Promise<boolean> {
      const subscriptionService = Service.require("subscriptions");

      const subscription = await subscriptionService.getActiveSubscription();
      dispatch(setSubscription(subscription as GenesisSubscription));
      const notValid = subscription?.current_period_end
        ? moment(subscription.current_period_end).isBefore()
        : true;

      console.log(notValid);
      if (subscription?.status !== "active" && notValid) {
        if (slug === "subscriptions") return true;
        void router.replace("/app/subscriptions");
        return false;
      }
      return true;
    }

    void checkLogin()
      .then((result) => {
        if (!result) {
          return Promise.resolve(false);
        }
        return checkSubscription();
      })
      .then((result) => {
        if (!result) {
          return Promise.resolve(false);
        }
        onReady();
      });
  }, [onReady, router, dispatch, slug]);
};
