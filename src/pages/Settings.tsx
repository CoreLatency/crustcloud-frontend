import {
	AlertCircle,
	Bell,
	Check,
	Lock,
	Palette,
	Save,
	User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { productionApi } from "../api/productionApi";
import { Skeleton } from "../components/LoadingSkeleton";
import { useProfile } from "../hooks/useApi";

type TabType = "profile" | "password" | "notifications" | "appearance";

export default function Settings() {
	const [activeTab, setActiveTab] = useState<TabType>("profile");
	const { data: profile, loading: profileLoading, refetch } = useProfile();

	// Profile form
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [profileSaving, setProfileSaving] = useState(false);
	const [profileSuccess, setProfileSuccess] = useState(false);
	const [profileError, setProfileError] = useState("");

	// Password form
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [passwordSaving, setPasswordSaving] = useState(false);
	const [passwordSuccess, setPasswordSuccess] = useState(false);
	const [passwordError, setPasswordError] = useState("");

	useEffect(() => {
		if (profile) {
			setName(profile.name);
			setEmail(profile.email);
		}
	}, [profile]);

	const handleProfileSave = async (e: React.FormEvent) => {
		e.preventDefault();
		setProfileSaving(true);
		setProfileError("");
		setProfileSuccess(false);

		try {
			await productionApi.updateProfile({ name, email });
			setProfileSuccess(true);
			refetch();
			setTimeout(() => setProfileSuccess(false), 3000);
		} catch (err) {
			setProfileError("Failed to update profile");
		} finally {
			setProfileSaving(false);
		}
	};

	const handlePasswordSave = async (e: React.FormEvent) => {
		e.preventDefault();
		setPasswordError("");
		setPasswordSuccess(false);

		if (newPassword !== confirmPassword) {
			setPasswordError("Passwords do not match");
			return;
		}

		if (newPassword.length < 6) {
			setPasswordError("Password must be at least 6 characters");
			return;
		}

		setPasswordSaving(true);

		try {
			await productionApi.updatePassword({ currentPassword, newPassword });
			setPasswordSuccess(true);
			setCurrentPassword("");
			setNewPassword("");
			setConfirmPassword("");
			setTimeout(() => setPasswordSuccess(false), 3000);
		} catch (err) {
			setPasswordError(
				"Failed to update password. Check your current password.",
			);
		} finally {
			setPasswordSaving(false);
		}
	};

	const tabs = [
		{ id: "profile" as TabType, label: "Profile", icon: User },
		{ id: "password" as TabType, label: "Password", icon: Lock },
		{ id: "notifications" as TabType, label: "Notifications", icon: Bell },
		{ id: "appearance" as TabType, label: "Appearance", icon: Palette },
	];

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="font-heading text-2xl font-semibold text-primary">
					Settings
				</h1>
				<p className="text-muted">Manage your account and preferences</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
				{/* Sidebar */}
				<div className="card p-4 h-fit">
					<nav className="space-y-1">
						{tabs.map((tab) => (
							<button
								type="button"
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
									activeTab === tab.id
										? "bg-accent text-white"
										: "text-primary hover:bg-secondary"
								}`}
							>
								<tab.icon size={18} />
								<span className="font-medium">{tab.label}</span>
							</button>
						))}
					</nav>
				</div>

				{/* Content */}
				<div className="lg:col-span-3 card p-6">
					{/* Profile Tab */}
					{activeTab === "profile" && (
						<div>
							<h2 className="font-heading text-xl font-semibold text-primary mb-6">
								Profile Information
							</h2>

							{profileLoading ? (
								<div className="space-y-6">
									<Skeleton className="h-10 w-full rounded-lg" />
									<Skeleton className="h-10 w-full rounded-lg" />
									<Skeleton className="h-10 w-32 rounded-lg" />
								</div>
							) : (
								<form onSubmit={handleProfileSave} className="space-y-6">
									{profileError && (
										<div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
											<AlertCircle size={18} />
											{profileError}
										</div>
									)}

									{profileSuccess && (
										<div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
											<Check size={18} />
											Profile updated successfully!
										</div>
									)}

									<div>
										<label
											htmlFor="profile-name"
											className="block text-sm font-medium text-primary mb-1.5"
										>
											Full Name
										</label>
										<input
											id="profile-name"
											type="text"
											value={name}
											onChange={(e) => setName(e.target.value)}
											className="input"
											required
										/>
									</div>

									<div>
										<label
											htmlFor="profile-email"
											className="block text-sm font-medium text-primary mb-1.5"
										>
											Email Address
										</label>
										<input
											id="profile-email"
											type="email"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											className="input"
											required
										/>
									</div>

									<div>
										<label
											htmlFor="profile-role"
											className="block text-sm font-medium text-primary mb-1.5"
										>
											Role
										</label>
										<input
											id="profile-role"
											type="text"
											value={profile?.role || ""}
											className="input bg-secondary/50"
											disabled
										/>
										<p className="text-xs text-muted mt-1">
											Contact an administrator to change your role
										</p>
									</div>

									<button
										type="submit"
										disabled={profileSaving}
										className="btn-primary flex items-center gap-2"
									>
										<Save size={18} />
										{profileSaving ? "Saving..." : "Save Changes"}
									</button>
								</form>
							)}
						</div>
					)}

					{/* Password Tab */}
					{activeTab === "password" && (
						<div>
							<h2 className="font-heading text-xl font-semibold text-primary mb-6">
								Change Password
							</h2>

							<form
								onSubmit={handlePasswordSave}
								className="space-y-6 max-w-md"
							>
								{passwordError && (
									<div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
										<AlertCircle size={18} />
										{passwordError}
									</div>
								)}

								{passwordSuccess && (
									<div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
										<Check size={18} />
										Password updated successfully!
									</div>
								)}

								<div>
									<label
										htmlFor="current-password"
										className="block text-sm font-medium text-primary mb-1.5"
									>
										Current Password
									</label>
									<input
										id="current-password"
										type="password"
										value={currentPassword}
										onChange={(e) => setCurrentPassword(e.target.value)}
										className="input"
										required
									/>
								</div>

								<div>
									<label
										htmlFor="new-password"
										className="block text-sm font-medium text-primary mb-1.5"
									>
										New Password
									</label>
									<input
										id="new-password"
										type="password"
										value={newPassword}
										onChange={(e) => setNewPassword(e.target.value)}
										className="input"
										required
									/>
								</div>

								<div>
									<label
										htmlFor="confirm-password"
										className="block text-sm font-medium text-primary mb-1.5"
									>
										Confirm New Password
									</label>
									<input
										id="confirm-password"
										type="password"
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
										className="input"
										required
									/>
								</div>

								<button
									type="submit"
									disabled={passwordSaving}
									className="btn-primary flex items-center gap-2"
								>
									<Lock size={18} />
									{passwordSaving ? "Updating..." : "Update Password"}
								</button>
							</form>
						</div>
					)}

					{/* Notifications Tab */}
					{activeTab === "notifications" && (
						<div>
							<h2 className="font-heading text-xl font-semibold text-primary mb-6">
								Notification Preferences
							</h2>

							<div className="space-y-6">
								<div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
									<div>
										<p className="font-medium text-primary">
											Production Alerts
										</p>
										<p className="text-sm text-muted">
											Get notified about production line status changes
										</p>
									</div>
									<label className="relative inline-flex items-center cursor-pointer">
										<input
											type="checkbox"
											defaultChecked
											className="sr-only peer"
										/>
										<span className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent" />
									</label>
								</div>

								<div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
									<div>
										<p className="font-medium text-primary">
											Schedule Reminders
										</p>
										<p className="text-sm text-muted">
											Receive reminders about upcoming production shifts
										</p>
									</div>
									<label className="relative inline-flex items-center cursor-pointer">
										<input
											type="checkbox"
											defaultChecked
											className="sr-only peer"
										/>
										<span className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent" />
									</label>
								</div>

								<div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
									<div>
										<p className="font-medium text-primary">
											Email Notifications
										</p>
										<p className="text-sm text-muted">
											Receive email updates about important events
										</p>
									</div>
									<label className="relative inline-flex items-center cursor-pointer">
										<input type="checkbox" className="sr-only peer" />
										<span className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent" />
									</label>
								</div>
							</div>
						</div>
					)}

					{/* Appearance Tab */}
					{activeTab === "appearance" && (
						<div>
							<h2 className="font-heading text-xl font-semibold text-primary mb-6">
								Appearance Settings
							</h2>

							<div className="space-y-6">
								<div>
									<p className="block text-sm font-medium text-primary mb-3">
										Theme
									</p>
									<div className="grid grid-cols-3 gap-4">
										<button
											type="button"
											className="p-4 border-2 border-accent rounded-lg bg-white text-center"
										>
											<span className="w-8 h-8 bg-gradient-to-br from-amber-100 to-amber-50 rounded-full mx-auto mb-2 block" />
											<span className="text-sm font-medium text-primary">
												Light
											</span>
										</button>
										<button
											type="button"
											className="p-4 border-2 border-highlight rounded-lg bg-white text-center opacity-50 cursor-not-allowed"
										>
											<span className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full mx-auto mb-2 block" />
											<span className="text-sm font-medium text-muted">
												Dark
											</span>
											<p className="text-xs text-muted">Coming soon</p>
										</button>
										<button
											type="button"
											className="p-4 border-2 border-highlight rounded-lg bg-white text-center opacity-50 cursor-not-allowed"
										>
											<span className="w-8 h-8 bg-gradient-to-br from-amber-100 to-gray-700 rounded-full mx-auto mb-2 block" />
											<span className="text-sm font-medium text-muted">
												System
											</span>
											<p className="text-xs text-muted">Coming soon</p>
										</button>
									</div>
								</div>

								<div>
									<p className="block text-sm font-medium text-primary mb-3">
										Accent Color
									</p>
									<div className="flex gap-3">
										{[
											{ color: "bg-amber-600", name: "Amber" },
											{ color: "bg-orange-600", name: "Orange" },
											{ color: "bg-rose-600", name: "Rose" },
											{ color: "bg-emerald-600", name: "Emerald" },
											{ color: "bg-blue-600", name: "Blue" },
										].map((option) => (
											<button
												type="button"
												key={option.name}
												className={`w-10 h-10 ${option.color} rounded-full ${
													option.name === "Amber"
														? "ring-2 ring-offset-2 ring-accent"
														: ""
												}`}
												title={option.name}
											/>
										))}
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
