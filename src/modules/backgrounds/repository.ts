import { HttpException } from '@nestjs/common'
import { existsSync, unlinkSync } from 'fs'
import { join as j } from 'path'
import { Join, Repository } from '../../fsrepo/repository'
import { UploadsRepository } from '../uploads/repository'
import { User } from '../users/entity'
import { Background } from './entity'

export class BackgroundsRepository extends Repository<Background> {
    uploads: UploadsRepository

    constructor(
        user: User,
        uploads: UploadsRepository
    ) {
        if (!existsSync(j('users', user.id))) throw new HttpException('User not found', 404)
        const uploadJoin = new Join<Background>(uploads, 'upload')
        super(j('users', user.id, 'uploads'), Background, 3, 'bgdata.json', [uploadJoin])
        this.uploads = uploads
    }

    delete(ent: Background): void {
        if (this.exists(ent.id)) unlinkSync(j(this.getDir(ent), this.metafile))
    }
}
