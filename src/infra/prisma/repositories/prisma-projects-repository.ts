import type {
	ListProjectsParams,
	Project,
	ProjectRepository,
	ProjectSort,
	CreateProjectParams,
	UpdateProjectParams,
} from '@/domain/repositories/project-repository';

import { prisma } from '../prisma';

interface PrismaProjectRecord {
	id: string;
	name: string;
	client: string;
	background_path: string | null;
	start_date: Date;
	end_date: Date;
	user_id: string;
	is_favorite: boolean;
	created_at: Date;
	updated_at: Date;
}

function toDomain(record: PrismaProjectRecord): Project {
	return {
		id: record.id,
		name: record.name,
		client: record.client,
		background_url: record.background_path,
		start_date: record.start_date,
		end_date: record.end_date,
		user_id: record.user_id,
		is_favorite: record.is_favorite,
		created_at: record.created_at,
		updated_at: record.updated_at,
	};
}

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
		const record = await prisma.project.create({
			data: {
				name,
				client,
				start_date,
				end_date,
				user_id,
			},
		});
		return toDomain(record);
	}

	async findById(id: string): Promise<Project | null> {
		const record = await prisma.project.findUnique({
			where: { id },
		});
		return record ? toDomain(record) : null;
	}

	async update(id: string, data: UpdateProjectParams): Promise<Project> {
		const record = await prisma.project.update({
			where: { id },
			data: {
				...(data.name !== undefined ? { name: data.name } : {}),
				...(data.client !== undefined ? { client: data.client } : {}),
				...(data.background_url !== undefined
					? { background_path: data.background_url }
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
		return toDomain(record);
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

		const records = await prisma.project.findMany({
			where,
			orderBy: sortToOrderBy(params.sort),
		});
		return records.map(toDomain);
	}
}
