const cache = require('../services/cache');

const cacheMiddleware = (req, res, next) => {
  const cacheKey = req.url;
  const cachedData = cache[cacheKey];

  if (cachedData && (!cachedData.expires || cachedData.expires > Date.now())) {
    return res.status(200).json(cache[cacheKey].data);
  }

  next();
};

module.exports = cacheMiddleware;
