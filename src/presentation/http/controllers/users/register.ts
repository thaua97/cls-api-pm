import { z } from 'zod';
import type { FastifyReply, FastifyRequest } from 'fastify';

import { PrismaUsersRepository } from '@/infra/prisma/repositories/prisma-users-repository';
import { RegisterUserUseCase } from '@/application/use-cases/users/register-user-use-case';

export async function register(request: FastifyRequest, reply: FastifyReply) {
	const registerBodySchema = z.object({
		name: z.string().min(1),
		email: z.string().email(),
		password: z.string().min(6),
	});

	const { name, email, password } = registerBodySchema.parse(request.body);

	const usersRepository = new PrismaUsersRepository();
	const registerUserUseCase = new RegisterUserUseCase(usersRepository);

	const { userId } = await registerUserUseCase.execute({ name, email, password });

	return reply.status(201).send({ id: userId });
}
