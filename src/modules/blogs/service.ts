import { Inject, Injectable } from '@nestjs/common'
import * as path from 'path'
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
            (newBlog.timestamp) ? new Date(newBlog.timestamp) : new Date(),
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
            (blog.published && (!last || blog.timestamp > last.timestamp)) && blog || last,
            null)
    }

    findByUrl(url: string): Blog | null {
        const blogs = this.find()
        return blogs.reduce((last: null | Blog, blog: Blog) =>
            blog.published && blog.url == url && blog || last,
            null)
    }

    getFilePath(blog: Blog, filename: string): string {
        return path.resolve(path.join(this.repo.getDir(blog), filename))
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
