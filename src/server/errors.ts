import { validationResult, ResultFactory } from 'express-validator';
import { ServerError, ValidationError } from '../types';

export function getValidator(): ResultFactory<ValidationError> {
	return validationResult.withDefaults({
		formatter: error => {
			return {
				field: error.param,
				message: error.msg,
			};
		}
	});
}

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
