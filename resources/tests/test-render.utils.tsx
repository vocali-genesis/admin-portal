import store from "@/core/store";
import { render } from "@testing-library/react";
import { ReactNode } from "react";
import { Provider } from "react-redux";

export const renderWithStore = (children: ReactNode) => {
    return render(
        <Provider store={store}>
            {children}
        </Provider>
    );
};