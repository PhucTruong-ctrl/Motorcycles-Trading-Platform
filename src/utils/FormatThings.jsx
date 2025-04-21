import { format } from "date-fns";

export const formatDate = (dateString) => {
  return format(new Date(dateString), "HH:mm MM-dd-yyyy");
};

export const formatNumber = (priceNumber) => {
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
  }).format(priceNumber);
};
