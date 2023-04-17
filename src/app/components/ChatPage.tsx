import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Conversation, ChatMessage } from '../../shared/types';
import Conversations from './Conversations';
import ChatInterface from './ChatInterface';

export default function ChatPage() {
	const [conversations, setConversations] = useState<Conversation[]>([]);
	const [activeConversation, setActiveConversation] = useState('');
	const conversation = useMemo(
		() => conversations.find(conversation => conversation.id === activeConversation),
		[conversations, activeConversation]
	);

	const switchToNewConversation = () => {
		const id = window.crypto.randomUUID();
		setConversations([
			...conversations,
			{
				id,
				messages: [],
				unread: 0,
				lastUpdated: new Date(),
			},
		]);
		setActiveConversation(id);
	};

	useEffect(() => {
		if (conversations.length === 0) {
			switchToNewConversation();
		}
	}, []);

	const switchConversations = (id: string) => {
		setActiveConversation(id);
		setConversations(conversations.map(conversation => {
			return {
				...conversation,
				unread: 0,
			};
		}));
	};

	const clearConversations = () => {
		setConversations([]);
		switchToNewConversation();
	};

	const addChatMessage = (id: string, message: ChatMessage) => {
		const updatedConversations = conversations.map(conversation => {
			if (conversation.id === id) {
				const unread = id === activeConversation ? conversation.unread : conversation.unread + 1;
				const messages = conversation.messages;
				messages.push(message);

				return {
					...conversation,
					unread,
					lastUpdated: new Date(),
					messages,
				};
			}

			return conversation;
		});

		setConversations(updatedConversations);
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
				<ChatInterface conversation={conversation} addChatMessage={addChatMessage} />
			</div>
		</div>
	);
}
