import { Component, Inject } from '@nestjs/common'
import { Upload } from './entity'
import { User } from '../users/entity'
import { BaseService } from '../../fsrepo/service'
import { UploadsRepository } from './repository'

@Component()
export class UploadsService extends BaseService<Upload> {
    constructor(
        readonly repo: UploadsRepository,
    ) {
        super()
    }

    async create(user: User, file: Express.Multer.File, lifespan: number = 84): Promise<Upload> {
        const upload = new Upload(
            this.repo.generateId(),
            file.originalname,
            file.mimetype,
            new Date(),
            lifespan,
            file.size
        )
        this.repo.save(upload)
        this.repo.saveFile(file, upload)

        return upload
    }

    clean(user: User) {
        const currentDate = (new Date()).getTime()
        for (let upload of this.repo.find()) {
            if (upload.lifespan == -1) continue
            upload.date.setHours(upload.date.getHours() + upload.lifespan)
            if (upload.date.getTime() < currentDate) user.uploads.delete(upload)
        }
    }
}
