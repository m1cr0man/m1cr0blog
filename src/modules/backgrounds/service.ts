import { createParamDecorator, Injectable } from '@nestjs/common'
import { BaseService } from '../../fsrepo/service'
import { Background } from './entity'
import { BackgroundsRepository } from './repository'

@Injectable()
export class BackgroundsService extends BaseService<Background> {
    constructor(
        readonly repo: BackgroundsRepository
    ) {
        super()
    }

    create(id: string, tags: string[]): Background {
        const upload = this.repo.uploads.findOne(id)

        // Set lifespan of upload to -1 so it doesn't get cleaned up
        upload.lifespan = -1
        this.repo.uploads.save(upload)

        const ent = new Background(
            upload,
            id,
            tags
        )
        this.repo.save(ent)

        return ent
    }

    addTag(id: string, tag: string) {
        const lowerTag = tag.toLowerCase()
        const ent = this.findOne(id)
        if (!ent.tags.some(x => x == lowerTag))
            ent.tags.push(lowerTag)

        this.repo.save(ent)
    }

    removeTag(id: string, tag: string) {
        const lowerTag = tag.toLowerCase()
        const ent = this.findOne(id)
        ent.tags = ent.tags.filter(x => x != lowerTag)
        this.repo.save(ent)
    }
}

export const BackgroundsServiceDecorator = createParamDecorator((data, req) =>
    new BackgroundsService(req.user.backgrounds)
)
