import { Repository } from '../../fsrepo/repository'
import { Upload } from './entity'
import { User } from '../users/entity'
import { existsSync } from 'fs'
import { join as j } from 'path'

export class UploadsRepository extends Repository<Upload> {

    constructor(user: User) {
        super(j('users', user.id, 'uploads'), Upload)
    }

    generateId() {
        let id;
        do {
            id = Math.random().toString(36).slice(-4)
        } while (existsSync(j(this.root, id)))
        return id
    }
}
