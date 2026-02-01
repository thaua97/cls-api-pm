import type {
	ListProjectsParams,
	Project,
	ProjectRepository,
	ProjectSort,
	CreateProjectParams,
	UpdateProjectParams,
} from '@/domain/repositories/project-repository';

import { prisma } from '../prisma';

function sortToOrderBy(sort: ProjectSort | undefined) {
	if (sort === 'startDate_desc') {
		return { start_date: 'desc' as const };
	}

	if (sort === 'endDate_asc') {
		return { end_date: 'asc' as const };
	}

	return { name: 'asc' as const };
}

export class PrismaProjectsRepository implements ProjectRepository {
	async create(data: CreateProjectParams): Promise<Project> {
		return await prisma.project.create({
			data: {
				name: data.name,
				description: data.description ?? null,
				start_date: data.start_date,
				end_date: data.end_date,
			},
		});
	}

	async findById(id: string): Promise<Project | null> {
		return await prisma.project.findUnique({
			where: { id },
		});
	}

	async update(id: string, data: UpdateProjectParams): Promise<Project> {
		return await prisma.project.update({
			where: { id },
			data: {
				...(data.name !== undefined ? { name: data.name } : {}),
				...(data.description !== undefined
					? { description: data.description }
					: {}),
				...(data.start_date !== undefined
					? { start_date: data.start_date }
					: {}),
				...(data.end_date !== undefined ? { end_date: data.end_date } : {}),
				...(data.is_favorite !== undefined
					? { is_favorite: data.is_favorite }
					: {}),
			},
		});
	}

	async delete(id: string): Promise<void> {
		await prisma.project.delete({
			where: { id },
		});
	}

	async list(params: ListProjectsParams): Promise<Project[]> {
		const where = {
			...(params.favorites === true ? { is_favorite: true } : {}),
			...(params.query
				? {
					OR: [
						{ name: { contains: params.query, mode: 'insensitive' as const } },
						{
							description: {
								contains: params.query,
								mode: 'insensitive' as const,
							},
						},
					],
				}
				: {}),
		};

		return await prisma.project.findMany({
			where,
			orderBy: sortToOrderBy(params.sort),
		});
	}
}
