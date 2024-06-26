const RouteService = require('../services/routeService');

const getRoutes = async (req, res) => {
  const { origin, distance } = req.body;
  const userId = req.user.id;
  try {
    const result = await RouteService.getRoutes(origin, distance, userId);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getLastRoutes = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await RouteService.getLastRoutes(userId);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getUserRoutes = async (req, res) => {
  const userId = req.user.id;
  try {
    const routes = await RouteService.getUserRoutes(userId);
    res.json(routes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getPlaceSuggestions = async (req, res) => {
  const input = req.query.input;
  try {
    const suggestions = await RouteService.getPlaceSuggestions(input);
    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching suggestions' });
  }
};

module.exports = { getRoutes, getUserRoutes, getLastRoutes, getPlaceSuggestions };
