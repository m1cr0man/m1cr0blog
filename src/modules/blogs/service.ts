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

    changePublish(id: string, state: boolean = true) {
        const blog = this.findOne(id)
        blog.published = state
        this.repo.save(blog)
    }

    findLatest(): Blog | null {
        const blogs = this.find()
        return blogs.reduce((last: null | Blog, blog: Blog) =>
            (blog.published && (!last || blog.timestamp > last.timestamp)) && blog || last,
            null)
    }

    // Find blogs before and after
    // Divide recommendations evenly between new and old
    findNext(blog: Blog, count: number): Blog[] {
        const blogs = this.find()
            .filter((b: Blog) => b.published)
            .sort((a: Blog, b: Blog) => a.timestamp.valueOf() - b.timestamp.valueOf())
        const postId = blogs.findIndex((b: Blog) => b.id == blog.id)

        // Reversed so that pop returns newest blogs
        const newer = blogs.slice(0, postId).reverse()
        const older = blogs.slice(postId + 1).reverse()

        const nextBlogs: Blog[] = []

        // Do a merge sort-like select of items until we have #count of items
        for (let i = 0; i < count; i++) {
            let next: Blog | undefined;

            // Alternate between selecting newer or older blogs
            // Fall back to selecting the other one if that list is empty
            if (i % 2 == 0) {
                next = newer.pop() || older.pop()
            } else {
                next = older.pop() || newer.pop()
            }

            if (next) {
                nextBlogs.push(next)
            }
        }
        return nextBlogs
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
