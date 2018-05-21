import { Component, HttpException, Inject } from '@nestjs/common'
import { randomBytes } from 'crypto'
import { User } from './entity'
import { AuthUserDto, CreateUserDto } from './dtos'
import { UserRepository } from './repository'

@Component()
export class UserService {
    constructor(
        @Inject(UserRepository)
        private readonly repo: UserRepository,
    ) {}

    find(): User[] {
        return this.repo.find()
    }

    findOne(name: string): User {
        const user = this.repo.findOne(name)
        if (!user) throw new HttpException('User not found', 404)
        return user
    }

    async create(new_user: CreateUserDto): Promise<User> {

        // Don't allow update of existing users
        if (this.repo.exists(new_user.name)) throw new HttpException('User name taken', 400)

        const user = new User(
            this.repo.generateId(),
            new_user.name,
            randomBytes(24).toString('hex'),
            await User.hashPassword(new_user.password)
        )
        this.repo.save(user)

        return user
    }

    async update(name: string, new_user: Partial<CreateUserDto>): Promise<User> {
        const user = await this.findOne(name)

        if (new_user.password) {
            new_user.password = await User.hashPassword(new_user.password)
        }

        const updated_user = this.repo.merge(user, new_user)
        this.repo.save(updated_user)
        return updated_user
    }

    delete(name: string): void {
        const user = this.repo.findOne(name)
        if (user) this.repo.delete(user)
    }

    async authenticate(credentials: AuthUserDto): Promise<User> {
        const user = this.repo.findOne(credentials.name)

        if (!user || !await user.checkPassword(credentials.password)) {
            throw new HttpException('Incorrect username/password', 401)
        }

        return user
    }

    authenticateByToken(token: string): User {
        const user = this.repo.findOneByToken(token)
        if (!user) {
            throw new HttpException('Invalid token', 401)
        }
        return user
    }

    async init(): Promise<void> {

        // Don't do anything if a user exists already
        if (this.find().length) return

        await this.create({
            name: 'lucas',
            password: 'temppwd'
        })
    }
}
