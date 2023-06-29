import React from 'react';
import { marked } from 'marked';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import PromptEditor from './PromptEditor';
import { Conversation, Message } from '../../types';
import { doChat, doStream } from '../api';
import { generateId, messagesToChatMessages } from '../helpers';

export interface ChatInterfaceProps {
	conversation: Conversation;
	setInput: (conversationId: string, text: string) => void;
	setLoading: (conversationId: string, loading: boolean) => void;
	setError: (conversationId: string, error?: string) => void;
	addMessage: (conversationId: string, message: Message) => void;
	updateMessage: (conversationId: string, messageId: string, content: string) => void;
	setPrompt: (conversationId: string, prompt?: string) => void;
}

/**
 * ChatInterface component.
 * Manages the state of the active conversation.
 */
export default function ChatInterface({
	conversation,
	setInput,
	setLoading,
	setError,
	addMessage,
	updateMessage,
	setPrompt,
}: ChatInterfaceProps) {
	const buttonClass = `button is-primary ${conversation.loading ? 'is-loading' : ''}`;

	// Sends a message to the /chat endpoint, which waits for the full
	// response from OpenAI before returning.
	// Not currently used.
	const sendChat = async () => {
		if (conversation.input === '') return;
		const conversationId = conversation.id;

		setError(conversationId);
		setLoading(conversationId, true);

		const messageId = generateId();
		const userMessage: Message = {
			id: messageId,
			role: 'user',
			handle: 'You',
			content: conversation.input,
			date: new Date(),
		};

		setInput(conversationId, '');
		addMessage(conversationId, userMessage);

		try {
			// Send the message (including all previous messages to maintain chat history)
			// to the backend and wait for the response
			const assistantMessage = await doChat(messagesToChatMessages([
				...conversation.messages,
				userMessage,
			]), conversation.prompt);

			// Add the new message from the backend to the conversation history
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

	// Sends a message to the /chat-stream endpoint, which streams the
	// response from OpenAI.
	const sendChatStream = async () => {
		if (conversation.input === '') return;
		const conversationId = conversation.id;

		setError(conversationId);
		setLoading(conversationId, true);

		const messageId = generateId();
		const userMessage: Message = {
			id: messageId,
			role: 'user',
			handle: 'You',
			content: conversation.input,
			date: new Date(),
		};

		setInput(conversationId, '');
		addMessage(conversationId, userMessage);

		try {
			// Send the message (including all previous messages to maintain chat history)
			// to the backend and get a response that can be turned into a reader
			const response = await doStream(messagesToChatMessages([
				...conversation.messages,
				userMessage,
			]), conversation.prompt);

			// Create a new empty message here on the frontend
			// that the stream response can be appended to
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
				// Wait for eternity (or at least until there's a 'done' response)
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
			<PromptEditor prompt={conversation.prompt} setPrompt={prompt => setPrompt(conversation.id, prompt)} />
			<div className="chat-conversation p-2">
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
