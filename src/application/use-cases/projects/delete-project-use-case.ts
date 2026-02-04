import type { ProjectRepository } from '@/domain/repositories/project-repository';
import { NotFoundError } from '@/shared/errors/not-found-error';

export class DeleteProjectUseCase {
	private projectsRepository: ProjectRepository;

	constructor(projectsRepository: ProjectRepository) {
		this.projectsRepository = projectsRepository;
	}

	async execute(userId: string, id: string): Promise<void> {
		const deleted = await this.projectsRepository.deleteForUser(id, userId);
		if (!deleted) {
			throw new NotFoundError('Project not found');
		}
	}
}
