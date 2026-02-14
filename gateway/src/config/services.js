// Service configuration for docker networking
const services = {
  auth: {
    target: process.env.AUTH_SERVICE_URL || 'http://auth-service:3001',
    prefix: '/api/v1/auth',
  },
  users: {
    target: process.env.USERS_SERVICE_URL || 'http://users-service:3002',
    prefix: '/api/v1/users',
  },
  products: {
    target: process.env.PRODUCTS_SERVICE_URL || 'http://products-service:3003',
    prefix: '/api/v1/products',
  },
  orders: {
    target: process.env.ORDERS_SERVICE_URL || 'http://orders-service:3004',
    prefix: '/api/v1/orders',
  },
  portfolio: {
    target: process.env.PORTFOLIO_SERVICE_URL || 'http://portfolio-backend:8002',
    prefix: '/api/v1/portfolio',
  },
};

module.exports = { services };
