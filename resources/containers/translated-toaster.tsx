import React from "react";
import { Toaster, ToastOptions, resolveValue } from "react-hot-toast";
import { useTranslations } from "next-intl";

export function TranslatedToaster(props: ToastOptions) {
  const t = useTranslations("common");
  return (
    <Toaster
      {...props}
      toastOptions={{
        ...props.toastOptions,
        render: ({ message, ...rest }) => {
          console.log(resolveValue(message, rest));
          const translatedMessage = t(resolveValue(message, rest), {
            defaultMessage: resolveValue(message, rest),
          });
          return typeof props.toastOptions?.render === "function"
            ? props.toastOptions.render({ ...rest, message: translatedMessage })
            : translatedMessage;
        },
      }}
    />
  );
}