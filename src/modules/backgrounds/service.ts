import { Component, createRouteParamDecorator } from '@nestjs/common'
import { Background } from './entity'
import { BaseService } from '../../fsrepo/service'
import { BackgroundsRepository } from './repository'

@Component()
export class BackgroundsService extends BaseService<Background> {
    constructor(
        readonly repo: BackgroundsRepository,
    ) {
        super()
    }

    async create(id: string, tags: string[]): Promise<Background> {
        const ent = new Background(
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
