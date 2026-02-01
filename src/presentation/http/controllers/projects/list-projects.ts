import { z } from 'zod';
import type { FastifyReply, FastifyRequest } from 'fastify';

import { PrismaProjectsRepository } from '@/infra/prisma/repositories/prisma-projects-repository';
import { ListProjectsUseCase } from '@/application/use-cases/projects/list-projects-use-case';
import { projectToHttp } from '@/application/mappers/project-to-http';

export async function listProjects(request: FastifyRequest, reply: FastifyReply) {
	const querySchema = z.object({
		favorites: z
			.union([z.literal('true'), z.literal('false')])
			.optional()
			.transform((v) => (v === undefined ? undefined : v === 'true')),
		sort: z
			.enum(['name_asc', 'startDate_desc', 'endDate_asc'])
			.optional()
			.default('name_asc'),
		query: z.string().optional(),
	});

	const { favorites, sort, query } = querySchema.parse(request.query);

	const projectsRepository = new PrismaProjectsRepository();
	const useCase = new ListProjectsUseCase(projectsRepository);

	const { projects } = await useCase.execute({
		sort,
		...(favorites !== undefined ? { favorites } : {}),
		...(query !== undefined ? { query } : {}),
	});

	return reply.status(200).send({
		total: projects.length,
		projects: projects.map(projectToHttp),
	});
}
