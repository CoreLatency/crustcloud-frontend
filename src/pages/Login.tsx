import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const { login } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			await login(email, password);
			navigate("/dashboard");
		} catch (err) {
			if (err instanceof TypeError && err.message.includes("fetch")) {
				setError("Unable to connect to server. Please check your connection.");
			} else if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("Invalid email or password");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-background flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				<div className="bg-white rounded-2xl shadow-lg border border-highlight p-8">
					{/* Logo */}
					<div className="flex justify-center mb-6">
						<img src="/logo.svg" alt="Crust & Cloud" className="h-20" />
					</div>

					{/* Title */}
					<h1 className="font-heading text-3xl font-semibold text-primary text-center mb-2">
						Welcome Back
					</h1>
					<p className="text-muted text-center mb-8">Sign in to your account</p>

					{/* Error */}
					{error && (
						<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
							{error}
						</div>
					)}

					{/* Form */}
					<form onSubmit={handleSubmit} className="space-y-5">
						<div>
							<label
								htmlFor="login-email"
								className="block text-sm font-medium text-primary mb-1.5"
							>
								Email
							</label>
							<input
								id="login-email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="input"
								placeholder="you@example.com"
								required
							/>
						</div>

						<div>
							<label
								htmlFor="login-password"
								className="block text-sm font-medium text-primary mb-1.5"
							>
								Password
							</label>
							<input
								id="login-password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="input"
								placeholder="••••••••"
								required
							/>
						</div>

						<button
							type="submit"
							disabled={loading}
							className="btn-primary w-full py-3 disabled:opacity-50"
						>
							{loading ? "Signing in..." : "Sign In"}
						</button>
					</form>

					{/* Register Link */}
					<p className="mt-6 text-center text-sm text-muted">
						Don't have an account?{" "}
						<Link
							to="/register"
							className="text-accent hover:underline font-medium"
						>
							Create one
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
