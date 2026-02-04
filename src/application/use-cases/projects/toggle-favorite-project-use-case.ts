import type {
	Project,
	ProjectRepository,
} from '@/domain/repositories/project-repository';
import { NotFoundError } from '@/shared/errors/not-found-error';

interface ToggleFavoriteProjectUseCaseResponse {
	project: Project;
}

export class ToggleFavoriteProjectUseCase {
	private projectsRepository: ProjectRepository;

	constructor(projectsRepository: ProjectRepository) {
		this.projectsRepository = projectsRepository;
	}

	async execute(
		userId: string,
		id: string,
	): Promise<ToggleFavoriteProjectUseCaseResponse> {
		const project = await this.projectsRepository.findByIdForUser(id, userId);

		if (!project) {
			throw new NotFoundError('Project not found');
		}

		const updated = await this.projectsRepository.updateForUser(id, userId, {
			is_favorite: !project.is_favorite,
		});
		if (!updated) {
			throw new NotFoundError('Project not found');
		}

		return { project: updated };
	}
}
