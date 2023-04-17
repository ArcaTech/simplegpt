import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import '../scss/index.scss';

const appElement = document.getElementById('app');
if (appElement) {
	const root = createRoot(appElement);
	root.render(<App />);
}
