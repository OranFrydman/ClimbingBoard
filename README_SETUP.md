# ClimbingBoard V2 - React Setup

This is the React.js version of the ClimbingBoard application.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Build the React App

```bash
npm run build
```

This will create a `dist` folder with the compiled React application.

### 3. Start the Server

```bash
npm start
```

The server will run on port 8080.

### 4. Development Mode (Optional)

For development with hot-reloading, you can run:

```bash
# Terminal 1: Start the backend server
npm run dev

# Terminal 2: Start the React dev server (if using webpack-dev-server)
npm run dev:react
```

## Project Structure

```
ClimbingBoard/
├── src/                    # React source files
│   ├── components/         # React components
│   │   ├── HomePage.js
│   │   ├── Workout.js
│   │   ├── Statistics.js
│   │   ├── CrushView.js
│   │   └── Navigation.js
│   ├── styles/            # CSS files
│   ├── utils/            # Utility functions
│   ├── App.js            # Main App component
│   └── index.js          # Entry point
├── public/               # Static files (media, HTML template)
├── db/                   # Database files (unchanged)
├── server.js             # Express server
├── webpack.config.js     # Webpack configuration
└── package.json         # Dependencies
```

## Key Changes from V1

- **Frontend**: Converted from Pug templates to React components
- **Routing**: Using React Router for client-side routing
- **API**: Added JSON API endpoints for Statistics (`/api/statistics`, `/api/filterStats`)
- **Build**: Webpack-based build system
- **Styling**: Modular CSS files per component

## Notes

- The database connections and CRUD functions remain unchanged
- All API endpoints are preserved
- Media files remain in `/public/MEDIA/`
- The server serves the React app from the `dist` folder after building
