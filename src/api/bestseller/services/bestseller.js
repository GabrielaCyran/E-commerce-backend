'use strict';

/**
 * bestseller service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::bestseller.bestseller');
