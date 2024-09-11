import Service from "@/core/module/service.factory";
import { RootState } from "@/core/store";
import moment from "moment";
import { ReactNode } from "react"
import { useSelector } from "react-redux";

export const SubscriptionGuard = ({ children }: { children: ReactNode | ReactNode[] }) => {
    const { subscription } = useSelector(
        (state: RootState) => state.user,
    );

    // NO subscription Module enabled
    if (!Service.get('subscriptions')) {
        return children
    }
    // The core will redirect to the payment screen
    // Here we just avoid content to be rendered
    if (!subscription) {
        return null
    }
    if (moment().isAfter(moment(subscription.current_period_end))) {
        return null
    }

    return children
}