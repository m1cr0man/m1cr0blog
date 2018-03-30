import { Component, HttpException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { randomBytes } from 'crypto'
import { User } from './entity'
import { CreateUserDto } from './dtos'

@Component()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly repo: Repository<User>,
    ) {}

    find(): Promise<User[]> {
        return this.repo.find()
    }

    async findOne(name: string, withPassword: boolean = false): Promise<User> {

        // Toggle on/off the password field
        const options: {select?: (keyof User)[]} = {}
        if (withPassword) options['select'] = <(keyof User)[]>Object.keys(User)

        const user = await this.repo.findOneById(name, options)
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

    private async safeSave(user: User): Promise<User> {
        try {
            return await this.repo.save(user)
        } catch (err) {
            throw new HttpException(err.message, 400)
        }
    }
}
