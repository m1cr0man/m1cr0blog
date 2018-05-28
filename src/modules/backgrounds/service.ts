import { Component, createRouteParamDecorator, HttpException } from '@nestjs/common'
import { BaseService } from '../../fsrepo/service'
import { Background } from './entity'
import { BackgroundsRepository } from './repository'

@Component()
export class BackgroundsService extends BaseService<Background> {
    constructor(
        readonly repo: BackgroundsRepository
    ) {
        super()
    }

    async create(id: string, tags: string[]): Promise<Background> {
        const upload = this.repo.uploads.findOne(id)
        if (!upload) throw new HttpException('Upload not found', 404)

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

export const BackgroundsServiceDecorator = createRouteParamDecorator((data, req) =>
    new BackgroundsService(req.user.backgrounds)
)
