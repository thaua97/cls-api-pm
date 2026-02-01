import type {
	Project,
	ProjectRepository,
} from '@/domain/repositories/project-repository';
import { NotFoundError } from '@/shared/errors/not-found-error';

interface GetProjectUseCaseResponse {
	project: Project;
}

export class GetProjectUseCase {
	constructor(private projectsRepository: ProjectRepository) {}

	async execute(id: string): Promise<GetProjectUseCaseResponse> {
		const project = await this.projectsRepository.findById(id);

		if (!project) {
			throw new NotFoundError('Project not found');
		}

		return { project };
	}
}
