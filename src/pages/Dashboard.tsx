import {
	ArrowUpDown,
	Calendar,
	Clock,
	Download,
	Eye,
	FileText,
	Flag,
	Layers,
	Plus,
	RefreshCw,
	Trash2,
	TrendingUp,
} from "lucide-react";
import { useState } from "react";
import {
	CardSkeleton,
	ChartSkeleton,
	TableSkeleton,
} from "../components/LoadingSkeleton";
import {
	useGanttData,
	useOutputData,
	useProductionStats,
	useTableData,
} from "../hooks/useApi";
import { useNavigate } from "react-router-dom";

const stages = [
	{ name: "mixing", color: "bg-amber-600" },
	{ name: "dividing", color: "bg-emerald-600" },
	{ name: "panning", color: "bg-yellow-500" },
	{ name: "baking", color: "bg-orange-500" },
	{ name: "packaging", color: "bg-violet-500" },
];

const tabs = [
	"Mixing",
	"Makeup Dividing",
	"Makeup Panning",
	"Baking",
	"Packaging",
];

const getStageColor = (stage: string) => {
	const colors: Record<string, string> = {
		mixing: "bg-amber-600",
		dividing: "bg-emerald-600",
		panning: "bg-yellow-500",
		baking: "bg-orange-500",
		packaging: "bg-violet-500",
	};
	return colors[stage] || "bg-gray-400";
};

const getStatusBadge = (status: string) => {
	switch (status) {
		case "Waiting":
			return "badge-waiting";
		case "In Progress":
			return "badge-inprogress";
		case "Completed":
			return "badge-completed";
		default:
			return "bg-gray-100 text-gray-700";
	}
};

