export interface Project {
	id: string;
	name: string;
	client: string;
	background_url?: string | null;
	start_date: Date;
	end_date: Date;
	user_id: string;
	is_favorite: boolean;
	created_at: Date;
	updated_at: Date;
}

export interface CreateProjectParams {
	name: string;
	client: string;
	start_date: Date;
	end_date: Date;
	user_id: string;
}

export interface UpdateProjectParams {
	name?: string;
	client?: string;
	background_url?: string | null;
	start_date?: Date;
	end_date?: Date;
	user_id?: string;
	is_favorite?: boolean;
}

export type ProjectSort = 'name_asc' | 'startDate_desc' | 'endDate_asc';

export interface ListProjectsParams {
	favorites?: boolean;
	query?: string;
	sort?: ProjectSort;
}

export interface ProjectRepository {
	create(data: CreateProjectParams): Promise<Project>;
	findById(id: string): Promise<Project | null>;
	findByIdForUser(id: string, userId: string): Promise<Project | null>;
	update(id: string, data: UpdateProjectParams): Promise<Project>;
	updateForUser(
		id: string,
		userId: string,
		data: UpdateProjectParams,
	): Promise<Project | null>;
	delete(id: string): Promise<void>;
	deleteForUser(id: string, userId: string): Promise<boolean>;
	list(userId: string, params: ListProjectsParams): Promise<Project[]>;
}
