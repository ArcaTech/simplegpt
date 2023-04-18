export interface StreamResponseDelta {
	role?: string;
	content?: string;
}

export interface StreamResponseChoicesInner {
	delta: StreamResponseDelta;
	index: number;
	finish_reason: string | null;
}

export interface StreamResponse {
	id: string;
	object: string;
	created: number;
	model: string;
	choices: StreamResponseChoicesInner[];
}
