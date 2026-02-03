import { z } from 'zod';
import type { FastifyReply, FastifyRequest } from 'fastify';

import { PrismaProjectsRepository } from '@/infra/prisma/repositories/prisma-projects-repository';
import { CreateProjectUseCase } from '@/application/use-cases/projects/create-project-use-case';

export async function createProject(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const bodySchema = z.object({
		name: z.string().min(1),
		client: z.string().min(1),
		startDate: z.coerce.date(),
		endDate: z.coerce.date(),
	});

	const userId = (request.user as { sub: string } | undefined)?.sub;
	if (!userId) {
		return reply.status(401).send({
			code: 'UNAUTHORIZED',
			message: 'Invalid token',
		});
	}

	const { name, client, startDate, endDate } = bodySchema.parse(request.body);

	const projectsRepository = new PrismaProjectsRepository();
	const useCase = new CreateProjectUseCase(projectsRepository);

	const { projectId } = await useCase.execute({
		name,
		client,
		start_date: startDate,
		end_date: endDate,
		user_id: userId,
	});

	return reply.status(201).send({ id: projectId });
}
