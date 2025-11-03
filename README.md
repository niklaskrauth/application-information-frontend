# Job Applications Dashboard

A modern, responsive web application for tracking and managing job applications. Built with React, TypeScript, Material-UI, and Vite.

## Features

- 📊 **Beautiful Dashboard**: Clean, modern interface with gradient background
- 📱 **Mobile Responsive**: Automatically switches between table view (desktop) and card view (mobile)
- 🔍 **Search Functionality**: Real-time search across all job fields
- 🎨 **Material-UI Components**: Professional design with Material-UI
- 📡 **Backend Integration**: Connects to a Python backend API for job data
- ✨ **Status Indicators**: Visual chips for job status and home office options

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   yarn install
   ```

3. Configure the API URL (optional):
   - Copy `.env.example` to `.env`
   - Update `VITE_API_URL` if needed
   - Default: `/api` (works when using the Express server)

### Development

Start the development server:
```bash
yarn dev
```

The application will be available at `http://localhost:5173`

**Note:** In development mode, the frontend uses Vite's dev server. To test the POST endpoint, you need to:
1. Build the application: `yarn build`
2. Start the Express server: `yarn start`
3. Access the application at `http://localhost:3000`

### Production

For production, build the application and start the Express server:

```bash
# Build the React application
yarn build

# Start the Express server
yarn start
```

The Express server will:
- Serve the built React application
- Accept POST requests from the backend at `/api/jobs`
- Provide job data to the frontend via `/api/jobs`

The application will be available at `http://localhost:3000`

## Docker Deployment

The application can be deployed using Docker for production environments.

### Using Docker

Build and run the Docker image:

```bash
# Build the Docker image
docker build -t application-information-frontend .

# Run the container
docker run -d -p 3000:80 --name job-apps-frontend application-information-frontend
```

The application will be available at `http://localhost:3000`

### Using Docker Compose

For easier deployment with environment configuration:

```bash
# Start the application
docker-compose up -d

# Stop the application
docker-compose down
```

Configure the backend URL by creating a `.env` file:

```env
VITE_BACKEND_URL=http://your-backend-url:8000
```

The application will be available at `http://localhost:3000`

### Linting

```bash
yarn lint
```

## Backend API

The application now includes an Express server that acts as a middleware between the backend data source and the React frontend. This allows the backend to push job data to the frontend.

### Architecture

1. **Express Server** (`server.js`): 
   - Serves the React application
   - Provides API endpoints for job data
   - Stores job data in memory

2. **React Frontend**: 
   - Fetches job data from the Express server
   - Displays jobs in a responsive table/card layout

### API Endpoints

#### POST `/api/jobs`

The backend should POST job data to this endpoint. The data will be stored in memory and made available to the frontend.

**Request Body:**
```json
{
  "rows": [
    {
      "location": "string",
      "website": "string",
      "websiteToJobs": "string",
      "hasJob": true,
      "name": "string | null",
      "salary": "string | null",
      "homeOfficeOption": "boolean | null",
      "period": "string | null",
      "employmentType": "string | null",
      "applicationDate": "string | null",
      "comments": "string | null",
      "foundOn": "string | null",
      "occupyStart": "string | null"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Jobs data received",
  "count": 3
}
```

#### GET `/api/jobs`

Retrieves the current job data stored in the server (used by the frontend).

**Response:**
```json
{
  "rows": [...]
}
```

### Testing the POST Endpoint

You can test posting data using the included test script:

```bash
node test-post-data.js
```

Or using curl:

```bash
curl -X POST http://localhost:3000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{"rows":[...]}'
```

**Note:** All fields can be `null` except `hasJob`, `location`, `website`, and `websiteToJobs`.

## Technologies Used

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Material-UI (MUI)** - Component library
- **ESLint** - Code linting

## Project Structure

```
src/
├── App.tsx          # Main application component
├── types.ts         # TypeScript type definitions
├── main.tsx         # Application entry point
├── index.css        # Global styles
└── App.css          # Component styles
```

## Features in Detail

### Search Functionality
The search bar filters jobs in real-time across multiple fields:
- Job name
- Location
- Website
- Salary
- Employment type
- Period
- Comments

### Responsive Design
- **Desktop (md and above)**: Full table view with all columns
- **Mobile (below md)**: Card-based layout optimized for small screens

### Status Indicators
- **Has Job**: Green chip indicating the position is still open
- **Home Office**: Blue chip indicating remote work availability

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
