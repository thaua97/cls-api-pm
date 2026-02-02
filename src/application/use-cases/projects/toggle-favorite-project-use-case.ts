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

	async execute(id: string): Promise<ToggleFavoriteProjectUseCaseResponse> {
		const project = await this.projectsRepository.findById(id);

		if (!project) {
			throw new NotFoundError('Project not found');
		}

		const updated = await this.projectsRepository.update(id, {
			is_favorite: !project.is_favorite,
		});

		return { project: updated };
	}
}
