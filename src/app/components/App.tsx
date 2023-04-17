import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNodes, faComments, faFileImage } from '@fortawesome/free-solid-svg-icons';
import ChatPage from './ChatPage';
import ImagePage from './ImagePage';

export default function App() {
	const [tabIndex, setTabIndex] = useState<number>(0);

	const getTabClassName = (index: number) => {
		if (tabIndex === index) return 'is-active';
		return '';
	};

	const getContentClassName = (index: number) => {
		if (tabIndex === index) return '';
		return 'is-hidden';
	};

	return (
		<section className="section" style={{ height: '100vh', maxHeight: '100vh' }}>
			<h1 className="title">
				<FontAwesomeIcon icon={faCircleNodes} />
				SimpleGPT
			</h1>
			<div className="tabs">
				<ul>
					<li className={getTabClassName(0)}>
						<a onClick={() => setTabIndex(0)}>
							<span className="icon is-small"><FontAwesomeIcon icon={faComments} /></span>
							<span>Chat</span>
						</a>
					</li>
					<li className={getTabClassName(1)}>
						<a onClick={() => setTabIndex(1)}>
							<span className="icon is-small"><FontAwesomeIcon icon={faFileImage} /></span>
							<span>Image Generation</span>
						</a>
					</li>
				</ul>
			</div>
			<div className="content">
				<div className={getContentClassName(0)}><ChatPage /></div>
				<div className={getContentClassName(1)}><ImagePage /></div>
			</div>
		</section>
	);
}
