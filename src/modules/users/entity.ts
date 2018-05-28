import { compare, genSaltSync, hash } from 'bcryptjs'
import { BaseEntity, JSONData } from '../../fsrepo/entity'
import { UploadsRepository } from '../uploads/repository'
import { BackgroundsRepository } from '../backgrounds/repository'

const salt = genSaltSync(10)

export class User extends BaseEntity {
    uploads: UploadsRepository
    backgrounds: BackgroundsRepository

    constructor(
        @BaseEntity.Serialize('id')
        public id: string,
        @BaseEntity.Serialize('name')
        public name: string,
        @BaseEntity.Serialize('token')
        public token: string,
        @BaseEntity.Serialize('password')
        @BaseEntity.Hide('password')
        public password: string,
        @BaseEntity.Serialize('permissions')
        public permissions: string[] = []
    ) {
        super()
        this.uploads = new UploadsRepository(this.id)
        this.backgrounds = new BackgroundsRepository(this.id)
    }

    static fromJSON({id, name, token, password, permissions}: JSONData<User>): User {
        return new User(id, name, token, password, permissions)
    }

    static hashPassword(plain_pwd: string): Promise<string> {
        return hash(plain_pwd, salt)
    }

    checkPassword(plain_pwd: string): Promise<boolean> {
        return compare(plain_pwd, this.password)
    }
}
