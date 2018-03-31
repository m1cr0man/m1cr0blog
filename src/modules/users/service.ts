import { Component, HttpException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { randomBytes } from 'crypto'
import { User } from './entity'
import { AuthUserDto, CreateUserDto } from './dtos'

@Component()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly repo: Repository<User>,
    ) {}

    find(): Promise<User[]> {
        return this.repo.find()
    }

    async findOne(name: string): Promise<User> {
        const user = await this.repo.findOne({ name })
        if (!user) throw new HttpException('User not found', 404)
        return user
    }

    async create(new_user: CreateUserDto): Promise<User> {

        // Don't allow update of existing users
        if (await this.repo.findOneById(new_user.name)) throw new HttpException('User name taken', 400)

        const user = this.repo.create({
            name: new_user.name,
            token: new_user.token || randomBytes(24).toString('hex'),
            permissions: new_user.permissions || [],
        })

        await user.setPassword(new_user.password)

        return this.safeSave(user)
    }

    async update(name: string, new_user: Partial<CreateUserDto>): Promise<User> {
        const user = await this.findOne(name)

        if (new_user.password) {
            user.setPassword(new_user.password)
            delete new_user.password
        }

        return this.safeSave(
            this.repo.merge(user, new_user)
        )
    }

    async delete(name: string): Promise<void> {
        const user = await this.repo.findOneById(name)
        if (user) await this.repo.remove(user)
    }

    async authenticate(credentials: AuthUserDto): Promise<string> {
        const user = await this.repo.findOne({
            where: { name: credentials.name },
            select: ['password', 'token']
        })

        if (!user || !await user.checkPassword(credentials.password)) {
            throw new HttpException('Incorrect username/password', 401)
        }

        return user.token
    }

    async authenticateByToken(token: string): Promise<string> {
        if (!await this.repo.findOne({ token })) {
            throw new HttpException('Invalid token', 401)
        }
        return token
    }

    private async safeSave(user: User): Promise<User> {
        try {
            return await this.repo.save(user)
        } catch (err) {
            throw new HttpException(err.message, 400)
        }
    }
}
