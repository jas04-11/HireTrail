import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import Logo from "../components/common/Logo";
import { useAuth } from "../context/AuthContext";
import { Spinner } from "../components/common/Loader";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      const redirectTo = location.state?.from?.pathname || "/dashboard";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>

        <div className="card p-6">
          <h1 className="text-xl font-bold text-gray-900 text-center">Welcome back</h1>
          <p className="mt-1 text-sm text-gray-500 text-center">Log in to your account</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="label-field">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@college.edu"
                className="input-field"
              />
            </div>
            <div>
              <label className="label-field">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="input-field"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? <Spinner size={16} /> : "Log in"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-500">
            New here?{" "}
            <Link to="/register" className="text-primary-600 font-medium hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
