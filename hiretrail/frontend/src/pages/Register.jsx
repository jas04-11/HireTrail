import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Logo from "../components/common/Logo";
import { useAuth } from "../context/AuthContext";
import { Spinner } from "../components/common/Loader";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", college: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await register(form);
      navigate("/profile/edit");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
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
          <h1 className="text-xl font-bold text-gray-900 text-center">Create your account</h1>
          <p className="mt-1 text-sm text-gray-500 text-center">It only takes a minute</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="label-field">Full name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Aditi Sharma"
                className="input-field"
              />
            </div>
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
              <label className="label-field">College (optional)</label>
              <input
                type="text"
                value={form.college}
                onChange={(e) => setForm({ ...form, college: e.target.value })}
                placeholder="NIT Trichy"
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
                placeholder="At least 6 characters"
                className="input-field"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? <Spinner size={16} /> : "Create account"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-primary-600 font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
