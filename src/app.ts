import fastify from 'fastify';
import jwt from '@fastify/jwt';
import { ZodError } from 'zod';
import type { FastifyReply, FastifyRequest } from 'fastify';

import { env } from './env';
import { appRoutes } from './presentation/http/routes';
import { AppError } from './shared/errors/app-error';

export const app = fastify();

app.register(jwt, {
	secret: env.JWT_SECRET,
});

app.register(appRoutes);

app.setErrorHandler(
	(error: unknown, _request: FastifyRequest, reply: FastifyReply) => {
		if (error instanceof ZodError) {
			return reply.status(400).send({
				code: 'VALIDATION_ERROR',
				message: 'Validation error',
				details: (error as ZodError).format(),
			});
		}

		if (error instanceof AppError) {
			return reply.status(error.statusCode).send({
				code: error.code,
				message: error.message,
				details: error.details,
			});
		}

		if (env.NODE_ENV !== 'test') {
			console.error(error);
		}

		return reply.status(500).send({
			code: 'INTERNAL_SERVER_ERROR',
			message: 'Internal server error',
		});
	},
);
