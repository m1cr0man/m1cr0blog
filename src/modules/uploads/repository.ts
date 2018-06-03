import { renameSync } from 'fs'
import { join as j } from 'path'
import { Repository } from '../../fsrepo/repository'
import { User } from '../users'
import { Upload } from './entity'

export class UploadsRepository extends Repository<Upload> {

    constructor(user: User) {
        super(j('users', user.id, 'uploads'), Upload)
    }

    getPath(upload: Upload): string {
        return j(this.getDir(upload), 'bytestream')
    }

    saveFile(file: Express.Multer.File, upload: Upload): void {
        return renameSync(file.path, this.getPath(upload))
    }

}
