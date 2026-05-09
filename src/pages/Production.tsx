import {
	AlertTriangle,
	Package,
	Pause,
	Play,
	RefreshCw,
	TrendingUp,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { productionApi } from "../api/productionApi";
import type { Alert, ProductionLine } from "../api/types";
import { ProductionLineSkeleton } from "../components/LoadingSkeleton";

const getStatusBadge = (status: string) => {
	switch (status) {
		case "running":
			return "badge-running";
		case "paused":
			return "badge-paused";
		case "stopped":
			return "badge-stopped";
		default:
			return "bg-gray-100 text-gray-700";
	}
};

const getStatusColor = (status: string) => {
	switch (status) {
		case "running":
			return "bg-green-500";
		case "paused":
			return "bg-yellow-500";
		case "stopped":
			return "bg-red-500";
		default:
			return "bg-gray-500";
	}
};

export default function Production() {
	const [lines, setLines] = useState<ProductionLine[]>([]);
	const [alerts, setAlerts] = useState<Alert[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [refreshing, setRefreshing] = useState(false);

	const loadData = useCallback(async () => {
		try {
			const [linesData, alertsData] = await Promise.all([
				productionApi.getProductionLines(),
				productionApi.getAlerts(),
			]);
			setLines(linesData);
			setAlerts(alertsData.slice(0, 5));
			setError(null);
		} catch (err) {
			setError("Failed to load production data");
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	}, []);

	useEffect(() => {
		loadData();
		const interval = setInterval(loadData, 30000);
		return () => clearInterval(interval);
	}, [loadData]);

	const handleRefresh = () => {
		setRefreshing(true);
		loadData();
	};

	const handleToggleStatus = async (id: number, currentStatus: string) => {
		const newStatus = currentStatus === "running" ? "paused" : "running";
		try {
			const updated = await productionApi.updateLineStatus(id, newStatus);
			setLines((prev) => prev.map((l) => (l.id === id ? updated : l)));
		} catch (err) {
			console.error("Failed to update status");
		}
	};

	const activeCount = lines.filter((l) => l.status === "running").length;
	const pausedCount = lines.filter((l) => l.status === "paused").length;
	const totalOutput = lines.reduce((sum, l) => sum + l.progress, 0);
	const efficiency =
		lines.length > 0 ? Math.round(totalOutput / lines.length) : 0;

	const getAlertColor = (type: string) => {
		switch (type) {
			case "warning":
				return "border-l-yellow-500 bg-yellow-50";
			case "success":
				return "border-l-green-500 bg-green-50";
			default:
				return "border-l-blue-500 bg-blue-50";
		}
	};

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center h-64 card">
				<p className="text-red-600 mb-4">{error}</p>
				<button
					type="button"
					onClick={handleRefresh}
					className="btn-primary flex items-center gap-2"
				>
					<RefreshCw size={16} /> Retry
				</button>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-heading text-2xl font-semibold text-primary">
						Production Monitor
					</h1>
					<p className="text-muted">Real-time production line status</p>
				</div>
				<button
					type="button"
					onClick={handleRefresh}
					disabled={refreshing}
					className="btn-secondary flex items-center gap-2"
				>
					<RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
					Refresh
				</button>
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="card p-4 flex items-center gap-3">
					<div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
						<Play size={20} className="text-green-600" />
					</div>
					<div>
						<p className="text-sm text-muted">Active Lines</p>
						<p className="text-xl font-bold text-primary">{activeCount}</p>
					</div>
				</div>
				<div className="card p-4 flex items-center gap-3">
					<div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
						<Pause size={20} className="text-yellow-600" />
					</div>
					<div>
						<p className="text-sm text-muted">Paused</p>
						<p className="text-xl font-bold text-primary">{pausedCount}</p>
					</div>
				</div>
				<div className="card p-4 flex items-center gap-3">
					<div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
						<Package size={20} className="text-blue-600" />
					</div>
					<div>
						<p className="text-sm text-muted">Today's Output</p>
						<p className="text-xl font-bold text-primary">45 pkg</p>
					</div>
				</div>
				<div className="card p-4 flex items-center gap-3">
					<div className="w-10 h-10 bg-violet-50 rounded-lg flex items-center justify-center">
						<TrendingUp size={20} className="text-violet-600" />
					</div>
					<div>
						<p className="text-sm text-muted">Efficiency</p>
						<p className="text-xl font-bold text-primary">{efficiency}%</p>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Production Lines */}
				<div className="lg:col-span-2 space-y-4">
					{loading
						? [1, 2, 3].map((i) => <ProductionLineSkeleton key={i} />)
						: lines.map((line) => (
								<div key={line.id} className="card p-6">
									<div className="flex items-start justify-between mb-4">
										<div>
											<h3 className="font-semibold text-primary">
												{line.name}
											</h3>
											<p className="text-sm text-muted">{line.product}</p>
										</div>
										<div className="flex items-center gap-2">
											<span
												className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(line.status)}`}
											>
												{line.status}
											</span>
											<button
												type="button"
												onClick={() => handleToggleStatus(line.id, line.status)}
												className={`p-2 rounded-lg transition-colors ${
													line.status === "running"
														? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
														: "bg-green-100 text-green-700 hover:bg-green-200"
												}`}
											>
												{line.status === "running" ? (
													<Pause size={16} />
												) : (
													<Play size={16} />
												)}
											</button>
										</div>
									</div>

									{/* Progress Bar */}
									<div className="mb-4">
										<div className="flex justify-between text-sm mb-1">
											<span className="text-muted">Progress</span>
											<span className="font-medium text-primary">
												{line.progress}%
											</span>
										</div>
										<div className="h-3 bg-secondary rounded-full overflow-hidden">
											<div
												className={`h-full ${getStatusColor(line.status)} transition-all duration-500`}
												style={{ width: `${line.progress}%` }}
											/>
										</div>
									</div>

									{/* Details */}
									<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
										<div>
											<p className="text-muted">Current Stage</p>
											<p className="font-medium text-primary">
												{line.currentStage}
											</p>
										</div>
										<div>
											<p className="text-muted">Batch</p>
											<p className="font-medium text-primary text-xs">
												{line.batchNumber}
											</p>
										</div>
										<div>
											<p className="text-muted">Temperature</p>
											<p className="font-medium text-primary">
												{line.temperature?.toFixed(1)}°C
											</p>
										</div>
										<div>
											<p className="text-muted">Humidity</p>
											<p className="font-medium text-primary">
												{line.humidity?.toFixed(1)}%
											</p>
										</div>
									</div>

									<div className="flex items-center justify-between mt-4 pt-4 border-t border-highlight text-sm text-muted">
										<span>Started: {line.startTime}</span>
										<span>Est. End: {line.estimatedEnd}</span>
									</div>
								</div>
							))}
				</div>

				{/* Alerts */}
				<div className="card p-6 h-fit">
					<h2 className="font-heading text-lg font-semibold text-primary mb-4 flex items-center gap-2">
						<AlertTriangle size={20} className="text-accent" />
						Recent Alerts
					</h2>
					<div className="space-y-3">
						{alerts.length === 0 ? (
							<p className="text-muted text-sm text-center py-4">
								No recent alerts
							</p>
						) : (
							alerts.map((alert) => (
								<div
									key={alert.id}
									className={`p-3 rounded-lg border-l-4 ${getAlertColor(alert.type)}`}
								>
									<p className="text-sm text-primary">{alert.message}</p>
									<p className="text-xs text-muted mt-1">{alert.time}</p>
								</div>
							))
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
