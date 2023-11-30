import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import ConversationEditor from './ConversationEditor';
import ImageListEditor from './ImageListEditor';
import AddImageControl from './AddImageControl';
import MessageView from './MessageView';
import { Conversation, Message } from '../../types';
import { doChat, doStream } from '../api';
import { generateId, isVisionModel, messagesToChatMessages } from '../helpers';
import { MessageImage } from '../../types/chat';

export interface ChatInterfaceProps {
	conversation: Conversation;
	modelList: string[];
	setInput: (conversationId: string, text: string) => void;
	setLoading: (conversationId: string, loading: boolean) => void;
	setError: (conversationId: string, error?: string) => void;
	addMessage: (conversationId: string, message: Message) => void;
	updateMessage: (conversationId: string, messageId: string, content: string) => void;
	setModel: (conversationId: string, model: string) => void;
	setSystemMessage: (conversationId: string, systemMessage?: string) => void;
	addPendingImage: (conversationId: string, image: MessageImage) => void;
	removePendingImage: (conversationId: string, url: string) => void;
	clearPendingImages: (conversationId: string) => void;
}

/**
 * ChatInterface component.
 * Manages the state of the active conversation.
 */
export default function ChatInterface({
	conversation,
	modelList,
	setInput,
	setLoading,
	setError,
	addMessage,
	updateMessage,
	setModel,
	setSystemMessage,
	addPendingImage,
	removePendingImage,
	clearPendingImages,
}: ChatInterfaceProps) {
	const buttonClass = `button is-primary ${conversation.loading ? 'is-loading' : ''}`;
	const visionEnabled = isVisionModel(conversation.model);
	const hasPendingImages = conversation.pendingImages.length > 0;

	const onRemoveImage = (url: string) => {
		removePendingImage(conversation.id, url);
	};

	const onAddImage = (image: MessageImage) => {
		addPendingImage(conversation.id, image);
	}

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
			images: conversation.pendingImages,
			date: new Date(),
		};

		setInput(conversationId, '');
		addMessage(conversationId, userMessage);
		clearPendingImages(conversationId);

		try {
			// Send the message (including all previous messages to maintain chat history)
			// to the backend and wait for the response
			const assistantMessage = await doChat(messagesToChatMessages([
				...conversation.messages,
				userMessage,
			]), conversation.systemMessage, conversation.model);

			// Add the new message from the backend to the conversation history
			addMessage(conversationId, {
				...assistantMessage,
				id: generateId(),
				handle: 'Bot',
				date: new Date(),
				images: [],
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
			images: conversation.pendingImages,
			date: new Date(),
		};

		setInput(conversationId, '');
		addMessage(conversationId, userMessage);
		clearPendingImages(conversationId);

		try {
			// Send the message (including all previous messages to maintain chat history)
			// to the backend and get a response that can be turned into a reader
			const response = await doStream(messagesToChatMessages([
				...conversation.messages,
				userMessage,
			]), conversation.systemMessage, conversation.model);

			// Create a new empty message here on the frontend
			// that the stream response can be appended to
			const assistantMessageId = generateId();
			addMessage(conversationId, {
				id: assistantMessageId,
				role: 'assistant',
				handle: 'Bot',
				content: '',
				date: new Date(),
				images: [],
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
			<ConversationEditor
				modelList={modelList}
				selectedModel={conversation.model}
				systemMessage={conversation.systemMessage}
				setSelectedModel={model => setModel(conversation.id, model)}
				setSystemMessage={message => setSystemMessage(conversation.id, message)} />
			<div className="chat-conversation py-3">
				{conversation.messages.filter(message => !!message.content).map(message => {
					return <MessageView key={message.id} message={message} />;
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
					placeholder="Your message"
				></textarea>
				<br />
				{hasPendingImages && (
					<div className="pending-images p-2">
						<div className="has-text-grey is-small">Pending Images</div>
						<ImageListEditor
							images={conversation.pendingImages}
							onRemoveImage={onRemoveImage} />
					</div>
				)}
				<div className="field is-grouped">
					<p className="control">
						<button
							disabled={conversation?.loading ?? false}
							className={buttonClass}
							onClick={() => sendChatStream()}
						>
							<span className="icon is-small"><FontAwesomeIcon icon={faComment} /></span>
							<span>Send</span>
						</button>
					</p>
					{visionEnabled && <AddImageControl onAddImage={onAddImage} />}
				</div>
			</div>
		</div>
	)
}
