export interface Message {
	id: string;
	role: string;
	handle: string;
	content: string;
	date: Date;
}

export interface Conversation {
	id: string;
	title?: string;
	prompt?: string;
	error?: string;
	unread: number;
	date: Date;
	loading: boolean;
	input: string;
	messages: Message[];
}
