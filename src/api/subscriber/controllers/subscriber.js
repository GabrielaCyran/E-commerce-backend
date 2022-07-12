'use strict';

const nodemailer = require('nodemailer')
require("dotenv").config()

/**
 *  subscriber controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::subscriber.subscriber', ({ strapi }) => ({
    async create(ctx) {
        const { Email } = ctx.request.body
        const existingSub = await strapi.service('api::subscriber.subscriber').find({filters: {
            Email: Email
        }})

        if (!existingSub.results[0]) {
            await strapi.service('api::subscriber.subscriber').create({data: {
                Email: Email
            }})
            try {
                let transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS,
                    }
                })
                const mailOptions = {
                    from: 'Sklep internetowy G&D',
                    to: `${Email}`,
                    subject: 'Sklep internetowy G&D - Witamy',
                    html: `<h3>Hej @${Email}. Dziękujemy za subskrypcję naszego Newslettera!</h3>
                    <p>Kod zniżkowy 15% na pierwsze zamówienie - <b>5BY6RL7C</b> (minimalna kwota zamówienia: 200zł)</p>
                    `,
                };
                await transporter.sendMail(mailOptions)
            } catch (error) {
                console.log(error)
            }
        }
        return Email
    }
}));
