import { ServerError } from '../shared/types';

export const apiError: ServerError = {
	code: 'openai-api',
	message: 'OpenAI: API error',
};

export const noResponseError: ServerError = {
	code: 'openai-no-response',
	message: 'OpenAI: No response',
};

export const badRequestError: ServerError = {
	code: 'bad-request',
	message: 'Bad request',
};
