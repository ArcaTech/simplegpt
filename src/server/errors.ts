import { validationResult, ResultFactory } from 'express-validator';
import { ServerError, ValidationError } from '../types';

export function getValidator(): ResultFactory<ValidationError> {
	return validationResult.withDefaults<ValidationError>({
		formatter: error => {
			switch (error.type) {
				case 'field':
					return {
						field: error.path,
						message: error.msg,
					};
				case 'unknown_fields':
					return {
						field: error.fields.map(field => field.path).join(', '),
						message: error.msg,
					};
				default:
					return {
						message: error.msg,
					};
			}
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
