import { BaseEntity, JSONData } from '../../fsrepo/entity'

export class Background extends BaseEntity {
    constructor(
        @BaseEntity.Serialize('id')
        public id: string,
        @BaseEntity.Serialize('tags')
        public tags: string[] = [],
        @BaseEntity.Serialize('views')
        public views: number = 0,
        @BaseEntity.Serialize('exclude')
        public exclude: boolean = false
    ) {
        super()
    }

    static fromJSON({id, tags, views, exclude}: JSONData<Background>): Background {
        return new Background(id, tags, views, exclude)
    }
}
