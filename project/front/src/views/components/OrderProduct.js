export const OrderProduct = (orders) => {
  if (orders.orderList.length > 1) {
    return orders.orderList.map(
      (orderList, index) =>
        `[${orders.orderList[index].productName}] ${orders.orderList[index].count}개  `
    );
  } else {
    return `[${orders.orderList[0].productName}] ${orders.orderList[0].count}개`;
  }
};
