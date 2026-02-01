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
			description: data.description ?? null,
			start_date: data.start_date,
			end_date: data.end_date,
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

	async update(id: string, data: UpdateProjectParams): Promise<Project> {
		const project = await this.findById(id);
		if (!project) throw new Error('Not found');

		const updated: Project = {
			...project,
			...(data.is_favorite !== undefined ? { is_favorite: data.is_favorite } : {}),
			updated_at: new Date(),
		};

		this.items = this.items.map((p) => (p.id === id ? updated : p));
		return updated;
	}

	async delete(): Promise<void> {
		throw new Error('Not implemented');
	}

	async list(_params: ListProjectsParams): Promise<Project[]> {
		return this.items;
	}
}

describe('ToggleFavoriteProjectUseCase', () => {
	it('should toggle favorite state', async () => {
		const projectsRepository = new InMemoryProjectsRepository();
		const useCase = new ToggleFavoriteProjectUseCase(projectsRepository);

		const project = await projectsRepository.create({
			name: 'P1',
			start_date: new Date('2025-01-01'),
			end_date: new Date('2025-01-10'),
		});

		expect(project.is_favorite).toBe(false);

		const { project: updated1 } = await useCase.execute(project.id);
		expect(updated1.is_favorite).toBe(true);

		const { project: updated2 } = await useCase.execute(project.id);
		expect(updated2.is_favorite).toBe(false);
	});
});
