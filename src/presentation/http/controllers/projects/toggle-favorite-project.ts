import { z } from 'zod';
import type { FastifyReply, FastifyRequest } from 'fastify';

import { PrismaProjectsRepository } from '@/infra/prisma/repositories/prisma-projects-repository';
import { ToggleFavoriteProjectUseCase } from '@/application/use-cases/projects/toggle-favorite-project-use-case';
import { projectToHttp } from '@/application/mappers/project-to-http';

export async function toggleFavoriteProject(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const paramsSchema = z.object({
		id: z.string().uuid(),
	});

	const { id } = paramsSchema.parse(request.params);

	const projectsRepository = new PrismaProjectsRepository();
	const useCase = new ToggleFavoriteProjectUseCase(projectsRepository);

	const { project } = await useCase.execute(id);

	return reply.status(200).send({ project: projectToHttp(project) });
}
