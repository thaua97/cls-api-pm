import type { FastifyReply, FastifyRequest } from 'fastify';

import { UnauthorizedError } from '@/shared/errors/unauthorized-error';

export async function ensureAuthenticated(
	request: FastifyRequest,
	_reply: FastifyReply,
) {
	try {
		await request.jwtVerify();
	} catch {
		throw new UnauthorizedError();
	}
}
