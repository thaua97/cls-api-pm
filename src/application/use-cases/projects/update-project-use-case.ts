import type {
	Project,
	ProjectRepository,
	UpdateProjectParams,
} from '@/domain/repositories/project-repository';
import { NotFoundError } from '@/shared/errors/not-found-error';

interface UpdateProjectUseCaseResponse {
	project: Project;
}

export class UpdateProjectUseCase {
	private projectsRepository: ProjectRepository;

	constructor(projectsRepository: ProjectRepository) {
		this.projectsRepository = projectsRepository;
	}

	async execute(
		userId: string,
		id: string,
		data: UpdateProjectParams,
	): Promise<UpdateProjectUseCaseResponse> {
		const project = await this.projectsRepository.updateForUser(
			id,
			userId,
			data,
		);
		if (!project) {
			throw new NotFoundError('Project not found');
		}
		return { project };
	}
}
