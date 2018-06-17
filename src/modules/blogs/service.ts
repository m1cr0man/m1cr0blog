import { Inject, Injectable } from '@nestjs/common'
import { BaseService } from '../../fsrepo/service'
import { CreateBlogDto } from './dtos'
import { Blog } from './entity'
import { BlogsRepository } from './repository'


@Injectable()
export class BlogsService extends BaseService<Blog> {
    constructor(
        @Inject(BlogsRepository)
        readonly repo: BlogsRepository
    ) {
        super()
    }

    create(newBlog: CreateBlogDto): Blog {
        const blog = new Blog(
            this.repo.generateId(),
            newBlog.url,
            newBlog.title,
            new Date(newBlog.timestamp),
            false,
            newBlog.markdown
        )
        this.repo.save(blog)

        return blog
    }

    publish(id: string) {
        const blog = this.findOne(id)
        blog.published = true
        this.repo.save(blog)
    }

    findLatest(): Blog | null {
        const blogs = this.find()
        return blogs.reduce((last: null | Blog, blog: Blog) =>
            (!last || last.timestamp > blog.timestamp) && last || blog,
            null)
    }
}
