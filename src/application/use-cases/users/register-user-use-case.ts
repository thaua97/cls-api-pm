import { hash } from 'bcryptjs';

import type { UserRepository } from '@/domain/repositories/user-repository';
import { AppError } from '@/shared/errors/app-error';

interface RegisterUserUseCaseRequest {
	name: string;
	email: string;
	password: string;
}

interface RegisterUserUseCaseResponse {
	userId: string;
}

export class RegisterUserUseCase {
	constructor(private usersRepository: UserRepository) {}

	async execute({
		name,
		email,
		password,
	}: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse> {
		const existing = await this.usersRepository.findByEmail(email);

		if (existing) {
			throw new AppError({
				statusCode: 409,
				code: 'EMAIL_ALREADY_IN_USE',
				message: 'Email already in use',
			});
		}

		const password_hash = await hash(password, 10);

		const user = await this.usersRepository.create({
			name,
			email,
			password_hash,
		});

		return { userId: user.id };
	}
}
