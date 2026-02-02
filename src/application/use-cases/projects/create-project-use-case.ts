import type {
	CreateProjectParams,
	ProjectRepository,
} from '@/domain/repositories/project-repository';

interface CreateProjectUseCaseResponse {
	projectId: string;
}

export class CreateProjectUseCase {
	private projectsRepository: ProjectRepository;

	constructor(projectsRepository: ProjectRepository) {
		this.projectsRepository = projectsRepository;
	}

	async execute(
		data: CreateProjectParams,
	): Promise<CreateProjectUseCaseResponse> {
		const project = await this.projectsRepository.create(data);
		return { projectId: project.id };
	}
}
