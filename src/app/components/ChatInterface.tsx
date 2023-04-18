import React from 'react';
import { marked } from 'marked';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { Conversation, Message } from '../../types';
import { doChat, doStream } from '../api';
import { trunc, generateId, messagesToChatMessages } from '../helpers';

export interface ChatInterfaceProps {
	conversation: Conversation;
	setInput: (conversationId: string, text: string) => void;
	setLoading: (conversationId: string, loading: boolean) => void;
	setError: (conversationId: string, error?: string) => void;
	addMessage: (conversationId: string, message: Message) => void;
	updateMessage: (conversationId: string, messageId: string, content: string) => void;
}

export default function ChatInterface({
	conversation,
	setInput,
	setLoading,
	setError,
	addMessage,
	updateMessage,
}: ChatInterfaceProps) {
	const prompt = conversation.prompt ? trunc(conversation.prompt, 20) : '[No prompt set]';
	const buttonClass = `button is-primary ${conversation.loading ? 'is-loading' : ''}`;

	const sendChat = async () => {
		if (conversation.input === '') return;
		const conversationId = conversation.id;

		setError(conversationId);
		setLoading(conversationId, true);

		const messageId = generateId();
		const userMessage = {
			id: messageId,
			role: 'user',
			handle: 'You',
			content: conversation.input,
			date: new Date(),
		};

		setInput(conversationId, '');
		addMessage(conversationId, userMessage);

		try {
			const assistantMessage = await doChat(messagesToChatMessages([
				...conversation.messages,
				userMessage,
			]));

			addMessage(conversationId, {
				...assistantMessage,
				id: generateId(),
				handle: 'Bot',
				date: new Date(),
			});
		} catch (err) {
			console.error(err);
			setError('Server error');
		}

		setLoading(conversationId, false);
	};

	const sendChatStream = async () => {
		if (conversation.input === '') return;
		const conversationId = conversation.id;

		setError(conversationId);
		setLoading(conversationId, true);

		const messageId = generateId();
		const userMessage = {
			id: messageId,
			role: 'user',
			handle: 'You',
			content: conversation.input,
			date: new Date(),
		};

		setInput(conversationId, '');
		addMessage(conversationId, userMessage);

		try {
			const response = await doStream(messagesToChatMessages([
				...conversation.messages,
				userMessage,
			]));

			const assistantMessageId = generateId();
			addMessage(conversationId, {
				id: assistantMessageId,
				role: 'assistant',
				handle: 'Bot',
				content: '',
				date: new Date(),
			});

			const reader = response.body?.getReader();
			if (reader) {
				while (true) {
					const { value, done } = await reader.read();
					if (done) break;

					const decoder = new TextDecoder();
					updateMessage(conversationId, assistantMessageId, decoder.decode(value));
				}
			}

		} catch (err) {
			console.error(err);
		}

		setLoading(conversationId, false);
	};

	return (
		<div className="chat-interface">
			<div className="has-text-light is-size-7">{prompt}</div>
			<div className="chat-conversation has-background-light p-2">
				{conversation.messages.map(message => {
					return (
						<div key={message.id} className="box">
							<div dangerouslySetInnerHTML={{ __html: marked.parse(message.content) }}></div>
							<div className="has-text-weight-semibold mt-2">{message.handle}</div>
						</div>
					);
				})}
				{conversation.error && (
					<div className="box has-text-danger">
						<FontAwesomeIcon icon={faCircleExclamation} />
						{conversation.error}
					</div>
				)}
			</div>
			<div>
				<textarea
					className="textarea"
					value={conversation.input}
					onChange={e => setInput(conversation.id, e.target.value)}
					placeholder="Say something if you want"
				></textarea>
				<br />
				<button disabled={conversation?.loading ?? false} className={buttonClass} onClick={() => sendChatStream()}>
					<span className="icon is-small"><FontAwesomeIcon icon={faComment} /></span>
					<span>Send</span>
				</button>
			</div>
		</div>
	)
}
