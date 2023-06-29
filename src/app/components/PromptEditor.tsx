import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTerminal, faCircleCheck, faCircleXmark, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { trunc } from '../helpers';

export interface PromptEditorProps {
	prompt?: string;
	setPrompt: (prompt?: string) => void;
}

/**
 * PromptEditor component.
 * One per conversation. Displays either the text of the stored prompt
 * or an input field to edit it. 
 */
export default function PromptEditor({ prompt, setPrompt }: PromptEditorProps) {
	// This state is for the text that is currently being edited.
	// Once editing is finished, setPrompt (passed in), is called to
	// store the new prompt.
	const [editing, setEditing] = useState(false);
	const [editedPrompt, setEditedPrompt] = useState(prompt);

	const getPromptField = () => {
		if (editing) {
			return <input className="input is-normal" type="text" value={editedPrompt} onChange={e => setEditedPrompt(e.target.value)} />;
		}
		return `Prompt: ${prompt ? trunc(prompt, 60) : 'None'}`;
	};

	const startEditing = () => {
		setEditedPrompt(prompt);
		setEditing(true);
	};

	const saveEdit = () => {
		setPrompt(editedPrompt);
		setEditing(false);
	};

	const cancelEdit = () => {
		setEditing(false);
		setEditedPrompt(prompt);
	};

	const clearPrompt = () => {
		setPrompt();
		setEditedPrompt('');
		setEditing(false);
	}

	return (
		<div className="has-text-grey-light has-background-light is-flex is-flex-direction-row is-align-items-center">
			<span className="m-2">
				<FontAwesomeIcon icon={faTerminal} />
			</span>
			<span className="m-2 is-flex-grow-1">{getPromptField()}</span>
			{editing && (
				<div className="buttons m-2">
					<button className="button is-small is-success" onClick={saveEdit}>
						<FontAwesomeIcon icon={faCircleCheck} />
					</button>
					<button className="button is-small is-warning" onClick={cancelEdit}>
						<FontAwesomeIcon icon={faCircleXmark} />
					</button>
					<button className="button is-small is-danger" onClick={clearPrompt}>
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
