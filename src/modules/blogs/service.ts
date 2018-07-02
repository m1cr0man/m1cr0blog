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

    getFiles(id: string): string[] {
        return this.repo.getFiles(this.findOne(id))
    }

    addFile(id: string, file: Express.Multer.File): void {
        this.repo.saveFile(this.findOne(id), file)
    }

    deleteFile(id: string, filename: string): void {
        this.repo.deleteFile(this.findOne(id), filename)
    }
}
