export interface User {
	id: number;
	name: string;
	email: string;
	role: string;
}

export interface AuthResponse {
	token: string;
	user: User;
}

export interface ProductionStats {
	totalBatches: number;
	totalOutput: string;
	planDate: string;
	firstStart: string;
	lastEnd: string;
}

export interface TimelineSegment {
	stage: string;
	start: number;
	width: number;
}

export interface GanttProduct {
	id: string;
	name: string;
	timeline: TimelineSegment[];
}

export interface OutputProduct {
	id: string;
	name: string;
	output: number;
	maxOutput: number;
	color: string;
}

export interface ProductionRow {
	id: string;
	status: string;
	product: string;
	salesOrder: string;
	totalQty: number;
	soCoExcess: number;
	exchLoss: number;
	excess: number;
	samples: number;
	carryOver: number;
	theorExcess: number;
	batchQty: number;
	capacity: number;
	dough: string;
	procTime: number;
	startSponge: string;
	endDough: string;
	endBatch: string;
	orderBatch: string;
	lineBatch: string;
}

export interface ProductionLine {
	id: number;
	name: string;
	product: string;
	status: string;
	progress: number;
	currentStage: string;
	batchNumber: string;
	startTime: string;
	estimatedEnd: string;
	temperature: number;
	humidity: number;
}

export interface Recipe {
	id: number;
	name: string;
	category: string;
	prepTime: string;
	bakingTime: string;
	yieldAmount: string;
	difficulty: string;
	image: string;
	ingredients: string[];
	status: string;
}

export interface ScheduleShift {
	id: number;
	timeSlot: string;
	product: string;
	productId: number;
	status: string;
	batches: number;
}

export interface Schedule {
	id: number;
	date: string;
	shifts: ScheduleShift[];
}

export interface Alert {
	id: number;
	type: string;
	message: string;
	time: string;
	isRead: boolean;
}

export interface ProfileResponse {
	id: number;
	name: string;
	email: string;
	role: string;
}

export interface ProfileUpdateRequest {
	name: string;
	email: string;
}

export interface PasswordUpdateRequest {
	currentPassword: string;
	newPassword: string;
}
