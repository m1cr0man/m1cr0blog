import { BaseEntity, JSONData } from '../../fsrepo/entity'

export class Upload extends BaseEntity {
    constructor(
        @BaseEntity.Serialize('id')
        public id: string,
        @BaseEntity.Serialize('filename')
        public filename: string,
        @BaseEntity.Serialize('mime')
        public mime: string,
        @BaseEntity.Serialize('date')
        public date: Date,
        @BaseEntity.Serialize('lifespan')
        public lifespan: number,
        @BaseEntity.Serialize('size')
        public size: number,
        @BaseEntity.Serialize('views')
        public views: number = 0
    ) {
        super()
    }

    static fromJSON({id, filename, mime, date, lifespan, size, views}: JSONData<Upload>): Upload {
        return new Upload(id, filename, mime, new Date(date),
                          lifespan, size, views)
    }
}
