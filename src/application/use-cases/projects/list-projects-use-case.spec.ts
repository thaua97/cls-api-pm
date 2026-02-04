import { describe, expect, it } from 'vitest';

import { ListProjectsUseCase } from './list-projects-use-case';
import type {
	CreateProjectParams,
	ListProjectsParams,
	Project,
	ProjectRepository,
	UpdateProjectParams,
} from '@/domain/repositories/project-repository';

class InMemoryProjectsRepository implements ProjectRepository {
	private items: Project[] = [];

	async create(data: CreateProjectParams): Promise<Project> {
		const now = new Date();
		const project: Project = {
			id: crypto.randomUUID(),
			name: data.name,
			client: data.client,
			background_url: null,
			start_date: data.start_date,
			end_date: data.end_date,
			user_id: data.user_id,
			is_favorite: false,
			created_at: now,
			updated_at: now,
		};
		this.items.push(project);
		return project;
	}

	async findById(id: string): Promise<Project | null> {
		return this.items.find((p) => p.id === id) ?? null;
	}

	async findByIdForUser(id: string, userId: string): Promise<Project | null> {
		const project = await this.findById(id);
		if (!project) return null;
		return project.user_id === userId ? project : null;
	}

	async update(id: string, data: UpdateProjectParams): Promise<Project> {
		const project = await this.findById(id);
		if (!project) throw new Error('Not found');

		const updated: Project = {
			...project,
			...(data.name !== undefined ? { name: data.name } : {}),
			...(data.client !== undefined ? { client: data.client } : {}),
			...(data.background_url !== undefined
				? { background_url: data.background_url }
				: {}),
			...(data.start_date !== undefined ? { start_date: data.start_date } : {}),
			...(data.end_date !== undefined ? { end_date: data.end_date } : {}),
			...(data.user_id !== undefined ? { user_id: data.user_id } : {}),
			...(data.is_favorite !== undefined
				? { is_favorite: data.is_favorite }
				: {}),
			updated_at: new Date(),
		};

		this.items = this.items.map((p) => (p.id === id ? updated : p));
		return updated;
	}

	async updateForUser(
		id: string,
		userId: string,
		data: UpdateProjectParams,
	): Promise<Project | null> {
		const project = await this.findByIdForUser(id, userId);
		if (!project) return null;
		return this.update(id, data);
	}

	async delete(id: string): Promise<void> {
		this.items = this.items.filter((p) => p.id !== id);
	}

	async deleteForUser(id: string, userId: string): Promise<boolean> {
		const existing = await this.findByIdForUser(id, userId);
		if (!existing) return false;
		await this.delete(id);
		return true;
	}

	async list(userId: string, params: ListProjectsParams): Promise<Project[]> {
		let items = this.items.filter((p) => p.user_id === userId);
		if (params.favorites === true) {
			items = items.filter((p) => p.is_favorite);
		}
		if (params.query) {
			const q = params.query.toLowerCase();
			items = items.filter(
				(p) =>
					p.name.toLowerCase().includes(q) ||
					p.client.toLowerCase().includes(q),
			);
		}
		return items;
	}
}

describe('ListProjectsUseCase', () => {
	it('should reject query with less than 3 characters', async () => {
		const projectsRepository = new InMemoryProjectsRepository();
		const useCase = new ListProjectsUseCase(projectsRepository);

		await expect(
			useCase.execute('user-1', { sort: 'name_asc', query: 'ab' }),
		).rejects.toMatchObject({
			statusCode: 400,
			code: 'INVALID_QUERY',
		});
	});
});
