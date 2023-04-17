import React, { useState, useCallback } from 'react';
import { marked } from 'marked';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { Conversation, ChatMessage } from '../../shared/types';
import { doChat } from '../api';
import { trunc } from '../helpers';

export interface ChatInterfaceProps {
	conversation?: Conversation;
	addChatMessage: (id: string, message: ChatMessage) => void;
}

export default function ChatInterface({ conversation, addChatMessage }: ChatInterfaceProps) {
	const [loading, setLoading] = useState(false);
	const [textContent, setTextContent] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const buttonClass = `button is-primary ${loading ? 'is-loading' : ''}`;

	const prompt = conversation?.prompt ? trunc(conversation.prompt, 20) : '';
	const messages = conversation?.messages ?? [];

	const sendChat = async () => {
		if (!conversation) return;
		if (textContent.trim() === '') return;

		setErrorMessage('');
		setLoading(true);

		const content = textContent;
		setTextContent('');

		const id = conversation.id;
		const userMessage = {
			id: window.crypto.randomUUID(),
			role: 'user',
			handle: 'You',
			content,
			date: new Date(),
		};

		addChatMessage(id, userMessage);

		try {
			const assistantMessage = await doChat([
				...messages,
				userMessage,
			]);

			addChatMessage(id, assistantMessage);
		} catch (err) {
			console.error(err);
			setErrorMessage('Server error');
		}

		setLoading(false);
	};

	return (
		<div className="chat-interface">
			<div className="has-text-light is-size-7">{prompt}</div>
			<div className="chat-conversation has-background-light p-2">
				{messages.map(message => {
					return (
						<div key={message.id} className="box">
							<div dangerouslySetInnerHTML={{ __html: marked.parse(message.content) }}></div>
							<div className="has-text-weight-semibold mt-2">{message.handle}</div>
						</div>
					);
				})}
				{errorMessage && (
					<div className="box has-text-danger">
						<FontAwesomeIcon icon={faCircleExclamation} />
						{errorMessage}
					</div>
				)}
			</div>
			<div>
				<textarea
					className="textarea"
					value={textContent}
					onChange={e => setTextContent(e.target.value)}
					placeholder="Say something if you want"
				></textarea>
				<br />
				<button disabled={loading} className={buttonClass} onClick={() => sendChat()}>
					<span className="icon is-small"><FontAwesomeIcon icon={faComment} /></span>
					<span>Send</span>
				</button>
			</div>
		</div>
	)
}
