import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  size?: "small" | "medium" | "large";
  variant?: "success" | "danger" | "warning" | "info" | "default";
  corners?: "rounded" | "pill" | "sharp";
}

const Badge: React.FC<BadgeProps> = ({
  children,
  size = "medium",
  variant = "default",
  corners = "rounded",
}) => {
  let sizeClasses = "";
  let variantClasses = "";
  let cornerClasses = "";

  // Handle size classes
  switch (size) {
    case "small":
      sizeClasses = "px-2 py-1 text-xs";
      break;
    case "medium":
      sizeClasses = "px-3 py-1.5 text-sm";
      break;
    case "large":
      sizeClasses = "px-4 py-2 text-base";
      break;
  }

  // Handle variant classes
  switch (variant) {
    case "success":
      variantClasses = "bg-green-100 text-green-800";
      break;
    case "danger":
      variantClasses = "bg-red-100 text-red-800";
      break;
    case "warning":
      variantClasses = "bg-yellow-100 text-yellow-800";
      break;
    case "info":
      variantClasses = "bg-blue-100 text-blue-800";
      break;
    case "default":
      variantClasses = "bg-gray-100 text-gray-800";
      break;
  }

  // Handle corner classes
  switch (corners) {
    case "rounded":
      cornerClasses = "rounded-md";
      break;
    case "pill":
      cornerClasses = "rounded-full";
      break;
    case "sharp":
      cornerClasses = "rounded-none";
      break;
  }

  return (
    <span
      className={`inline-flex items-center font-semibold ${sizeClasses} ${variantClasses} ${cornerClasses}`}
    >
      {children}
    </span>
  );
};

export default Badge;
