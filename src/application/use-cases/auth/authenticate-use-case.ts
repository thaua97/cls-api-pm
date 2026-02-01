import { compare } from 'bcryptjs';

import type { UserRepository } from '@/domain/repositories/user-repository';
import { UnauthorizedError } from '@/shared/errors/unauthorized-error';

interface AuthenticateUseCaseRequest {
	email: string;
	password: string;
}

interface AuthenticateUseCaseResponse {
	userId: string;
}

export class AuthenticateUseCase {
	constructor(private usersRepository: UserRepository) {}

	async execute({
		email,
		password,
	}: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
		const user = await this.usersRepository.findByEmail(email);

		if (!user) {
			throw new UnauthorizedError('Invalid credentials');
		}

		const isPasswordValid = await compare(password, user.password_hash);

		if (!isPasswordValid) {
			throw new UnauthorizedError('Invalid credentials');
		}

		return { userId: user.id };
	}
}
