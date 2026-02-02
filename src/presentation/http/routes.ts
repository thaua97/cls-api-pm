import type { FastifyInstance } from 'fastify';

import { health } from './controllers/health';
import { login } from './controllers/auth/login';
import { register } from './controllers/users/register';
import { ensureAuthenticated } from './middlewares/ensure-authenticated';
import { createProject } from './controllers/projects/create-project';
import { getProject } from './controllers/projects/get-project';
import { listProjects } from './controllers/projects/list-projects';
import { updateProject } from './controllers/projects/update-project';
import { deleteProject } from './controllers/projects/delete-project';
import { toggleFavoriteProject } from './controllers/projects/toggle-favorite-project';
import { uploadProjectBackground } from './controllers/projects/upload-project-background';

export async function appRoutes(app: FastifyInstance) {
	app.get('/health', health);
	app.post('/auth/login', login);
	app.post('/users', register);

	app.register(async (privateRoutes) => {
		privateRoutes.addHook('preHandler', ensureAuthenticated);

		privateRoutes.get('/projects', listProjects);
		privateRoutes.get('/projects/:id', getProject);
		privateRoutes.post('/projects', createProject);
		privateRoutes.put('/projects/:id', updateProject);
		privateRoutes.delete('/projects/:id', deleteProject);
		privateRoutes.post('/projects/:id/favorite', toggleFavoriteProject);
		privateRoutes.post('/projects/:id/background', uploadProjectBackground);
	});
}
