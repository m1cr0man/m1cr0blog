import { Repository } from '../../fsrepo/repository'
import { Upload } from './entity'
import { existsSync, renameSync } from 'fs'
import { join as j } from 'path'
import { HttpException } from '@nestjs/core'

export class UploadsRepository extends Repository<Upload> {

    constructor(userId: string) {
        if (!existsSync(j('users', userId))) throw new HttpException('User not found', 404)
        super(j('users', userId, 'uploads'), Upload)
    }

    getPath(upload: Upload): string {
        return j(this.getDir(upload), 'bytestream')
    }

    saveFile(file: Express.Multer.File, upload: Upload): void {
        return renameSync(file.path, this.getPath(upload))
    }

}
