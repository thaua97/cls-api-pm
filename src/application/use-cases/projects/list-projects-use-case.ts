import type {
	ListProjectsParams,
	Project,
	ProjectRepository,
} from '@/domain/repositories/project-repository';
import { AppError } from '@/shared/errors/app-error';

interface ListProjectsUseCaseResponse {
	projects: Project[];
}

export class ListProjectsUseCase {
	constructor(private projectsRepository: ProjectRepository) {}

	async execute(params: ListProjectsParams): Promise<ListProjectsUseCaseResponse> {
		if (params.query && params.query.length < 3) {
			throw new AppError({
				statusCode: 400,
				code: 'INVALID_QUERY',
				message: 'query must have at least 3 characters',
			});
		}

		const projects = await this.projectsRepository.list(params);
		return { projects };
	}
}
