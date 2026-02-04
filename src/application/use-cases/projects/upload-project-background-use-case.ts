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
		userId: string,
		projectId: string,
		params: { background_url: string | null },
	): Promise<UploadProjectBackgroundUseCaseResponse> {
		const project = await this.projectsRepository.updateForUser(
			projectId,
			userId,
			{
				background_url: params.background_url,
			},
		);
		if (!project) {
			throw new NotFoundError('Project not found');
		}

		return { project };
	}
}
