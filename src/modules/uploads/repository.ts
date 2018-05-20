import { Repository } from '../../fsrepo/repository'
import { Upload } from './entity'
import { User } from '../users/entity'
import { createReadStream, existsSync, ReadStream, renameSync } from 'fs'
import { join as j } from 'path'

export class UploadsRepository extends Repository<Upload> {

    constructor(user: User) {
        super(j('users', user.id, 'uploads'), Upload)
    }

    generateId() {
        let id;
        do {
            id = Math.random().toString(36).slice(-3)
        } while (existsSync(j(this.root, id)))
        return id
    }

    saveFile(file: Express.Multer.File, upload: Upload): void {
        return renameSync(file.path, j(this.getDir(upload), 'bytestream'))
    }

    loadFile(upload: Upload): ReadStream {
        return createReadStream(j(this.getDir(upload), 'bytestream'))
    }
}
