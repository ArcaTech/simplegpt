import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTerminal, faCircleCheck, faCircleXmark, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { trunc } from '../helpers';

export interface ConversationEditorProps {
	modelList: string[];
	selectedModel?: string;
	systemMessage?: string;
	setSelectedModel: (model: string) => void;
	setSystemMessage: (content?: string) => void;
}

/**
 * ConversationEditor component.
 */
export default function ConversationEditor({
	modelList,
	selectedModel,
	systemMessage,
	setSelectedModel,
	setSystemMessage,
}: ConversationEditorProps) {
	// This state is for the text that is currently being edited.
	// Once editing is finished, setMessage (passed in), is called to
	// store the new system message.
	const [editing, setEditing] = useState(false);
	const [editedMessage, setEditedMessage] = useState(systemMessage);

	const getMessageField = () => {
		if (editing) {
			return (
				<input
					className="input is-small"
					type="text"
					value={editedMessage}
					placeholder="System Message"
					onChange={e => setEditedMessage(e.target.value)} />
			);
		}
		return `System Message: ${systemMessage ? trunc(systemMessage, 60) : 'None'}`;
	};

	const startEditing = () => {
		setEditedMessage(systemMessage);
		setEditing(true);
	};

	const saveEdit = () => {
		setEditedMessage(editedMessage);
		setEditing(false);
	};

	const cancelEdit = () => {
		setEditing(false);
		setEditedMessage(systemMessage);
	};

	const clearMessage = () => {
		setEditedMessage('');
		setEditing(false);
	}

	return (
		<div className="has-text-grey-light has-background-light is-flex is-flex-direction-row is-align-items-center">
			<span className="m-2">
				<FontAwesomeIcon icon={faTerminal} size="xs" />
			</span>
			<span className="m-2">
				<div className="select is-small">
					<select onChange={e => setSelectedModel(e.target.value)}>
						<option value="">Default Model</option>
						{modelList.map(model => <option selected={model === selectedModel} value={model}>{model}</option>)}
					</select>
				</div>
			</span>
			<span className="m-2 is-flex-grow-1 is-size-7">{getMessageField()}</span>
			{editing && (
				<div className="buttons mx-2">
					<button className="button is-small is-success" onClick={saveEdit}>
						<FontAwesomeIcon icon={faCircleCheck} />
					</button>
					<button className="button is-small is-warning" onClick={cancelEdit}>
						<FontAwesomeIcon icon={faCircleXmark} />
					</button>
					<button className="button is-small is-danger" onClick={clearMessage}>
						<FontAwesomeIcon icon={faTrashCan} />
					</button>
				</div>
			)}
			{!editing && (
				<button className="m-2 button is-small" onClick={startEditing}>
					<FontAwesomeIcon icon={faPenToSquare} />
				</button>
			)}
		</div>
	);
}
