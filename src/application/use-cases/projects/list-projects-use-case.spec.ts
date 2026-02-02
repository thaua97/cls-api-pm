import { describe, expect, it } from 'vitest';

import { ListProjectsUseCase } from './list-projects-use-case';
import type {
	ListProjectsParams,
	Project,
	ProjectRepository,
} from '@/domain/repositories/project-repository';

class InMemoryProjectsRepository implements ProjectRepository {
	private items: Project[] = [];

	async create(): Promise<Project> {
		throw new Error('Not implemented');
	}

	async findById(): Promise<Project | null> {
		throw new Error('Not implemented');
	}

	async update(): Promise<Project> {
		throw new Error('Not implemented');
	}

	async delete(): Promise<void> {
		throw new Error('Not implemented');
	}

	async list(params: ListProjectsParams): Promise<Project[]> {
		return params ? this.items : this.items;
	}
}

describe('ListProjectsUseCase', () => {
	it('should reject query with less than 3 characters', async () => {
		const projectsRepository = new InMemoryProjectsRepository();
		const useCase = new ListProjectsUseCase(projectsRepository);

		await expect(
			useCase.execute({ sort: 'name_asc', query: 'ab' }),
		).rejects.toMatchObject({
			statusCode: 400,
			code: 'INVALID_QUERY',
		});
	});
});
