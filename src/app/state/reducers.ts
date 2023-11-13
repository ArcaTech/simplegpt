import { Conversation } from '../../types';
import { ConversationAction } from './actions';

export interface ConversationsState {
	conversations: Conversation[];
}

export const initialConversationsState: ConversationsState = {
	conversations: [],
};

export function conversationsReducer(state: ConversationsState, action: ConversationAction): ConversationsState {
	switch (action.type) {
		case 'add-conversation':
			return {
				...state,
				conversations: [
					...state.conversations,
					{
						id: action.conversationId,
						messages: [],
						unread: 0,
						date: new Date(),
						loading: false,
						input: '',
					},
				]
			};
		case 'set-conversation-model':
			return {
				...state,
				conversations: state.conversations.map(conversation => {
					if (conversation.id === action.conversationId) {
						return {
							...conversation,
							model: action.model,
						};
					}
					return conversation;
				}),
			};
		case 'set-conversation-system-message':
			return {
				...state,
				conversations: state.conversations.map(conversation => {
					if (conversation.id === action.conversationId) {
						return {
							...conversation,
							systemMessage: action.content,
						};
					}
					return conversation;
				}),
			};
		case 'set-conversation-error':
			return {
				...state,
				conversations: state.conversations.map(conversation => {
					if (conversation.id === action.conversationId) {
						return {
							...conversation,
							error: action.error,
						};
					}
					return conversation;
				}),
			};
		case 'set-conversation-input':
			return {
				...state,
				conversations: state.conversations.map(conversation => {
					if (conversation.id === action.conversationId) {
						return {
							...conversation,
							input: action.input,
						};
					}
					return conversation;
				}),
			};
		case 'set-conversation-loading':
			return {
				...state,
				conversations: state.conversations.map(conversation => {
					if (conversation.id === action.conversationId) {
						return {
							...conversation,
							loading: action.loading,
						};
					}
					return conversation;
				}),
			};
		case 'clear-conversation-unread':
			return {
				...state,
				conversations: state.conversations.map(conversation => {
					if (conversation.id === action.conversationId) {
						return {
							...conversation,
							unread: 0,
						};
					}
					return conversation;
				}),
			};
		case 'increment-conversation-unread':
			return {
				...state,
				conversations: state.conversations.map(conversation => {
					if (conversation.id === action.conversationId) {
						return {
							...conversation,
							unread: conversation.unread + 1,
						};
					}
					return conversation;
				}),
			}
		case 'clear-conversations':
			return {
				...state,
				conversations: [],
			};
		case 'add-message':
			return {
				...state,
				conversations: state.conversations.map(conversation => {
					if (conversation.id === action.payload.conversationId) {
						return {
							...conversation,
							date: new Date(),
							messages: [
								...conversation.messages,
								{
									id: action.payload.messageId,
									role: action.payload.role,
									handle: action.payload.handle,
									content: action.payload.content,
									date: new Date(),
								},
							],
						};
					}
					return conversation;
				}),
			};
		case 'append-message':
			return {
				...state,
				conversations: state.conversations.map(conversation => {
					if (conversation.id === action.payload.conversationId) {
						return {
							...conversation,
							messages: conversation.messages.map(message => {
								if (message.id === action.payload.messageId) {
									return {
										...message,
										content: message.content += action.payload.content,
									};
								}
								return message;
							}),
						};
					}
					return conversation;
				}),
			}
	}

	return state;
}
