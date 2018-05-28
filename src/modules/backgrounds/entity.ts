import { BaseEntity, JSONData } from '../../fsrepo/entity'
import { Upload } from '../uploads/entity'

export class Background extends BaseEntity {
    constructor(
        @BaseEntity.Serialize('upload')
        @BaseEntity.Join('upload')
        public upload: Upload,
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

    static fromJSON({upload, id, tags, views, exclude}: JSONData<Background>): Background {
        return new Background(upload, id, tags, views, exclude)
    }
}
