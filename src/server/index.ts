import path from 'path';
import dotenv from 'dotenv';
import express, { Request } from 'express';
import { body, validationResult, matchedData, ResultFactory } from 'express-validator';
import {
	Configuration,
	OpenAIApi,
	CreateChatCompletionResponse,
	CreateImageRequestSizeEnum,
	ChatCompletionRequestMessage,
	ChatCompletionRequestMessageRoleEnum,
	ImagesResponse,
} from 'openai';
import { apiError, noResponseError, badRequestError } from './errors';
import { defaultPrompt } from './prompts';
import {
	ChatMessage,
	Image,
	ImageGenerationApiResponse,
	ChatApiResponse,
	ValidationError,
} from '../shared/types';

const validator: ResultFactory<ValidationError> = validationResult.withDefaults({
	formatter: error => {
		return {
			field: error.param,
			message: error.msg,
		};
	}
});

dotenv.config();
const app = express();
app.use(express.json());
app.use('/static', express.static('static'));

const port = process.env.SERVER_PORT ?? 3000;

const openai = new OpenAIApi(new Configuration({
	apiKey: process.env.OPENAI_KEY,
}));

app.get('/', (_req, res) => {
	res.sendFile(path.resolve(__dirname, '../../static/index.html'));
});

function getMessageFromChatResponse(response: CreateChatCompletionResponse): ChatMessage | undefined {
	if (response.choices && response.choices.length > 0) {
		const message = response.choices[0].message;
		if (message) {
			return {
				id: '',
				role: message.role,
				handle: 'Bot',
				content: message.content,
				date: new Date(),
			};
		}
	}
}

function getImageFromImageResponse(response: ImagesResponse): Image | undefined {
	if (response.data && response.data.length) {
		const url = response.data[0].url;
		if (url) {
			return { url };
		}
	}
}

app.post(
	'/chat',
	body('prompt').optional().trim(),
	body('messages').isArray(),
	async (req: Request<{}, ChatApiResponse, {}>, res) => {
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
		const messages: ChatMessage[] = data.messages;

		const oaMessages: ChatCompletionRequestMessage[] = messages.filter(message => {
			if (message.role && (message.role === 'user' || message.role === 'assistant') && message.content) {
				return true;
			}

			return false;
		}).map(message => {
			return {
				role: message.role === 'user' ? ChatCompletionRequestMessageRoleEnum.User : ChatCompletionRequestMessageRoleEnum.Assistant,
				content: message.content,
			};
		});

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
					...oaMessages,
				],
			});

			const message = getMessageFromChatResponse(response.data);

			if (message) {
				res.send({
					data: message,
				});
			} else {
				res.send({
					error: noResponseError,
				});
			}
		} catch (err) {
			res.send({
				error: apiError,
			});
		}
	}
);

app.post('/image', body('prompt').notEmpty(), async (req: Request<{}, ImageGenerationApiResponse, {}>, res) => {
	const result = validator(req);
	if (!result.isEmpty()) {
		res.send({
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
			res.send({
				data: image,
			});
		} else {
			res.send({
				error: noResponseError,
			});
		}
	} catch (err) {
		res.send({
			error: apiError,
		});
	}
});

app.listen(port, () => {
	console.log(`SimpleGPT server listening on port ${port}`);
});
