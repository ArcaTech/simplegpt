export interface MessageImage {
	url: string;
	detail?: 'auto' | 'low' | 'high';
}

export interface Message {
	id: string;
	role: 'user' | 'assistant';
	handle: string;
	content: string | null;
	images: MessageImage[];
	date: Date;
}

export interface Conversation {
	id: string;
	title?: string;
	systemMessage?: string;
	model?: string;
	error?: string;
	unread: number;
	date: Date;
	loading: boolean;
	input: string;
	messages: Message[];
	pendingImages: MessageImage[];
}
