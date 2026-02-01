export interface User {
	id: string;
	email: string;
	password_hash: string;
}

export interface CreateUserParams {
	name: string;
	email: string;
	password_hash: string;
}

export interface UserRepository {
	create(data: CreateUserParams): Promise<User>;
	findByEmail(email: string): Promise<User | null>;
}
