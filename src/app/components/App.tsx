import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNodes, faComments, faFileImage } from '@fortawesome/free-solid-svg-icons';
import ChatPage from './ChatPage';
import ImagePage from './ImagePage';

/**
 * Main (App) component.
 * Manages tab state and displays either the ChatPage or ImagePage
 * components depending on the selected tab.
 */
export default function App() {
	// Clicking on one of the tab headers stores that index here.
	// The tabs are hardcoded 0 and 1, and the functions that return classes
	// compare the hardcoded index with the stored tabIndex.
	const [tabIndex, setTabIndex] = useState<number>(0);

	// If the given tab index is the active one, return the `is-active` class name.
	const getTabClassName = (index: number) => {
		if (tabIndex === index) return 'is-active';
		return '';
	};

	// If the given tab index is NOT the active one, return the 'is-hidden' class name.
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
