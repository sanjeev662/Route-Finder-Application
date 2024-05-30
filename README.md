---
# Route Directions Application

## Introduction

This application provides walking directions based on user input for the origin and distance. It leverages the Google Maps API to fetch directions and places data, and ensures that users are authenticated before accessing the route details.

## Features

- Autocomplete for origin input using Google Places API
- Fetching walking directions using Google Maps Directions API
- Storing and retrieving route data from a MongoDB database
- User authentication and token validation

## Technologies Used

### Frontend

- **React**: Library for building the user interface.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Axios**: HTTP client for making API requests.

### Backend

- **Express**: Web framework for Node.js.
- **Mongoose**: ODM for MongoDB.
- **JSON Web Token (JWT)**: For handling authentication.
- **Axios**: HTTP client for making API requests to Google Maps API.

### Google Maps API

- **Places API**: For autocomplete suggestions and nearby places.
- **Geocoding API**: To get coordinates from place IDs.
- **Directions API**: To get walking directions.

## Application Flow

1. **User Authentication**:
   - Users must be authenticated to access the route functionality.
   - The authentication process generates a JWT token stored in the client's local storage.

2. **Origin Input and Autocomplete**:
   - Users enter an origin address in the input field.
   - The application fetches autocomplete suggestions from the Google Places API based on the user input.

3. **Form Submission**:
   - Users submit the form with the selected origin and desired walking distance.
   - The form data is sent to the backend for processing.

4. **Backend Processing**:
   - The backend verifies the user's JWT token.
   - It uses the Google Maps Geocoding API to convert the place ID to coordinates.
   - It fetches nearby places for each direction using the Google Places API.
   - It checks if any routes already exist in the database.
   - If a new route is needed, it uses the Google Maps Directions API to fetch walking directions.
   - It stores the new route in the MongoDB database.

5. **Displaying Directions**:
   - The frontend receives the route data and displays step-by-step walking directions.
---
