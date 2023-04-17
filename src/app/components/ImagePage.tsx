import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { ImageContainer } from '../../shared/types';
import { doImageGeneration } from '../api';

export default function ImagePage() {
	const [prompt, setPrompt] = useState('');
	const [loading, setLoading] = useState(false);
	const [imageContainers, setImageContainers] = useState<ImageContainer[]>([]);
	const buttonClass = `button is-primary ${loading ? 'is-loading' : ''}`;

	const sendImageGeneration = async () => {
		const p = prompt.trim();
		if (p === '') return;

		setLoading(true);

		const image = await doImageGeneration(prompt);

		setLoading(false);
		setImageContainers([
			...imageContainers,
			{
				prompt: p,
				image,
			}
		]);
	};

	return (
		<div className="is-flex is-flex-direction-column">
			<div className="is-flex-grow-1">
				{imageContainers.map(container => <figure><img src={container.image.url} /><figcaption>{container.prompt}</figcaption></figure>)}
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
