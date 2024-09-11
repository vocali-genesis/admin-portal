export const truncateLabel = (label: string, maxLength: number | undefined) => {
  if (!maxLength) {
    return label;
  }
  if (!label) {
    return "";
  }
  if (label.length <= maxLength) {
    return label;
  }
  return `${label.substring(0, maxLength)}...`;
};
