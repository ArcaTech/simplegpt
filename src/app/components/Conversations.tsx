import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Conversation } from '../../types';
import ConversationPreview from './ConversationPreview';

export interface ConversationsProps {
	conversations: Conversation[];
	activeConversation: string;
	setActiveConversation: (id: string) => void;
	newConversation: () => void;
	clearConversations: () => void;
}

/**
 * Conversations component.
 * Displays the list of conversations and provides the interface
 * for creating, selecting, and removing conversations.
 */
export default function Conversations({
	conversations,
	activeConversation,
	setActiveConversation,
	newConversation,
	clearConversations,
}: ConversationsProps) {
	return (
		<div>
			<div className="title is-4">Conversations</div>
			<div className="buttons">
				<button className="button is-light is-small" onClick={() => newConversation()}>
					<span className="icon is-small"><FontAwesomeIcon icon={faCirclePlus} /></span>
					<span>New</span>
				</button>
				<button className="button is-light is-small is-danger" onClick={() => clearConversations()}>
					<span className="icon is-small"><FontAwesomeIcon icon={faTrashCan} /></span>
					<span>Clear</span>
				</button>
			</div>
			<div>
				{conversations.map(conversation => {
					const isActive = conversation.id === activeConversation;
					const className = `conversation p-2 my-2 has-background-light ${isActive ? 'has-active-border' : ''}`;
					return (
						<div key={conversation.id} className={className} onClick={() => setActiveConversation(conversation.id)}>
							<ConversationPreview conversation={conversation} />
						</div>
					);
				})}
			</div>
		</div>
	);
}
