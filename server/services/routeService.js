const axios = require('axios');
const { calculateDistance } = require('../utils/mapUtils');
const RouteDao = require('../dao/routeDao');


const getRoutes = async (origin, distance, userId) => {
  const origin_address = origin.description;
  const origin_place_id = origin.place_id;
  const updatedDistance = Math.ceil(distance / 2);

  try {
    // Fetch geocoding data for lat,lng of origin
    const geocodingResponse = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        place_id: origin_place_id,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    if (!geocodingResponse.data.results[0]) {
      throw new Error('Origin not found');
    }

    const { lat, lng } = geocodingResponse.data.results[0].geometry.location;

    // Calculate all possible directions
    const directions = [
      { name: 'North', lat: lat + 0.01, lng: lng },
      { name: 'Northeast', lat: lat + 0.007, lng: lng + 0.007 },
      { name: 'East', lat: lat, lng: lng + 0.01 },
      { name: 'Southeast', lat: lat - 0.007, lng: lng + 0.007 },
      { name: 'South', lat: lat - 0.01, lng: lng },
      { name: 'Southwest', lat: lat - 0.007, lng: lng - 0.007 },
      { name: 'West', lat: lat, lng: lng - 0.01 },
      { name: 'Northwest', lat: lat + 0.007, lng: lng - 0.007 },
    ];

    // Fetch places for each direction within radius
    const placesPromises = directions.map(direction =>
      axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
        params: {
          location: `${direction.lat},${direction.lng}`,
          radius: updatedDistance * 1000,
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      }).then(response => response.data.results)
    );

    const allPlaces = await Promise.all(placesPromises);

    // filter place ids which nearby given distance with some variation
    const places = allPlaces.flat().filter(place => {
      const placeLat = place.geometry.location.lat;
      const placeLng = place.geometry.location.lng;
      const placeDistance = calculateDistance(lat, lng, placeLat, placeLng);
      return Math.abs(placeDistance - updatedDistance * 1000) <= updatedDistance * 1000 * 0.5;
    }).map(place => place.place_id);

    if (places.length === 0) {
      throw new Error('No places found');
    }

    let destination = "";
    let isNewRouteAvailable = false;

    // Check if the routes already exist in the database (if origin_place_id, route_last_place_id both already exist in db then route already explored)
    for (const place_id of places) {
      const existingRoutes = await RouteDao.findRoutes({ user: userId, origin_place_id, route_last_place_id: place_id });
      if (!existingRoutes.length) {
        destination = place_id;
        isNewRouteAvailable = true;
        break;
      }
    }

    if (isNewRouteAvailable) {
      // Fetch routes from Google Maps Directions API using place ids
      const forwardDirectionResponse = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
        params: {
          origin: `place_id:${origin_place_id}`,
          destination: `place_id:${destination}`,
          mode: 'walking',
          alternatives: true,
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      });

      const returnDirectionResponse = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
        params: {
          origin: `place_id:${destination}`,
          destination: `place_id:${origin_place_id}`,
          mode: 'walking',
          alternatives: true,
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      });

      const forwardRoutes = forwardDirectionResponse.data.routes;
      const returnRoutes = returnDirectionResponse.data.routes;

      // Extract the instruction details
      const extractInstructions = (routes) => {
        return routes[0].legs[0].steps.map(step => step.html_instructions);
      };

      const extractPolylines = (routes) => {
        return routes.map(route => route.overview_polyline.points);
      };

      const forwardRouteInstructions = extractInstructions(forwardRoutes);
      const returnRouteInstructions = extractInstructions(returnRoutes);
      
      const forwardRoutePolylines = extractPolylines(forwardRoutes);
      const returnRoutePolylines = extractPolylines(returnRoutes);

      const newRouteInstruction = [...forwardRouteInstructions, ...returnRouteInstructions];
      const newRoutePolylines = [...forwardRoutePolylines, ...returnRoutePolylines];
      
      let newRoute = null;

      if (newRouteInstruction.length) {
        newRoute = await RouteDao.saveRoute({
          user: userId,
          origin_address,
          origin_place_id,
          distance,
          route_last_place_id: destination,
          route_data: newRouteInstruction,
          polylines: newRoutePolylines,
        });
      }
      return { route: newRoute, message: 'New route found and saved' };
    } else {
      const existingRoutes = await RouteDao.findOldRoutes({ user: userId, origin_place_id, distance });

      if (existingRoutes.length) {
        const oldestUpdatedRoute = existingRoutes[0];
        oldestUpdatedRoute.updatedAt = new Date();
        await oldestUpdatedRoute.save();

        return { route: oldestUpdatedRoute, message: 'No new route available' };
      } else {
        throw new Error('No existing routes found');
      }
    }
  } catch (error) {
    throw error;
  }
};


const getLastRoutes = async (userId) => {
  try {
    const lastRoute = await RouteDao.findRoutes({ user: userId })
    if (!lastRoute || lastRoute.length < 2) {
      throw new Error('No routes found');
    }
    return { route: lastRoute[1] };
  } catch (error) {
    throw error;
  }
};

const getUserRoutes = async (userId) => {
  try {
    const routes = await RouteDao.findRoutes({ user: userId });
    return routes;
  } catch (error) {
    throw error;
  }
};

const getPlaceSuggestions = async (input) => {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
      params: {
        input,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });
    return response.data.predictions;
  } catch (error) {
    throw new Error('Error fetching suggestions');
  }
};

module.exports = { getRoutes, getUserRoutes, getLastRoutes, getPlaceSuggestions};
