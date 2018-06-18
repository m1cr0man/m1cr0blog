import { BaseEntity, JSONData } from '../../fsrepo/entity'


export class Blog extends BaseEntity {
    constructor(
        @BaseEntity.Serialize('id')
        public id: string,
        @BaseEntity.Serialize('url')
        public url: string,
        @BaseEntity.Serialize('title')
        public title: string,
        @BaseEntity.Serialize('timestamp')
        public timestamp: Date,
        @BaseEntity.Serialize('markdown')
        @BaseEntity.Hide('markdown')
        public markdown: string,
        @BaseEntity.Serialize('image')
        public image?: string,
        @BaseEntity.Serialize('published')
        public published: boolean = false,
        @BaseEntity.Serialize('tags')
        public tags: string[] = []
    ) {
        super()
    }

    static fromJSON({id, url, title, timestamp, markdown, published, image, tags}: JSONData<Blog>): Blog {
        return new Blog(id, url, title, new Date(timestamp),
            markdown, image, published, tags)
    }
}
