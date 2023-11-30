import { Express, Request } from 'express';
import { body, matchedData } from 'express-validator';
import {
	getOpenAIClient,
	getChatCompletionRequestMessages,
	getMessageFromChatCompletion,
	getImageFromImageResponse,
} from './api';
import {
	apiError,
	noResponseError,
	badRequestError,
	getValidator,
} from '../errors';
import { defaultSystemMessage } from '../messages';
import {
	ImageGenerationResponse,
	ChatResponse,
    ModelsResponse,
} from '../../types';

export const registerOpenaiHandlers = (app: Express) => {
    const defaultChatModel = process.env.DEFAULT_CHAT_MODEL ?? 'gpt-3.5-turbo';
    const defaultImageModel = process.env.DEFAULT_IMAGE_MODEL ?? 'dall-e-2';

    const openai = getOpenAIClient();
    const validator = getValidator();

    app.get('/models', async (req: Request<{}, ModelsResponse, {}>, res) => {
        const models = await openai.models.list();
        res.json({
            models: models.data.map((model) => model.id),
        });
    });

    // The /chat endpoint forwards the request to OpenAI
    app.post(
        '/chat',
        body('model').optional().trim(),
        body('systemMessage').optional().trim(),
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
            const model = data.model || defaultChatModel;
            const systemMessage = data.systemMessage || defaultSystemMessage;
            const messages = getChatCompletionRequestMessages(data.messages);

            try {
                // Send the system message (or the defaultSystemMessage if it's empty)
                // and all messages from the API request to OpenAI
                const chatCompletion = await openai.chat.completions.create({
                    model,
                    temperature: 0.9,
                    top_p: 1,
                    n: 1,
                    messages: [
                        {
                            role: 'system',
                            content: systemMessage,
                        },
                        ...messages,
                    ],
                    max_tokens: 1000,
                });

                const message = getMessageFromChatCompletion(chatCompletion);

                // Pass the formatted response from OpenAI back down to the frontend
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

    // The /chat-stream endpoint forwards the request to OpenAI
    app.post(
        '/chat-stream',
        body('model').optional().trim(),
        body('systemMessage').optional().trim(),
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
            const model = data.model || defaultChatModel;
            const systemMessage = data.systemMessage || defaultSystemMessage;
            const messages = getChatCompletionRequestMessages(data.messages);

            try {
                // Send the prompt (or the defaultPrompt if it's empty)
                // and all messages from the API request to OpenAI
                const stream = await openai.chat.completions.create({
                    model,
                    stream: true,
                    temperature: 0.9,
                    top_p: 1,
                    n: 1,
                    messages: [
                        {
                            role: 'system',
                            content: systemMessage,
                        },
                        ...messages,
                    ],
                    max_tokens: 1000,
                });

                res.writeHead(200, {
                    'Content-Type': 'text/event-stream',
                    'Connection': 'keep-alive',
                    'Cache-Control': 'no-cache',
                });

                for await (const chunk of stream) {
                    const delta = chunk.choices[0].delta;
                    if (delta && delta.content) {
                        res.write(delta.content);
                    }

                    const finish = chunk.choices[0].finish_reason;
                    if (finish && finish === 'stop') {
                        res.end();
                        return;
                    }
                }

                res.end();
            } catch (err) {
                res.send({
                    error: apiError,
                });
            }
        }
    );

    // The /image endpoint forwards the request to OpenAI
    app.post(
        '/image',
        body('prompt').notEmpty(),
        body('model').optional().trim(),
        async (req: Request<{}, ImageGenerationResponse, {}>, res) => {
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
            const model = data.model || defaultImageModel;

            try {
                const response = await openai.images.generate({
                    prompt,
                    model,
                    n: 1,
                    size: "1024x1024",
                });

                const image = getImageFromImageResponse(response);

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
        }
    );
};
