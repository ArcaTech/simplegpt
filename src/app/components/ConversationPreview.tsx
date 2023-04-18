import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Conversation } from '../../types';
import { trunc } from '../helpers';

export interface ConversationPreviewProps {
	conversation: Conversation;
}

function getConversationPreview(conversation: Conversation): string | undefined {
	const messageCount = conversation.messages.length;
	if (messageCount > 0) {
		const last = conversation.messages[messageCount - 1];
		return trunc(`${last.handle}: ${last.content}`, 20);
	}
}

export default function ConversationPreview({ conversation }: ConversationPreviewProps) {
	const preview = getConversationPreview(conversation);
	const title = conversation.title || 'New Conversation';
	const timestamp = `started ${formatDistanceToNow(conversation.date)} ago`;

	return (
		<div>
			<div className="has-text-weight-semibold">{title}</div>
			{preview && <div>{preview}</div>}
			<div className="is-size-7">{timestamp}</div>
		</div>
	);
}
