export const formatCurrency = (amount = 0) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount));
};

export const getSellingPrice = (product) => Number(product?.discountPrice || product?.price || 0);

export const getDiscountPercent = (product) => {
  if (!product?.price || !product?.discountPrice || product.discountPrice >= product.price) {
    return 0;
  }

  return Math.round(((product.price - product.discountPrice) / product.price) * 100);
};
