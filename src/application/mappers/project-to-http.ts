import type { Project } from '@/domain/repositories/project-repository';
import { env } from '@/env';

export interface ProjectHttpDTO {
	id: string;
	name: string;
	client: string;
	backgroundUrl: string | null;
	startDate: string;
	endDate: string;
	userId: string;
	isFavorite: boolean;
	createdAt: string;
	updatedAt: string;
}

export function projectToHttp(project: Project): ProjectHttpDTO {
	const baseUrl = env.API_BASE_URL.replace(/\/$/, '');

	return {
		id: project.id,
		name: project.name,
		client: project.client,
		backgroundUrl: project.background_url
			? `${baseUrl}/uploads/${project.background_url}`
			: null,
		startDate: project.start_date.toISOString(),
		endDate: project.end_date.toISOString(),
		userId: project.user_id,
		isFavorite: project.is_favorite,
		createdAt: project.created_at.toISOString(),
		updatedAt: project.updated_at.toISOString(),
	};
}
