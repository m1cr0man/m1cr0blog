import { HttpException, Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { randomBytes } from 'crypto'
import { BaseService } from '../../fsrepo/service'
import { AuthUserDto, CreateUserDto } from './dtos'
import { User } from './entity'
import { UserRepository } from './repository'

@Injectable()
export class UserService extends BaseService<User> {
    constructor(
        @Inject(UserRepository)
        readonly repo: UserRepository,
    ) {
        super()
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
        if (new_user.password) {
            new_user.password = await User.hashPassword(new_user.password)
        }
        return super.update(name, new_user)
    }

    async authenticate(credentials: AuthUserDto): Promise<User> {
        if (!this.repo.exists(credentials.name))
            throw new UnauthorizedException('Incorrect username/password')

        const user = this.repo.findOne(credentials.name)

        if (!await user.checkPassword(credentials.password)) {
            throw new UnauthorizedException('Incorrect username/password')
        }

        return user
    }

    authenticateByToken(token: string): User {
        const user = this.repo.findOneByToken(token)
        if (!user) {
            throw new UnauthorizedException('Invalid token')
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
