import { useRouter } from "next/router";
import { useEffect } from "react";
import Service from "../module/service.factory";

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

      if (
        !subscription ||
        !subscription.status ||
        subscription.status !== "active"
      ) {
        // Avoid infinite loop
        if (slug === "subscriptions") return true;
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
  }, [onReady, router, slug]);

  return null;
};
