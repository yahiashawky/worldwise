# WorldWise 🌍

WorldWise is a dynamic React-based Single Page Application (SPA) designed to let travelers document and track their journeys across the globe. By combining interactive maps with location search, automatic reverse geocoding, notes logging, and personal travel statistics, the app creates a visual and structured archive of a user's footsteps.

---

## Overview

WorldWise allows users to interactively pinpoint locations on a digital world map and save details about the cities they've visited. The application uses a split-screen viewport layout displaying a sidebar with list views, detail views, and entry forms alongside a fully interactive OpenStreetMap interface. 

Users can:
*   Click anywhere on the map to add a new trip.
*   Instantly query their device's current coordinates to locate themselves.
*   Save the trip details, including customized notes and travel dates.
*   Browse traveled cities and countries.
*   Keep data synchronized with a mock backend database.

---

## Features

*   **Interactive Leaflet Map**: Powered by OpenStreetMap. Displaying custom markers for all logged travel spots.
*   **Reverse Geocoding**: Integrating with a public API to automatically resolve clicked map coordinates (`latitude`, `longitude`) into a city name, country, and country-flag emoji.
*   **Geolocation Assistance**: A one-click positioning system that uses the browser's Geolocation API to instantly center the map on the user's current coordinates.
*   **Trip Logging & Management**: Add new city entries with trip dates (via a calendar picker) and notes. Delete logged cities with single-click functionality.
*   **Data Aggregation**: Automatically identifies unique countries visited and renders a separate country-view list summarizing global footprints.
*   **Interactive Navigation & Deep Linking**: Real-time URL query parameter updates (`lat` and `lng`) synchronize the active map viewport, sidebar details, and target forms.
*   **Fake Authentication**: A demonstration login/logout mechanism providing user state validation.
*   **Protected Access Layer**: Guards travel tracking views against unauthenticated access using route redirection.
*   **Optimized Performance**: Implement React code-splitting and dynamic `lazy` loading for app pages with full-page loading indicators to minimize bundle size.

---

## Tech Stack

