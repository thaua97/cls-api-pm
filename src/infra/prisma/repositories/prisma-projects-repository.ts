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
	async create({
		name,
		client,
		start_date,
		end_date,
		user_id,
	}: CreateProjectParams): Promise<Project> {
		return await prisma.project.create({
			data: {
				name,
				client,
				start_date,
				end_date,
				user_id,
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
				...(data.client !== undefined ? { client: data.client } : {}),
				...(data.background_path !== undefined
					? { background_path: data.background_path }
					: {}),
				...(data.start_date !== undefined
					? { start_date: data.start_date }
					: {}),
				...(data.end_date !== undefined ? { end_date: data.end_date } : {}),
				...(data.is_favorite !== undefined
					? { is_favorite: data.is_favorite }
					: {}),
				...(data.user_id !== undefined ? { user_id: data.user_id } : {}),
			},
		});
	}

	async delete(id: string): Promise<void> {
		await prisma.project.delete({
			where: { id },
		});
	}

	async list(userId: string, params: ListProjectsParams): Promise<Project[]> {
		const where: Record<string, unknown> = {
			user_id: userId,
		};

		if (params.favorites === true) {
			where.is_favorite = true;
		}

		if (params.query) {
			where.OR = [
				{ name: { contains: params.query, mode: 'insensitive' as const } },
				{ client: { contains: params.query, mode: 'insensitive' as const } },
			];
		}

		return await prisma.project.findMany({
			where,
			orderBy: sortToOrderBy(params.sort),
		});
	}
}
