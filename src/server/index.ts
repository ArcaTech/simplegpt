import path from 'path';
import dotenv from 'dotenv';
import { Readable } from 'stream';
import express, { Request } from 'express';
import { body, matchedData } from 'express-validator';
import {
	CreateImageRequestSizeEnum,
	ChatCompletionRequestMessageRoleEnum,
} from 'openai';
import {
	getOpenAIClient,
	getChatCompletionRequestMessages,
	getMessageFromChatResponse,
	getImageFromImageResponse,
} from './api';
import {
	apiError,
	noResponseError,
	badRequestError,
	getValidator,
} from './errors';
import { defaultPrompt } from './prompts';
import {
	ImageGenerationResponse,
	ChatResponse,
	StreamResponse,
} from '../types';

dotenv.config();
const app = express();
app.use(express.json());
app.use('/static', express.static('static'));

const port = process.env.SERVER_PORT ?? 3000;
const openai = getOpenAIClient();
const validator = getValidator();

app.get('/', (_req, res) => {
	res.sendFile(path.resolve(__dirname, '../../static/index.html'));
});

app.post(
	'/chat',
	body('prompt').optional().trim(),
	body('messages').isArray(),
	async (req: Request<{}, ChatResponse, {}>, res) => {
		const result = validator(req);
		if (!result.isEmpty()) {
			res.json({
				error: badRequestError,
				validationErrors: result.array(),
			});
			return;
		}

		const data = matchedData(req);
		const prompt = data.prompt || defaultPrompt;
		const messages = getChatCompletionRequestMessages(data.messages);

		try {
			const response = await openai.createChatCompletion({
				model: 'gpt-3.5-turbo',
				temperature: 0.9,
				top_p: 1,
				n: 1,
				messages: [
					{
						role: ChatCompletionRequestMessageRoleEnum.System,
						content: prompt,
					},
					...messages,
				],
			});

			const message = getMessageFromChatResponse(response.data);

			if (message) {
				res.json({
					data: message,
				});
			} else {
				res.json({
					error: noResponseError,
				});
			}
		} catch (err) {
			res.json({
				error: apiError,
			});
		}
	}
);

app.post(
	'/chat-stream',
	body('prompt').optional().trim(),
	body('messages').isArray(),
	async (req: Request<{}, ChatResponse, {}>, res) => {
		const result = validator(req);
		if (!result.isEmpty()) {
			res.send({
				error: badRequestError,
				validationErrors: result.array(),
			});
			return;
		}

		const data = matchedData(req);
		const prompt = data.prompt || defaultPrompt;
		const messages = getChatCompletionRequestMessages(data.messages);

		try {
			const oaRes = await openai.createChatCompletion({
				model: 'gpt-3.5-turbo',
				stream: true,
				temperature: 0.9,
				top_p: 1,
				n: 1,
				messages: [
					{
						role: ChatCompletionRequestMessageRoleEnum.System,
						content: prompt,
					},
					...messages,
				],
			}, {
				responseType: 'stream',
			});

			res.writeHead(200, {
				'Content-Type': 'text/event-stream',
				'Connection': 'keep-alive',
				'Cache-Control': 'no-cache',
			});

			const stream = oaRes.data as any as Readable;

			stream.on('data', data => {
				const lines = data.toString().split('\n').filter((line: string) => line.trim() !== '');
				for (const line of lines) {
					const message = line.replace(/^data: /, '');
					if (message === '[DONE]') {
						res.end();
						return;
					}
					try {
						const parsed: StreamResponse = JSON.parse(message);
						const delta = parsed.choices[0].delta;
						if (delta && delta.content) {
							res.write(delta.content);
						}

						const finish = parsed.choices[0].finish_reason;
						if (finish && finish === 'stop') {
							res.end();
							return;
						}
					} catch (err) {
						console.error(err);
					}
				}
			});
		} catch (err) {
			res.send({
				error: apiError,
			});
		}
	}
);

app.post('/image', body('prompt').notEmpty(), async (req: Request<{}, ImageGenerationResponse, {}>, res) => {
	const result = validator(req);
	if (!result.isEmpty()) {
		res.json({
			error: badRequestError,
			validationErrors: result.array(),
		});
		return;
	}

	const data = matchedData(req);
	const prompt: string = data.prompt;

	try {
		const response = await openai.createImage({
			prompt,
			n: 1,
			size: CreateImageRequestSizeEnum._1024x1024,
		});

		const image = getImageFromImageResponse(response.data);

		if (image) {
			res.json({
				data: image,
			});
		} else {
			res.json({
				error: noResponseError,
			});
		}
	} catch (err) {
		res.json({
			error: apiError,
		});
	}
});

app.listen(port, () => {
	console.log(`SimpleGPT server listening on port ${port}`);
});
