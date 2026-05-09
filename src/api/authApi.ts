import type { AuthResponse } from "./types";

const API_BASE_URL =
	import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export const authApi = {
	async login(email: string, password: string): Promise<AuthResponse> {
		const response = await fetch(`${API_BASE_URL}/auth/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password }),
		});

		if (!response.ok) {
			const error = await response
				.json()
				.catch(() => ({ message: "Login failed" }));
			throw new Error(error.message || "Invalid credentials");
		}

		return response.json();
	},

	async register(
		name: string,
		email: string,
		password: string,
	): Promise<AuthResponse> {
		const response = await fetch(`${API_BASE_URL}/auth/register`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name, email, password }),
		});

		if (!response.ok) {
			const error = await response
				.json()
				.catch(() => ({ message: "Registration failed" }));
			throw new Error(error.message || "Registration failed");
		}

		return response.json();
	},

	async logout(): Promise<void> {
		const token = localStorage.getItem("token");
		if (token) {
			await fetch(`${API_BASE_URL}/auth/logout`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}).catch(() => {
				// Logout endpoint may not exist, that's okay
			});
		}
		localStorage.removeItem("token");
	},

	async validateToken(token: string): Promise<AuthResponse["user"] | null> {
		try {
			const response = await fetch(`${API_BASE_URL}/auth/me`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				return null;
			}

			return response.json();
		} catch {
			return null;
		}
	},
};
