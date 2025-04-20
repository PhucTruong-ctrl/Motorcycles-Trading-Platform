export const formatNumber = (priceNumber) => {
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
  }).format(priceNumber);
};

