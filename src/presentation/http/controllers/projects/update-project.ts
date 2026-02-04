import { z } from 'zod';
import type { FastifyReply, FastifyRequest } from 'fastify';

import { PrismaProjectsRepository } from '@/infra/prisma/repositories/prisma-projects-repository';
import { UpdateProjectUseCase } from '@/application/use-cases/projects/update-project-use-case';
import { projectToHttp } from '@/application/mappers/project-to-http';

export async function updateProject(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const paramsSchema = z.object({
		id: z.string().uuid(),
	});

	const bodySchema = z.object({
		name: z.string().min(1).optional(),
		client: z.string().min(1).optional(),
		backgroundUrl: z.literal('').optional(),
		startDate: z.coerce.date().optional(),
		endDate: z.coerce.date().optional(),
		isFavorite: z.boolean().optional(),
	});

	const { id } = paramsSchema.parse(request.params);
	const userId = (request.user as { sub: string }).sub;
	const { name, client, backgroundUrl, startDate, endDate, isFavorite } =
		bodySchema.parse(request.body);

	const projectsRepository = new PrismaProjectsRepository();
	const useCase = new UpdateProjectUseCase(projectsRepository);

	const { project } = await useCase.execute(userId, id, {
		...(name !== undefined ? { name } : {}),
		...(client !== undefined ? { client } : {}),
		...(backgroundUrl !== undefined ? { background_url: null } : {}),
		...(startDate !== undefined ? { start_date: startDate } : {}),
		...(endDate !== undefined ? { end_date: endDate } : {}),
		...(isFavorite !== undefined ? { is_favorite: isFavorite } : {}),
	});

	return reply.status(200).send({ project: projectToHttp(project) });
}
