import type { Project } from '@/domain/repositories/project-repository';

export interface ProjectHttpDTO {
	id: string;
	name: string;
	description: string | null;
	startDate: string;
	endDate: string;
	isFavorite: boolean;
	createdAt: string;
	updatedAt: string;
}

export function projectToHttp(project: Project): ProjectHttpDTO {
	return {
		id: project.id,
		name: project.name,
		description: project.description,
		startDate: project.start_date.toISOString(),
		endDate: project.end_date.toISOString(),
		isFavorite: project.is_favorite,
		createdAt: project.created_at.toISOString(),
		updatedAt: project.updated_at.toISOString(),
	};
}
