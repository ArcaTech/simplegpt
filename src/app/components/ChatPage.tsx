import React, { useState, useEffect, useReducer, useMemo } from 'react';
import { Message } from '../../types';
import Conversations from './Conversations';
import ChatInterface from './ChatInterface';
import { generateId } from '../helpers';

import { initialConversationsState, conversationsReducer } from '../state';

export default function ChatPage() {
	const [{ conversations }, dispatch] = useReducer(conversationsReducer, initialConversationsState);
	const [activeConversation, setActiveConversation] = useState('');

	const conversation = useMemo(() => {
		return conversations.find(conversation => conversation.id === activeConversation);
	}, [conversations, activeConversation]);

	useEffect(() => {
		if (conversations.length === 0) {
			switchToNewConversation();
		}
	}, []);

	const switchToNewConversation = () => {
		const id = generateId();
		dispatch({
			type: 'add-conversation',
			conversationId: id,
		});
		setActiveConversation(id);
	};

	const switchConversations = (id: string) => {
		setActiveConversation(id);
		dispatch({
			type: 'clear-conversation-unread',
			conversationId: id,
		});
	};

	const clearConversations = () => {
		dispatch({
			type: 'clear-conversations',
		});
		switchToNewConversation();
	};

	const setInput = (conversationId: string, input: string) => {
		dispatch({
			type: 'set-conversation-input',
			conversationId,
			input,
		});
	};

	const setLoading = (conversationId: string, loading: boolean) => {
		dispatch({
			type: 'set-conversation-loading',
			conversationId,
			loading,
		});
	};

	const setError = (conversationId: string, error?: string) => {
		dispatch({
			type: 'set-conversation-error',
			conversationId,
			error,
		});
	};

	const addMessage = (conversationId: string, message: Message) => {
		dispatch({
			type: 'add-message',
			payload: {
				conversationId,
				messageId: message.id,
				role: message.role,
				handle: message.handle,
				content: message.content,
			},
		});
	};

	const updateMessage = (conversationId: string, messageId: string, content: string) => {
		dispatch({
			type: 'append-message',
			payload: {
				conversationId,
				messageId,
				content,
			}
		});
	};

	return (
		<div className="columns">
			<div className="column is-one-quarter">
				<Conversations
					conversations={conversations}
					activeConversation={activeConversation}
					setActiveConversation={switchConversations}
					newConversation={switchToNewConversation}
					clearConversations={clearConversations} />
			</div>
			<div className="column">
				{conversation &&
					<ChatInterface
						conversation={conversation}
						setInput={setInput}
						setLoading={setLoading}
						setError={setError}
						addMessage={addMessage}
						updateMessage={updateMessage} />}
			</div>
		</div>
	);
}

/*
const sendChat = async (conversation: Conversation) => {
		if (!conversation) return;
		if (conversation.input === '') return;

		const conversationId = conversation.id;

		dispatch({
			type: 'set-conversation-error',
			conversationId,
		});
		dispatch({
			type: 'set-conversation-loading',
			conversationId,
			loading: true,
		});

		const messageId = generateId();

		const userMessage = {
			id: messageId,
			role: 'user',
			handle: 'You',
			content: conversation.input,
			date: new Date(),
		};

		dispatch({
			type: 'set-conversation-input',
			conversationId,
			input: '',
		});
		dispatch({
			type: 'add-message',
			payload: userMessage,
		});
		dispatch({
			type: 'add-message-conversation',
			conversationId,
			messageId,
		});

		const chatMessages = messageList.map(message => {
			return {
				role: message.role,
				content: message.content,
			};
		});

		try {
			const assistantMessage = await doChat([
				...chatMessages,
				userMessage,
			]);
			const assistantMessageId = generateId();

			dispatch({
				type: 'add-message',
				payload: {
					...assistantMessage,
					id: assistantMessageId,
					handle: 'Bot',
				},
			});
			dispatch({
				type: 'add-message-conversation',
				conversationId,
				messageId: assistantMessageId,
			});
		} catch (err) {
			console.error(err);
			setError('Server error');
		}

		dispatch({
			type: 'set-conversation-loading',
			conversationId,
			loading: false,
		});
	};
*/