*   **Core / Frontend Framework**: [React](https://react.dev) (v19.0.0-rc.1)
*   **Routing**: [React Router DOM](https://reactrouter.com/) (v6.30.1)
*   **Map API & Rendering**: [Leaflet](https://leafletjs.com/) (v1.9.4) & [React Leaflet](https://react-leaflet.js.org/) (v5.0.0-rc.2)
*   **Map Tiles Provider**: [OpenStreetMap](https://www.openstreetmap.org/)
*   **Styling & Design System**: CSS Modules (scoped layouts per component) and global CSS variables
*   **Build Tool**: [Vite](https://vite.dev/) (v4.4.5)
*   **Third-Party API Integrations**:
    *   **BigDataCloud Reverse Geocoding API**: `https://api.bigdatacloud.net/data/reverse-geocode-client` (Resolves coordinates to location names)
    *   **Wikipedia API**: Links city detail sheets to Wikipedia articles: `https://en.wikipedia.org/wiki/${cityName}`
    *   **Avatar Placeholder Service**: `https://i.pravatar.cc/`
*   **Mock DB Server / Local REST API**: `json-server` (v1.0.0-beta.3)
*   **Libraries & Utilities**:
    *   `react-datepicker`: Interactive calendar inputs
    *   `react-emoji-render` & `react-emoji`: Handles flag rendering for cross-operating-system emoji support
    *   `prop-types`: Declares runtime prop type verification
*   **Development Tools**: ESLint (v8.57.1) for static analysis

---

## Architecture

WorldWise utilizes a Single Page Application (SPA) structure built with React, focusing on a clean separation of concerns:

```
[ App.jsx ]  (Router & Auth/Cities Providers)
    │
    ├──> [ Homepage / Login / Product / Pricing ] (Marketing Pages)
    │
    └──> [ Prodectedroute ] (Auth Guard)
             │
             └──> [ AppLayout ] (Dashboard)
                      ├──> [ Sidebar ]
                      │        ├──> [ AppNav ]
                      │        └──> [ Outlet ] (Nested Views: CityList, City, CountriesList, Form)
                      └──> [ Map ] (Leaflet Viewport)
```

### State Management & Data Flow
1.  **Context & Reducer Architecture**: State is divided into two primary logical modules, managed via React Context and the `useReducer` hook:
    *   `CitiesContext`: Stores the array of `cities`, the active `currentCity` detailed state, `isLoading` states, and requests (`fetchCities`, `getCity`, `createCity`, `deleteCity`) sent to the backend.
    *   `FakeAuthContext`: Maintains active user profile metadata and authentication statuses (`user`, `isAuthenticated`), and controls credentials verification.
2.  **Declarative Data Flow**:
    *   **Coordinate Selection**: Clicking the map or current location button updates URL search queries (`?lat=...&lng=...`).
    *   **Form Activation**: The URL change triggers the Sidebar route to display the addition form.
    *   **API Hydration**: The form reads the query params, queries the reverse geocoding API, and pre-populates coordinates, city, and country details.
    *   **State Update**: Submitting the form posts the new city structure to the API, dispatches the creation action to `CitiesContext` to synchronize the UI state, and redirects the routing focus back to the city list.

---

## Project Structure

```
worldwise/
├── .eslintrc.cjs                 # ESLint JavaScript configuration
├── .eslintrc.json                # ESLint JSON configuration
├── index.html                    # Root index HTML markup
├── package.json                  # Dependencies and execution script definitions
├── vite.config.js                # Vite custom builder setup
├── data/
│   └── cities.json               # Local JSON database file for json-server
├── public/                       # Static public assets (logos, background images)
│   ├── bg.jpg
│   ├── icon.png
│   ├── img-1.jpg
│   ├── img-2.jpg
│   ├── logo.png
│   └── vite.svg
└── src/
    ├── App.css                   # Basic layout style exceptions
    ├── App.jsx                   # Application layout structure, providers, & routing configuration
    ├── index.css                 # Global theme definitions and typography variables
    ├── main.jsx                  # Main React runtime entrypoint file
    ├── components/               # UI components
    │   ├── AppNav.jsx            # Tab navbar inside the sidebar
    │   ├── BackButton.jsx        # Navigation wrapper to step back in history
    │   ├── Button.jsx            # Generalized styled action buttons
    │   ├── City.jsx              # City detail sheet component
    │   ├── CityItem.jsx          # Row items rendered inside the city lists
    │   ├── CityList.jsx          # Wrapper listing active logged cities
    │   ├── CountriesList.jsx     # Unique aggregated countries lists component
    │   ├── CountryItem.jsx       # Row items displaying unique country logs
    │   ├── Form.jsx              # Creation form triggered by coordinates
    │   ├── Logo.jsx              # Brand logo layout anchor link
    │   ├── Map.jsx               # Interactive Leaflet map container
    │   ├── Message.jsx           # Clean alert alert banner messages
    │   ├── PageNav.jsx           # Global landing page toolbar navigation
    │   ├── Sidebar.jsx           # Fixed navigation drawer displaying context content
    │   ├── Spinner.jsx           # Centered loading animations
    │   ├── SpinnerFullPage.jsx   # Block-overlay loading mask for lazy boundaries
    │   └── User.jsx              # Profile detail cards and logout controls
    ├── customContexts/           # React Context Providers for global state
    │   ├── CitiesContext.jsx     # Handles async city database interactions & reducers
    │   └── FakeAuthContext.jsx   # Stores mock user logins and authentication helpers
    ├── hooks/                    # Reusable React hooks
    │   ├── useGeolocation.js     # Requests GPS coordinates from the navigator
    │   └── useUrlPosition.js     # Parses query variables from active coordinates
    └── pages/                    # Views representing primary pages
        ├── AppLayout.jsx         # Consolidated workspace splitting Sidebar & Map
        ├── HomePage.jsx          # Marketing index landing page
        ├── Login.jsx             # Credentials verification dashboard page
        ├── PageNotFound.jsx      # Fallback layout for unmatched pages (404)
        ├── Pricing.jsx           # Sales page outlining subscription models
        ├── Prodectedroute.jsx    # Auth route wrapper safeguarding nested views
        └── Product.jsx           # Info page summarizing applications
```

---

## Installation

To set up the project locally:

1.  **Clone the Repository**:
    ```bash
    git clone <repository-url>
    cd worldwise
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

---

## Environment Variables

The application does not currently rely on `.env` configuration files. Instead, backend and API connection variables are configured directly as source code constants:

*   **Local Backend/API Endpoint**: Configured inside [CitiesContext.jsx](file:///d:/yy/worldwise/src/customContexts/CitiesContext.jsx) as `basic_URL`.
    *   *Default*: Uses the hosted MockAPI service URL: `https://6a2e8bccc9776ca6c0c4b39b.mockapi.io/api`
    *   *Local Server option (commented)*: Pointing to `http://localhost:8000` for offline data synchronization.
*   **Geocode Endpoint**: Configured inside [Form.jsx](file:///d:/yy/worldwise/src/components/Form.jsx) as `BAse_URL`:
    *   *Target*: `https://api.bigdatacloud.net/data/reverse-geocode-client` (Resolves coordinates to cities)

---

## Running Locally

To run the application locally, you can choose between using the default remote MockAPI or launching a local server:

### Option A: Using Remote MockAPI (Default)
To run the frontend connected directly to the pre-configured online MockAPI:
```bash
npm run dev
```

### Option B: Using Local JSON Database Server
To run a local data store, you need to launch both the database server and the React dev environment:

1.  Update `basic_URL` in [CitiesContext.jsx](file:///d:/yy/worldwise/src/customContexts/CitiesContext.jsx):
    ```javascript
    const basic_URL = 'http://localhost:8000';
    ```
2.  Start the local Mock JSON server in a separate terminal:
    ```bash
    npm run server
    ```
3.  Start the Vite frontend development server:
    ```bash
    npm run dev
    ```

Once started, the application will run at:
*   Frontend: `http://localhost:5173/`
*   Database API: `http://localhost:8000/`

To lint files for guidelines and formatting checks, execute:
```bash
npm run lint
```

---

## Build

To compile a optimized static production bundle:
```bash
npm run build
```
This processes and bundles sources to the `dist/` directory.

To preview your production build locally:
```bash
npm run preview
```

---

## Deployment

The project builds standard static HTML, CSS, and JS.
*   **Static Site Hosting**: Can be directly deployed to services like Vercel, Netlify, Github Pages, or AWS S3.
*   **API Requirement**: The production build will operate successfully out-of-the-box using the hardcoded remote MockAPI endpoint. If you want to use your own data service, update `basic_URL` inside [CitiesContext.jsx](file:///d:/yy/worldwise/src/customContexts/CitiesContext.jsx) prior to building.

---

## API Integration

### 1. BigDataCloud Reverse Geocoding Client
*   **Endpoint**: `https://api.bigdatacloud.net/data/reverse-geocode-client`
*   **Purpose**: Resolves latitude/longitude inputs into detailed geographic descriptors (city name, country code, country name).
*   **Data Flow**:
    ```
    Latitude/Longitude -> Fetch -> JSON -> Update Form State
    ```

### 2. Wikipedia Search
*   **Format**: `https://en.wikipedia.org/wiki/${cityName}`
*   **Purpose**: Dynamically renders links inside the city detail sheet allowing users to read more historical context about their destination.

### 3. Pravatar Avatars
*   **Format**: `https://i.pravatar.cc/100?u=zz`
*   **Purpose**: Generates high-quality placeholder profile icons for authenticated users.

---

## Database

The project local database utilizes a flat-file JSON document schema defined in [cities.json](file:///d:/yy/worldwise/data/cities.json).

### City Object Schema
```json
{
  "id": "7b0c",
  "cityName": "Alcaracejos",
  "country": "Spain",
  "emoji": "🇪🇸",
  "date": "2026-02-22T23:56:25.264Z",
  "notes": "just now",
  "position": {
    "lat": "38.30718056188316",
    "lng": "-4.921875000000001"
  }
}
```

---

## Authentication

Authentication is handled locally via a Mock Context system (`FakeAuthContext`):

1.  **Form Input**: Users enter an email address and password on the `/login` route.
2.  **Credentials Validation**: The authentication provider checks if credentials match the configured `FAKE_USER` entry:
    *   **Email**: `jack@example.com`
    *   **Password**: `qwerty`
3.  **Authentication Action**: Successful matches assign the mock user state to local memory and switch `isAuthenticated` to `true`.
4.  **Route Protection**: The [Prodectedroute.jsx](file:///d:/yy/worldwise/src/pages/Prodectedroute.jsx) wrapper intercepts request routing for `/app/*` and redirects users to `/` if `isAuthenticated` is falsy.

---

## Scripts

The following scripts are registered in [package.json](file:///d:/yy/worldwise/package.json):

| Script | Command | Purpose |
| :--- | :--- | :--- |
| `dev` | `vite` | Starts the Vite development server with Hot Module Replacement (HMR) |
| `build` | `vite build` | Compiles production assets into the `/dist` output folder |
| `lint` | `eslint . --ext js,jsx ...` | Runs ESLint to check for stylistic errors or logic bugs |
| `preview` | `vite preview` | Launches a preview web server to test the `/dist` production build locally |
| `server` | `json-server --watch data/cities.json --port 8000` | Spins up local mock API server to handle CRUD operations on city travel history |

---

## Dependencies

Crucial dependencies implemented in this project:

*   `react` & `react-dom` (v19.0.0-rc.1): Core runtime libraries powering component-based UI rendering.
*   `react-router-dom` (v6.30.1): Directs application routing, URL synchronization, and nested page layouts.
*   `leaflet` (v1.9.4) & `react-leaflet` (v5.0.0-rc.2): Provides interactive map visualizations, customized markers, and viewport events.
*   `react-datepicker` (v9.1.0): Renders cross-browser calendar overlays within the city detail logger.
*   `react-emoji-render` (v2.0.1): Ensures country flag graphics display reliably.

---

## Future Improvements

*   **Fix Route Spelling Typo**: Rename [Prodectedroute.jsx](file:///d:/yy/worldwise/src/pages/Prodectedroute.jsx) to `ProtectedRoute.jsx` (and resolve references in [App.jsx](file:///d:/yy/worldwise/src/App.jsx)) for clean nomenclature.
*   **Environment Integration**: Migrate hardcoded MockAPI and Geolocation URLs to environment variable files (e.g. `.env.local` / `.env.production`).
*   **Robust Database Migration**: Connect the frontend context state endpoints to production databases like Supabase, Firebase, or a dedicated Node.js backend instead of relying on `json-server` or MockAPI.
*   **Persistent Sessions**: Implement tokens storage (e.g., localStorage) inside the authentication provider to persist active logged-in states upon page reloads.
*   **Trip Edit Actions**: Support direct modification of trip comments and travel dates without requiring deletion and re-creation of entry nodes.
*   **Input Search & Filters**: Add interactive search bars to the sidebar so users can filter logged locations quickly by city name or country.

---

## Needs Verification

*   **MockAPI Lifetime**: Check if the default API endpoint `https://6a2e8bccc9776ca6c0c4b39b.mockapi.io/api` will remain online indefinitely, or if it has usage/rate limits for active testing.
*   **Browser Location Permission Fallbacks**: Verify behavior and test error layouts across environments when geolocation permission is actively blocked or rejected by user settings.
