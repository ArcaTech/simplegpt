import React, { useState, useEffect, useReducer, useMemo } from 'react';
import { Message } from '../../types';
import Conversations from './Conversations';
import ChatInterface from './ChatInterface';
import { generateId } from '../helpers';
import { getModels } from '../api';

import { initialConversationsState, conversationsReducer } from '../state';

/**
 * ChatPage component.
 * Manages the conversation content, and displays the Conversations list component and
 * the ChatInterface component for the active conversation.
 */
export default function ChatPage() {
	// This reducer manages the entire conversation (text) state.
	// Functions that call the dispatcher are defined below and passed to
	// the internal components.
	// The actions and reducer for this state are defined in
	// src/state/actions.ts and src/state/reducers.ts
	const [{ conversations }, dispatch] = useReducer(conversationsReducer, initialConversationsState);
	const [activeConversation, setActiveConversation] = useState('');

	// The list of available models pulled from the /models endpoint
	const [modelList, setModelList] = useState<string[]>([]);

	// Cache the active conversation
	const conversation = useMemo(() => {
		return conversations.find(conversation => conversation.id === activeConversation);
	}, [conversations, activeConversation]);

	// If there are no conversations on first load, create one
	useEffect(() => {
		if (conversations.length === 0) {
			switchToNewConversation();
		}
	}, []);

	// Get the list of models one time on component load
	useEffect(() => {
		(async () => {
			try {
				const models = await getModels();
				models.sort();
				setModelList(models.filter(model => model.includes('gpt')));
			} catch (err) {
				console.error(err);
			}
		})();
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

	const setModel = (conversationId: string, model: string) => {
		dispatch({
			type: 'set-conversation-model',
			conversationId,
			model,
		});
	}

	const setSystemMessage = (conversationId: string, content?: string) => {
		dispatch({
			type: 'set-conversation-system-message',
			conversationId,
			content,
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
			<div className="column is-three-quarters">
				{conversation &&
					<ChatInterface
						conversation={conversation}
						modelList={modelList}
						setInput={setInput}
						setLoading={setLoading}
						setError={setError}
						addMessage={addMessage}
						updateMessage={updateMessage}
						setModel={setModel}
						setSystemMessage={setSystemMessage} />}
			</div>
		</div>
	);
}
