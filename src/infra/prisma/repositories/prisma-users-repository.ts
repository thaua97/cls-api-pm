import { prisma } from '../prisma';

import type {
	CreateUserParams,
	User,
	UserRepository,
} from '@/domain/repositories/user-repository';

export class PrismaUsersRepository implements UserRepository {
	async create(data: CreateUserParams): Promise<User> {
		const user = await prisma.user.create({
			data,
			select: {
				id: true,
				email: true,
				password_hash: true,
			},
		});

		return user;
	}

	async findByEmail(email: string): Promise<User | null> {
		const user = await prisma.user.findUnique({
			where: {
				email,
			},
			select: {
				id: true,
				email: true,
				password_hash: true,
			},
		});

		return user;
	}
}
