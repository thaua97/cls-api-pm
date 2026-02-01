import { z } from 'zod';
import type { FastifyReply, FastifyRequest } from 'fastify';

import { PrismaProjectsRepository } from '@/infra/prisma/repositories/prisma-projects-repository';
import { CreateProjectUseCase } from '@/application/use-cases/projects/create-project-use-case';

export async function createProject(request: FastifyRequest, reply: FastifyReply) {
	const bodySchema = z.object({
		name: z.string().min(1),
		description: z.string().optional().nullable(),
		startDate: z.coerce.date(),
		endDate: z.coerce.date(),
	});

	const { name, description, startDate, endDate } = bodySchema.parse(request.body);

	const projectsRepository = new PrismaProjectsRepository();
	const useCase = new CreateProjectUseCase(projectsRepository);

	const { projectId } = await useCase.execute({
		name,
		description: description ?? null,
		start_date: startDate,
		end_date: endDate,
	});

	return reply.status(201).send({ id: projectId });
}
