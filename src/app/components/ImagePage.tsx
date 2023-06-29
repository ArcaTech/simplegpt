import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { ImageContainer } from '../../types';
import { doImageGeneration } from '../api';
import { generateId } from '../helpers';

/**
 * ImagePage component.
 * Sends requests to the /images endpoint and
 * manages the list of ImageContainers (containing the generated image
 * and the text of the prompt that was used).
 */
export default function ImagePage() {
	const [prompt, setPrompt] = useState('');
	const [loading, setLoading] = useState(false);
	const [imageContainers, setImageContainers] = useState<ImageContainer[]>([]);
	const buttonClass = `button is-primary ${loading ? 'is-loading' : ''}`;

	const sendImageGeneration = async () => {
		const p = prompt.trim();
		if (p === '') return;

		setLoading(true);

		try {
			const image = await doImageGeneration(prompt);
			setPrompt('');

			setImageContainers([
				...imageContainers,
				{
					id: generateId(),
					prompt: p,
					image,
				}
			]);
		} catch (err) {
			console.error(err);
		}

		setLoading(false);
	};

	return (
		<div className="is-flex is-flex-direction-column">
			<div className="buttons">
				<button className="button is-light is-small is-danger" onClick={() => setImageContainers([])}>
					<span className="icon is-small"><FontAwesomeIcon icon={faTrashCan} /></span>
					<span>Clear</span>
				</button>
			</div>
			<div className="is-flex-grow-1 p-2">
				{imageContainers.map(container => {
					return (
						<div key={container.id} className="box">
							<figure className="image" style={{ maxWidth: '500px', margin: 'auto' }}>
								<img src={container.image.url} />
								<figcaption>{container.prompt}</figcaption>
							</figure>
						</div>
					);
				})}
			</div>
			<div>
				<textarea
					className="textarea"
					value={prompt}
					onChange={e => setPrompt(e.target.value)}
					placeholder="Your image prompt"
				></textarea>
				<br />
				<button disabled={loading} className={buttonClass} onClick={() => sendImageGeneration()}>
					<span className="icon is-small"><FontAwesomeIcon icon={faComment} /></span>
					<span>Send</span>
				</button>
			</div>
		</div>
	);
}
