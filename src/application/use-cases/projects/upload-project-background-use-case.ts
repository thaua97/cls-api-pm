import type {
	Project,
	ProjectRepository,
} from '@/domain/repositories/project-repository';
import { NotFoundError } from '@/shared/errors/not-found-error';

interface UploadProjectBackgroundUseCaseResponse {
	project: Project;
}

export class UploadProjectBackgroundUseCase {
	private projectsRepository: ProjectRepository;

	constructor(projectsRepository: ProjectRepository) {
		this.projectsRepository = projectsRepository;
	}

	async execute(
		projectId: string,
		params: { background_path: string | null },
	): Promise<UploadProjectBackgroundUseCaseResponse> {
		const existing = await this.projectsRepository.findById(projectId);

		if (!existing) {
			throw new NotFoundError('Project not found');
		}

		const project = await this.projectsRepository.update(projectId, {
			background_path: params.background_path,
		});

		return { project };
	}
}
