import { Repository } from '../../fsrepo/repository'
import { Upload } from './entity'
import { existsSync, renameSync } from 'fs'
import { join as j } from 'path'
import { HttpException } from '@nestjs/core'
import { User } from '../users/entity'

export class UploadsRepository extends Repository<Upload> {

    constructor(user: User) {
        if (!existsSync(j('users', user.id))) throw new HttpException('User not found', 404)
        super(j('users', user.id, 'uploads'), Upload)
    }

    getPath(upload: Upload): string {
        return j(this.getDir(upload), 'bytestream')
    }

    saveFile(file: Express.Multer.File, upload: Upload): void {
        return renameSync(file.path, this.getPath(upload))
    }

}
