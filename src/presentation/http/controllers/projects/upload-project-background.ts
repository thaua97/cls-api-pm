import { z } from 'zod';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { PrismaProjectsRepository } from '@/infra/prisma/repositories/prisma-projects-repository';
import { UploadProjectBackgroundUseCase } from '@/application/use-cases/projects/upload-project-background-use-case';
import { BadRequestError } from '@/shared/errors/bad-request-error';
import { projectToHttp } from '@/application/mappers/project-to-http';

export async function uploadProjectBackground(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const paramsSchema = z.object({
		id: z.string().uuid(),
	});

	const { id } = paramsSchema.parse(request.params);
	const userId = (request.user as { sub: string }).sub;

	const file = await request.file();

	if (!file) {
		throw new BadRequestError('Missing file');
	}

	const allowedMimeTypes = new Set(['image/png', 'image/jpeg']);
	if (!allowedMimeTypes.has(file.mimetype)) {
		throw new BadRequestError(
			'Invalid file type. Only PNG and JPEG are allowed',
		);
	}

	const extension = file.mimetype === 'image/png' ? 'png' : 'jpg';
	const relativePath = path.join('projects', id, `background.${extension}`);
	const absolutePath = path.resolve('uploads', relativePath);

	await mkdir(path.dirname(absolutePath), { recursive: true });

	const buffer = await file.toBuffer();
	await writeFile(absolutePath, buffer);

	const projectsRepository = new PrismaProjectsRepository();
	const useCase = new UploadProjectBackgroundUseCase(projectsRepository);

	const { project } = await useCase.execute(userId, id, {
		background_url: relativePath,
	});

	return reply.status(200).send({ project: projectToHttp(project) });
}
