import { z } from 'zod';
import type { FastifyReply, FastifyRequest } from 'fastify';

import { PrismaUsersRepository } from '@/infra/prisma/repositories/prisma-users-repository';
import { AuthenticateUseCase } from '@/application/use-cases/auth/authenticate-use-case';

export async function login(request: FastifyRequest, reply: FastifyReply) {
	const loginBodySchema = z.object({
		email: z.string().email(),
		password: z.string().min(6),
	});

	const { email, password } = loginBodySchema.parse(request.body);

	const usersRepository = new PrismaUsersRepository();
	const authenticateUseCase = new AuthenticateUseCase(usersRepository);

	const { userId } = await authenticateUseCase.execute({ email, password });

	const token = await reply.jwtSign({}, { sign: { sub: userId } });

	return reply.status(200).send({ token });
}
