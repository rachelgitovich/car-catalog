# Car Rental Application

Welcome to the Car Rental Application! This application allows you to manage and search for car rental listings.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Usage](#usage)
- [Testing](#testing)
- [Endpoints](#endpoints)

## Prerequisites

Before you can run this application, ensure that you have the following prerequisites installed on your system:

- Node.js (https://nodejs.org/)
- npm (Node Package Manager)

## Usage

Before running the application make sure to run:

```
npm install
```

To start the Car Rental Application, follow these steps:

1. Start the application:

```
npm start
```

2. The application will be running at `http://localhost:3000`.

## Testing

To run the tests for the Car Rental Application, use the following command:

```
npm test
```

## Endpoints

The following endpoints are available in the Car Rental Application:

- `GET /api/cars`: Get a list of all car rental listings.
- `POST /api/cars`: Add a new car rental listing.
- `DELETE /api/cars/:id`: Delete a car rental listing by ID.
- `PUT /api/cars/:id`: Update a car rental listing by ID.
- `GET /api/cars/search`: Search for car rental listings based on query parameters.
