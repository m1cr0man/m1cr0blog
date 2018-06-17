import { Repository } from '../../fsrepo/repository'
import { Blog } from './entity'


export class BlogsRepository extends Repository<Blog> {
    constructor() {
        super('blogs', Blog)
    }

    findOneByUrl(url: string): Blog | null {
        const blogs = this.find()
        return blogs.reduce((_: any, x) => x.url == url && x || null, null)
    }
}
