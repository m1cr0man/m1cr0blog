import * as marked from 'marked'
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
        @BaseEntity.Serialize('description')
        public description?: string,
        @BaseEntity.Serialize('published')
        public published: boolean = false,
        @BaseEntity.Serialize('tags')
        public tags: string[] = []
    ) {
        super()
    }

    get rendered(): string {
        return marked(this.markdown)
    }

    get htmlTimestamp(): string {
        return this.timestamp.toISOString().substr(0, 10)
    }

    get humanTimestamp(): string {
        return this.timestamp.toDateString()
    }

    static fromJSON({id, url, title, timestamp, markdown, description, published, image, tags}: JSONData<Blog>): Blog {
        return new Blog(id, url, title, new Date(timestamp),
            markdown, image, description, published, tags)
    }
}
