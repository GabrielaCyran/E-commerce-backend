function calculatePrice(product, discount) {
  if (discount) {
    let percent = discount.Discount_percent / 100;
    let newPrice = product.Price - (product.Price * percent)
    return product.New_price = newPrice;
  } else {
    return product.New_price = null;
  }
}

module.exports = {
    async beforeCreate(event) {
      const { data, where, select, populate } = event.params;

      const discount = await strapi.entityService.findOne('api::discount.discount', data.discount || null);
      
      calculatePrice(data, discount);
    },
    async beforeUpdate(event) {
      const { data, where, select, populate } = event.params;
      
      const discount = await strapi.entityService.findOne('api::discount.discount', data.discount || null);
      
      calculatePrice(data, discount);
    },
  };
