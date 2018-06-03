import { createParamDecorator, Injectable } from '@nestjs/common'
import { BaseService } from '../../fsrepo/service'
import { Upload } from './entity'
import { UploadsRepository } from './repository'

@Injectable()
export class UploadsService extends BaseService<Upload> {
    constructor(
        readonly repo: UploadsRepository,
    ) {
        super()
    }

    create(file: Express.Multer.File, lifespan: number = 84): Upload {
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

    clean() {
        const currentDate = (new Date()).getTime()
        for (let upload of this.repo.find()) {
            if (upload.lifespan == -1) continue
            upload.date.setHours(upload.date.getHours() + upload.lifespan)
            if (upload.date.getTime() < currentDate) this.repo.delete(upload)
        }
    }
}

export const UploadsServiceDecorator = createParamDecorator((data, req) =>
    new UploadsService(req.user.uploads)
)
