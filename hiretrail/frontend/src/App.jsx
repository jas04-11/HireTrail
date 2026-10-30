import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/common/ProtectedRoute";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Explore from "./pages/Explore";
import Companies from "./pages/Companies";
import CompanyDetail from "./pages/CompanyDetail";
import ExperienceDetail from "./pages/ExperienceDetail";
import ExperienceForm from "./pages/ExperienceForm";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ProfileEdit from "./pages/ProfileEdit";
import Bookmarks from "./pages/Bookmarks";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#ffffff",
            color: "#1f2937",
            border: "1px solid #e5e7eb",
            fontSize: "14px",
          },
        }}
      />
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/companies/:slug" element={<CompanyDetail />} />
          <Route path="/experiences/:id" element={<ExperienceDetail />} />
          <Route path="/profile/:id" element={<Profile />} />

          <Route
            path="/experiences/new"
            element={
              <ProtectedRoute>
                <ExperienceForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/experiences/:id/edit"
            element={
              <ProtectedRoute>
                <ExperienceForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/edit"
            element={
              <ProtectedRoute>
                <ProfileEdit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookmarks"
            element={
              <ProtectedRoute>
                <Bookmarks />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </>
  );
}

export default App;
