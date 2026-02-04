import { describe, expect, it } from 'vitest';

import { ToggleFavoriteProjectUseCase } from './toggle-favorite-project-use-case';
import type {
	CreateProjectParams,
	ListProjectsParams,
	Project,
	ProjectRepository,
	UpdateProjectParams,
} from '@/domain/repositories/project-repository';

class InMemoryProjectsRepository implements ProjectRepository {
	public items: Project[] = [];

	async create(data: CreateProjectParams): Promise<Project> {
		const now = new Date();
		const project: Project = {
			id: crypto.randomUUID(),
			name: data.name,
			client: data.client,
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

	async delete(): Promise<void> {
		throw new Error('Not implemented');
	}

	async deleteForUser(id: string, userId: string): Promise<boolean> {
		const existing = await this.findByIdForUser(id, userId);
		if (!existing) {
			return false;
		}
		this.items = this.items.filter((p) => p.id !== id);
		return true;
	}

	async list(userId: string, params: ListProjectsParams): Promise<Project[]> {
		return userId && params ? this.items : this.items;
	}
}

describe('ToggleFavoriteProjectUseCase', () => {
	it('should toggle favorite state', async () => {
		const projectsRepository = new InMemoryProjectsRepository();
		const useCase = new ToggleFavoriteProjectUseCase(projectsRepository);

		const project = await projectsRepository.create({
			name: 'P1',
			client: 'Client 1',
			start_date: new Date('2025-01-01'),
			end_date: new Date('2025-01-10'),
			user_id: 'user-1',
		});

		expect(project.is_favorite).toBe(false);

		const { project: updated1 } = await useCase.execute('user-1', project.id);
		expect(updated1.is_favorite).toBe(true);

		const { project: updated2 } = await useCase.execute('user-1', project.id);
		expect(updated2.is_favorite).toBe(false);
	});
});
