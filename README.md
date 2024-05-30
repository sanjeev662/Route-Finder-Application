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
   - It calculates potential destinations using hardcoded directional vectors.
   - It fetches nearby places for each direction using the Google Places API.
   - It checks if any routes already exist in the database.
   - If a new route is needed, it uses the Google Maps Directions API to fetch walking directions.
   - It stores the new route in the MongoDB database.

5. **Displaying Directions**:
   - The frontend receives the route data and displays step-by-step walking directions.

## Setup and Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/route-directions-app.git
   cd route-directions-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   cd client
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory with the following contents:
   ```env
   JWT_SECRET=your_jwt_secret
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

4. **Run the application**:
   - Start the backend server:
     ```bash
     npm start
     ```
   - Start the frontend development server:
     ```bash
     cd client
     npm start
     ```

## Usage

1. **Login**:
   - Navigate to the login page and authenticate with your credentials.

2. **Get Directions**:
   - Enter the origin address and distance in kilometers.
   - Select the appropriate suggestion from the autocomplete dropdown.
   - Submit the form to fetch and display the walking directions.

3. **View Route Details**:
   - The step-by-step directions will be displayed, showing the detailed walking route.

## Detailed Explanation of Key Components

### Google Maps API Integration

- **Places API**:
  - Used for fetching autocomplete suggestions as the user types in the origin input.
  - Provides place IDs which are used for further geocoding and directions requests.

- **Geocoding API**:
  - Converts a place ID into geographical coordinates (latitude and longitude).
  - These coordinates are essential for calculating directions and nearby places.

- **Directions API**:
  - Fetches walking directions between two places identified by their place IDs.
  - Returns detailed step-by-step instructions, which are displayed to the user.

### Backend Components

- **Token Verification Middleware**:
  - Middleware function that verifies the JWT token for protected routes.
  - Ensures that only authenticated users can access the route-related functionality.

- **Route Controller**:
  - Handles the main logic for fetching and storing route data.
  - Integrates with Google Maps API to get directions and places data.

- **Auth Controller**:
  - Manages user authentication and token validation.
  - Provides endpoints for user login and token verification.

### Database

- **MongoDB**:
  - Stores user data and route information.
  - Allows for efficient querying and updating of route records.

## Conclusion

This application demonstrates how to integrate various technologies to build a feature-rich and responsive route directions app. The separation of concerns in the codebase ensures maintainability and scalability for future enhancements.
---
