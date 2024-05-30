const Route = require('../models/Route');

const findRoutes = async (query) => {
  try {
    return await Route.find(query)      
    .sort({ updatedAt: -1 });
  } catch (error) {
    throw new Error('Server error');
  }
};

const findOldRoutes = async (query) => {
  try {
    return await Route.find(query)      
    .sort('-updatedAt');
  } catch (error) {
    throw new Error('Server error');
  }
};

const saveRoute = async (routeData) => {
  try {
    const newRoute = new Route(routeData);
    return await newRoute.save();
  } catch (error) {
    throw new Error('Server error');
  }
};

module.exports = { findRoutes, saveRoute,findOldRoutes};
