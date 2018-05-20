import { BaseEntity, JSONData } from '../../fsrepo/entity'

export class Upload extends BaseEntity {
    constructor(
        @BaseEntity.Serialize('id')
        public id: string,
        @BaseEntity.Serialize('filename')
        public filename: string,
        @BaseEntity.Serialize('date')
        public date: Date,
        @BaseEntity.Serialize('lifespan')
        public lifespan: number,
        @BaseEntity.Serialize('views')
        public views: number = 0
    ) {
        super()
    }

    static fromJSON({id, filename, date, lifespan, views}: JSONData<Upload>): Upload {
        return new Upload(id, filename, new Date(date), lifespan, views)
    }
}
