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
	constructor(private projectsRepository: ProjectRepository) {}

	async execute(
		id: string,
		data: UpdateProjectParams,
	): Promise<UpdateProjectUseCaseResponse> {
		const existing = await this.projectsRepository.findById(id);

		if (!existing) {
			throw new NotFoundError('Project not found');
		}

		const project = await this.projectsRepository.update(id, data);
		return { project };
	}
}
