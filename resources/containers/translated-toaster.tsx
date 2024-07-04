import React from "react";
import { Toaster as HotToaster, ToastPosition } from "react-hot-toast";
import { useTranslations } from "next-intl";

interface ToasterProps {
  position?: ToastPosition;
}

const Toaster: React.FC<ToasterProps> = ({ position = "top-right" }) => {
  const t = useTranslations("Toaster");

  return (
    <HotToaster
      position={position}
      toastOptions={{
        message: (message) => t(message as string),
      }}
    />
  );
};

export default Toaster;
