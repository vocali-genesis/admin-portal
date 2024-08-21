import { useRouter } from "next/router";
import { useEffect } from "react";
import Service from "../module/service.factory";
import moment from "moment";

type InternalProps = {
  onReady: () => void;
};
/**
 * Some Core general checks need to be done within the core,
 * as restrictions apply to the overall use of the platform
 */
export const ValidateUser = ({ onReady }: InternalProps) => {
  const router = useRouter();
  const { slug } = router.query as { slug: string };
  useEffect(() => {
    // console.log('============= here ============', slug)
    async function checkLogin(): Promise<boolean> {
      const userService = Service.require("oauth");

      const user = await userService.getLoggedUser();
      if (!user) {
        router.push("/auth/login");
        return false;
      }
      return true;
    }

    /**
     * TODO: Refactor, make a way components can define their required permissions
     */
    async function checkSubscription(): Promise<boolean> {
      const subscriptionService = Service.get("subscriptions");
      // This module is optional
      if (!subscriptionService) {
        return true;
      }
      const subscription = await subscriptionService.getActiveSubscription();
      const notValid = subscription?.current_period_end ? moment(subscription?.current_period_end).isBefore() : true
      if (subscription?.status !== "active" && notValid) {
        // Avoid infinite loop
        if (slug === "subscriptions") {
          return true;
        }
        router.push("/app/subscriptions");
        return false;
      }
      return true;
    }

    checkLogin()
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
  }, [onReady, router, router.asPath, slug]);

  return null;
};
