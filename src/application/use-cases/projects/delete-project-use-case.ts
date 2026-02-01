import type { ProjectRepository } from '@/domain/repositories/project-repository';
import { NotFoundError } from '@/shared/errors/not-found-error';

export class DeleteProjectUseCase {
	constructor(private projectsRepository: ProjectRepository) {}

	async execute(id: string): Promise<void> {
		const existing = await this.projectsRepository.findById(id);

		if (!existing) {
			throw new NotFoundError('Project not found');
		}

		await this.projectsRepository.delete(id);
	}
}
