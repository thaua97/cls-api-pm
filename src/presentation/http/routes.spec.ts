import { describe, expect, it } from 'vitest';

import { app } from '@/app';

describe('HTTP routes', () => {
	it('GET /health should return 200', async () => {
		await app.ready();

		const response = await app.inject({
			method: 'GET',
			url: '/health',
		});

		expect(response.statusCode).toBe(200);
	});

	it('GET /projects without token should return 401', async () => {
		await app.ready();

		const response = await app.inject({
			method: 'GET',
			url: '/projects',
		});

		expect(response.statusCode).toBe(401);
	});
});
