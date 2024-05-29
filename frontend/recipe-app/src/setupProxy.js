const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/auth',
    createProxyMiddleware({
      target: 'https://recipe-app-x7py.onrender.com',
      changeOrigin: true,
    })
  );
  app.use(
    '/recipes',
    createProxyMiddleware({
      target: 'https://recipe-app-x7py.onrender.com',
      changeOrigin: true,
    })
  );
};