export default function Dashboard() {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState("Mixing");
	const {
		data: stats,
		loading: statsLoading,
		error: statsError,
		refetch: refetchStats,
	} = useProductionStats();
	const {
		data: ganttData,
		loading: ganttLoading,
		refetch: refetchGantt,
	} = useGanttData();
	const {
		data: outputData,
		loading: outputLoading,
		refetch: refetchOutput,
	} = useOutputData();
	const {
		data: tableData,
		loading: tableLoading,
		refetch: refetchTable,
	} = useTableData();

	const refetchAll = () => {
		refetchStats();
		refetchGantt();
		refetchOutput();
		refetchTable();
	};

	const statItems = stats
		? [
				{
					icon: Layers,
					label: "TOTAL BATCHES",
					value: stats.totalBatches.toString(),
					bg: "bg-amber-50",
					iconColor: "text-amber-600",
				},
				{
					icon: TrendingUp,
					label: "TOTAL OUTPUT",
					value: stats.totalOutput,
					bg: "bg-emerald-50",
					iconColor: "text-emerald-600",
				},
				{
					icon: Calendar,
					label: "PLAN DATE",
					value: stats.planDate,
					bg: "bg-blue-50",
					iconColor: "text-blue-600",
				},
			]
		: [];

	const timeStats = stats
		? [
				{
					icon: Clock,
					label: "FIRST START",
					value: stats.firstStart,
					bg: "bg-orange-50",
					iconColor: "text-orange-600",
				},
				{
					icon: Flag,
					label: "LAST END",
					value: stats.lastEnd,
					bg: "bg-violet-50",
					iconColor: "text-violet-600",
				},
			]
		: [];

	if (statsError) {
		return (
			<div className="flex flex-col items-center justify-center h-64 card">
				<p className="text-red-600 mb-4">Failed to load dashboard data</p>
				<button
					type="button"
					onClick={refetchAll}
					className="btn-primary flex items-center gap-2"
				>
					<RefreshCw size={16} /> Retry
				</button>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Stats Cards */}
			<div className="space-y-4">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{statsLoading
						? [1, 2, 3].map((i) => <CardSkeleton key={i} />)
						: statItems.map((stat, index) => (
								<div
									key={stat.label}
									className="card p-4 flex items-center gap-4 animate-fade-in"
									style={{ animationDelay: `${index * 0.05}s` }}
								>
									<div
										className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}
									>
										<stat.icon size={24} className={stat.iconColor} />
									</div>
									<div>
										<p className="text-xs text-muted font-medium tracking-wide">
											{stat.label}
										</p>
										<p className="text-2xl font-bold text-primary">
											{stat.value}
										</p>
									</div>
								</div>
							))}
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{statsLoading
						? [1, 2].map((i) => <CardSkeleton key={i} />)
						: timeStats.map((stat, index) => (
								<div
									key={stat.label}
									className="card p-4 flex items-center gap-4 animate-fade-in"
									style={{ animationDelay: `${(index + 3) * 0.05}s` }}
								>
									<div
										className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}
									>
										<stat.icon size={24} className={stat.iconColor} />
									</div>
									<div>
										<p className="text-xs text-muted font-medium tracking-wide">
											{stat.label}
										</p>
										<p className="text-2xl font-bold text-primary">
											{stat.value}
										</p>
									</div>
								</div>
							))}
				</div>
			</div>

			{/* Gantt Chart */}
			{ganttLoading ? (
				<ChartSkeleton />
			) : (
				<div className="card p-6">
					<h2 className="font-heading text-lg font-semibold text-primary mb-1">
						Production Gantt
					</h2>
					<p className="text-sm text-muted mb-6">Production timeline</p>
					<div className="space-y-3">
						{ganttData?.map((product) => (
							<div key={product.id} className="flex items-center">
								<div className="w-28 text-right pr-4 flex-shrink-0">
									<span className="text-sm text-primary">{product.name}</span>
								</div>
								<div className="flex-1 h-8 relative bg-secondary rounded-md overflow-hidden">
									{product.timeline.map((segment, idx) => (
										<div
											key={`${product.id}-${segment.stage}`}
											className={`absolute top-0 h-full ${getStageColor(segment.stage)} transition-all hover:brightness-110`}
											style={{
												left: `${segment.start}%`,
												width: `${segment.width}%`,
											}}
											title={segment.stage}
										/>
									))}
								</div>
							</div>
						))}
					</div>
					<div className="flex flex-wrap gap-6 mt-6 pt-4 border-t border-highlight">
						{stages.map((stage) => (
							<div key={stage.name} className="flex items-center gap-2">
								<div className={`w-3 h-3 rounded-sm ${stage.color}`} />
								<span className="text-sm text-muted">{stage.name}</span>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Output Chart */}
			{outputLoading ? (
				<ChartSkeleton />
			) : (
				<div className="card p-6">
					<h2 className="font-heading text-lg font-semibold text-primary mb-1">
						Output by Product
					</h2>
					<p className="text-sm text-muted mb-6">Planned Output by Product</p>
					<div className="space-y-4">
						{outputData?.map((product) => (
							<div key={product.id} className="flex items-center">
								<div className="w-32 text-right pr-4 flex-shrink-0">
									<span className="text-sm text-primary">{product.name}</span>
								</div>
								<div className="flex-1 h-8 bg-secondary rounded-md overflow-hidden">
									<div
										className={`h-full bg-gradient-to-r ${product.color} rounded-md flex items-center justify-end pr-2`}
										style={{
											width: `${(product.output / product.maxOutput) * 100}%`,
										}}
									>
										<span className="text-xs font-semibold text-white">
											{product.output}
										</span>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Production Table */}
			{tableLoading ? (
				<TableSkeleton />
			) : (
				<div className="card overflow-hidden">
					<div className="flex border-b border-highlight overflow-x-auto">
						{tabs.map((tab) => (
							<button
								type="button"
								key={tab}
								onClick={() => setActiveTab(tab)}
								className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-all ${
									activeTab === tab
										? "bg-accent text-white"
										: "text-muted hover:bg-secondary"
								}`}
							>
								{tab}
							</button>
						))}
					</div>
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead className="bg-primary text-secondary">
								<tr>
									{[
										"Status",
										"Actions",
										"Product",
										"Sales Order",
										"Total Qty",
										"Batch Qty",
										"Capacity",
										"Dough",
										"Proc.Time",
										"Start",
										"End",
									].map((h) => (
										<th
											key={h}
											className="px-4 py-3 text-left font-semibold whitespace-nowrap"
										>
											{h}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{tableData?.map((row, idx) => (
									<tr
										key={row.id}
										className={idx % 2 === 0 ? "bg-background" : "bg-white"}
									>
										<td className="px-4 py-3">
											<span
												className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(row.status)}`}
											>
												{row.status}
											</span>
										</td>
										<td className="px-4 py-3">
											<button
												type="button"
												className="p-1.5 text-muted hover:text-red-600 hover:bg-red-50 rounded"
											>
												<Trash2 size={16} />
											</button>
										</td>
										<td className="px-4 py-3 font-medium text-primary">
											{row.product}
										</td>
										<td className="px-4 py-3 text-muted">{row.salesOrder}</td>
										<td className="px-4 py-3 font-medium">{row.totalQty}</td>
										<td className="px-4 py-3">{row.batchQty}</td>
										<td className="px-4 py-3">{row.capacity}</td>
										<td className="px-4 py-3">{row.dough}</td>
										<td className="px-4 py-3">{row.procTime}</td>
										<td className="px-4 py-3">{row.startSponge}</td>
										<td className="px-4 py-3">{row.endBatch}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<div className="p-4 border-t border-highlight flex flex-wrap items-center justify-between gap-4">
						<button
							type="button"
								className="btn-primary flex items-center gap-2"
								onClick={() => navigate("/scheduling")}
						>
							<Plus size={18} /> See All Schedules
						</button>
						<div className="flex items-center gap-3">
							<button
								type="button"
								className="btn-secondary flex items-center gap-2 py-2"
							>
								<ArrowUpDown size={16} /> Reorder
							</button>
							<button
								type="button"
								className="btn-secondary flex items-center gap-2 py-2"
							>
								<Download size={16} /> Export
							</button>
							<button
								type="button"
								className="btn-secondary flex items-center gap-2 py-2"
							>
								<FileText size={16} /> PDF
							</button>
							<button
								type="button"
								className="btn-secondary flex items-center gap-2 py-2"
							>
								<Eye size={16} /> Live
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
