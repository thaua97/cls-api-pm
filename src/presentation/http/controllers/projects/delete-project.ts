import { z } from 'zod';
import type { FastifyReply, FastifyRequest } from 'fastify';

import { PrismaProjectsRepository } from '@/infra/prisma/repositories/prisma-projects-repository';
import { DeleteProjectUseCase } from '@/application/use-cases/projects/delete-project-use-case';

export async function deleteProject(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const paramsSchema = z.object({
		id: z.string().uuid(),
	});

	const { id } = paramsSchema.parse(request.params);
	const userId = (request.user as { sub: string }).sub;

	const projectsRepository = new PrismaProjectsRepository();
	const useCase = new DeleteProjectUseCase(projectsRepository);

	await useCase.execute(userId, id);

	return reply.status(204).send();
}
