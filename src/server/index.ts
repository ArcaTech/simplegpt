import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import { registerUploadHandler } from './uploads';
import { registerOpenaiHandlers } from './openai';

dotenv.config();
const app = express();
app.use(express.urlencoded({
	extended: true,
	limit: '50mb',
}));
app.use(express.json());
app.use('/static', express.static('static'));

const port = process.env.SERVER_PORT ?? 3000;

// Manually serve the one page that needs to be served
app.get('/', (_req, res) => {
	res.sendFile(path.resolve(__dirname, '../../static/index.html'));
});

registerOpenaiHandlers(app);
registerUploadHandler(app);

app.listen(port, () => {
	console.log(`SimpleGPT server listening on port ${port}`);
});
