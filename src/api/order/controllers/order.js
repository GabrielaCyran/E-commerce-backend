'use strict';

require("dotenv").config()
/**
 *  order controller
 */

const stripe = require('stripe')(process.env.STRIPE_KEY)

const MY_DOMAIN = process.env.APP_URL + '/cart';
const { createCoreController } = require('@strapi/strapi').factories;
module.exports = createCoreController('api::order.order', ({ strapi }) => ({
    async create(ctx) {
        const { cartDetail, cartTotal } = ctx.request.body.data
        // Build line items array
        const line_items = cartDetail.map((cartItem) => {
            cartItem.price = cartItem.discountPrice ? cartItem.discountPrice : cartItem.price;
            const item = {}
            item.price_data = {
                currency: 'pln',
                product_data: {
                    name: cartItem.name,
                    images: [`${cartItem.url}`]
                },
                unit_amount: (cartItem.price * 100).toFixed(0),
            },
            item.quantity = cartItem.quantity
            return item;
        })
        // Create order
        await strapi.service('api::order.order').create({ data: {
            Item: line_items,
        }});
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card', 'p24'],
            shipping_address_collection: {
                allowed_countries: ['PL'],
            },
            shipping_options: [
                {
                  shipping_rate_data: {
                    type: 'fixed_amount',
                    fixed_amount: {
                      amount: 0,
                      currency: 'pln',
                    },
                    display_name: 'Kurier DPD',
                    delivery_estimate: {
                      minimum: {
                        unit: 'business_day',
                        value: 1,
                      },
                      maximum: {
                        unit: 'business_day',
                        value: 2,
                      },
                    }
                  }
                },
              ],
            allow_promotion_codes: true,
            line_items,
            mode: 'payment',
            success_url: `${MY_DOMAIN}?success=true`,
            cancel_url: `${MY_DOMAIN}?canceled=true`,
        })
        return { id: session.id }
    }
}));
