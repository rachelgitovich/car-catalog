const {
  getDatesBetween,
  allDatesAvailable,
  isValidCar,
} = require('../utils/utils');
const Car = require('../models/Car');
const cache = require('../services/cache');
const catalog = require('../db/catalog');

/**
 * Retrieves a list of all available cars from the car rental catalog.
 * Endpoint: GET /api/cars
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {function} next - The next middleware function.
 */
const getCars = (req, res, next) => {
  try {
    // Generate a cache key based on the request URL.
    const cacheKey = req.url;

    // Retrieve the list of cars from the catalog.
    const cars = catalog;

    // Cache the response data for 10 minutes (600,000 milliseconds).
    cache[cacheKey] = {
      data: cars,
      expires: Date.now() + 600000,
    };
    // Send a JSON response with the list of cars.
    res.status(200).json(cars);
  } catch (err) {
    // Forward any errors to the next middleware for error handling.
    next(err);
  }
};

/**
 * Adds a new car rental listing to the catalog.
 * Endpoint: POST /api/cars
 *
 * @param {Object} req - The HTTP request object containing the car data to be created.
 * @param {Object} res - The HTTP response object.
 * @param {function} next - The next middleware function.
 */
const addCar = (req, res, next) => {
  try {
    // Extract car data from the HTTP request body.
    const newCarData = req.body;

    // Validate the input car data.
    if (!isValidCar(newCarData)) {
      return res.status(400).json({ message: 'Invalid car data' });
    }

    // Create a new car object using the provided data.
    const newCar = new Car(newCarData);

    // Clear the cache for the /api/cars endpoint.
    cache['/api/cars'] = null;

    // Add the new car to the catalog.
    catalog.push(newCar);

    // Send a JSON response indicating success and the created car.
    res.status(201).json({ message: 'Car added to the catalog', car: newCar });
  } catch (err) {
    // Forward any errors to the next middleware for error handling.
    next(err);
  }
};

/**
 * Deletes a car rental listing from the catalog based on the provided car ID.
 * Endpoint: DELETE /api/cars/:id
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {function} next - The next middleware function.
 */
const deleteCar = (req, res, next) => {
  try {
    // Extract the car ID from the URL parameter.
    const carID = req.params.id;

    // Find the index of the car with the specified ID in the catalog.
    const carIndex = catalog.findIndex((car) => car.id === carID);

    if (carIndex !== -1) {
      // Remove the car from the catalog.
      catalog.splice(carIndex, 1);

      // Clear the cache for the /api/cars endpoint.
      cache['/api/cars'] = null;

      // Send a JSON response indicating success.
      res.json({ message: 'Car removed from the catalog' });
    } else {
      // If the car is not found, return a 404 Not Found response.
      res.status(404).json({ message: 'Car not found' });
    }
  } catch (err) {
    // Forward any errors to the next middleware for error handling.
    next(err);
  }
};

/**
 * Updates an existing car rental listing based on the provided car ID. Performs a version check to prevent concurrent updates.
 * Endpoint: PUT /api/cars/:id
 *
 * @param {Object} req - The HTTP request object containing the updated car data and URL parameters.
 * @param {Object} res - The HTTP response object.
 * @param {function} next - The next middleware function.
 */
const updateCar = (req, res, next) => {
  try {
    // Extract the car ID from the URL parameter.
    const carID = req.params.id;

    // Extract the updated car data from the request body.
    const updatedCarData = req.body;

    // Validate the input car data.
    if (!isValidCar(updatedCarData)) {
      return res.status(400).json({ message: 'Invalid car data' });
    }

    // Find the index of the car with the specified ID in the catalog.
    const carIndex = catalog.findIndex((car) => car.id === carID);

    if (carIndex !== -1) {
      // Get the existing car.
      const existingCar = catalog[carIndex];

      // Perform a version check to prevent concurrent updates.
      if (updatedCarData.version !== existingCar.version) {
        return res.status(409).json({ message: 'Concurrent update conflict' });
      }

      // Create an updated car object.
      const updatedCar = new Car({
        ...existingCar,
        ...updatedCarData,
        version: (existingCar.version ?? 0) + 1,
      });

      // Update the car in the catalog.
      catalog[carIndex] = updatedCar;

      // Clear the cache for the /api/cars endpoint.
      cache['/api/cars'] = null;

      // Send a JSON response indicating success and the updated car.
      res.json({ message: 'Car listing updated', car: catalog[carIndex] });
    } else {
      // If the car is not found, return a 404 Not Found response.
      res.status(404).json({ message: 'Car not found' });
    }
  } catch (err) {
    // Forward any errors to the next middleware for error handling.
    next(err);
  }
};

/**
 * Searches for car rental listings based on query parameters such as start date, end date, location, age group, and car group.
 * Endpoint: GET /api/cars/search
 *
 * @param {Object} req - The HTTP request object containing query parameters.
 * @param {Object} res - The HTTP response object.
 * @param {function} next - The next middleware function.
 */
const searchCar = (req, res, next) => {
  try {
    // Extract query parameters from the request.
    const { startDate, endDate, location, ageGroup, carGroup, ...otherParams } =
      req.query;

    // Check if there are any unexpected query parameters
    if (Object.keys(otherParams).length > 0) {
      return res.status(400).json({ message: 'Invalid query parameters' });
    }

    // Perform the search based on the provided query parameters.
    const searchDates = getDatesBetween(new Date(startDate), new Date(endDate));
    const results = catalog.filter((car) => {
      const dateMatch =
        !startDate ||
        !endDate ||
        allDatesAvailable(car.availableDates, searchDates);
      const locationMatch =
        !location || car.availableLocations.includes(location);
      const ageGroupMatch = !ageGroup || car.minimumDriverAge <= ageGroup;
      const carGroupMatch = !carGroup || car.carGroup === carGroup;

      return dateMatch && locationMatch && ageGroupMatch && carGroupMatch;
    });

    // Send a JSON response with the search results.
    res.status(200).json({ results });
  } catch (err) {
    // Forward any errors to the next middleware for error handling.
    next(err);
  }
};

module.exports = { getCars, addCar, deleteCar, updateCar, searchCar };
