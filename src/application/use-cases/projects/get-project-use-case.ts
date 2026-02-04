import type {
	Project,
	ProjectRepository,
} from '@/domain/repositories/project-repository';
import { NotFoundError } from '@/shared/errors/not-found-error';

interface GetProjectUseCaseResponse {
	project: Project;
}

export class GetProjectUseCase {
	private projectsRepository: ProjectRepository;

	constructor(projectsRepository: ProjectRepository) {
		this.projectsRepository = projectsRepository;
	}

	async execute(
		userId: string,
		id: string,
	): Promise<GetProjectUseCaseResponse> {
		const project = await this.projectsRepository.findByIdForUser(id, userId);

		if (!project) {
			throw new NotFoundError('Project not found');
		}

		return { project };
	}
}
