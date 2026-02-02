import fastify from 'fastify';
import jwt from '@fastify/jwt';
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import { ZodError } from 'zod';
import type { FastifyReply, FastifyRequest } from 'fastify';
import path from 'node:path';

import { env } from './env';
import { appRoutes } from './presentation/http/routes';
import { AppError } from './shared/errors/app-error';

export const app = fastify();

app.register(jwt, {
	secret: env.JWT_SECRET,
});

app.addHook('onSend', async (request, reply, payload) => {
	if (request.raw.url?.startsWith('/uploads/')) {
		return payload;
	}

	if (reply.getHeader('content-type') === undefined) {
		reply.type('application/json');
	}

	return payload;
});

app.register(multipart, {
	limits: {
		fileSize: 5 * 1024 * 1024,
	},
});

app.register(fastifyStatic, {
	root: path.resolve('uploads'),
	prefix: '/uploads/',
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
