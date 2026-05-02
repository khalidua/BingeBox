import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { ProtectedRoute, AdminRoute } from "./routes/ProtectedRoutes";

import Home from "./routes/Home";
import Auth from "./routes/Auth";
import Overview from "./routes/Overview";
import MovieDetailPage from "./routes/MovieDetailPage";
import SeriesDetailPage from "./routes/SeriesDetailPage";
import Profile from "./routes/Profile";
import Settings from "./routes/Settings";
import Subscription from "./routes/Subscription";
import Support from "./routes/Support";
import Admin from "./routes/Admin";
import NotFound from "./routes/NotFound";
import Header from "./components/Navigation/Header";

// Import your database
import database from "../server/database.json";

export function AppRoutes() {
  const location = useLocation();

  // Extract movies and series from database
  const moviesData = database.movies || [];
  const seriesData = database.series || [];

  return (
    <>
      {location.pathname !== "/auth" && (
        <Header moviesData={moviesData} seriesData={seriesData} />
      )}
      <Routes>
        <Route index element={<Home />} />
        <Route path="/auth" element={<Auth key={location.pathname} />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/movie/:id" element={<MovieDetailPage />} />
        <Route path="/movie" element={<MovieDetailPage />} />
        <Route path="/movie-detail" element={<MovieDetailPage />} />
        <Route path="/series/:id" element={<SeriesDetailPage />} />
        <Route path="/series" element={<SeriesDetailPage />} />
        <Route path="/series-detail" element={<SeriesDetailPage />} />

        {/* Protected routes: require user in localStorage */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* Admin-only route */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />

        <Route path="/subscription" element={<Subscription />} />
        <Route path="/support" element={<Support />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function App() {
  const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || undefined;

  return (
    <Router basename={basename}>
      <AppRoutes />
    </Router>
  );
}

export default App;