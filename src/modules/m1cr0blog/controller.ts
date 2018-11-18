import { Controller, Get, HttpException, HttpStatus, Inject, Param, Render, Response, UseGuards } from '@nestjs/common'
import { Response as IResponse } from 'express'
import { TEMPLATE_DATA, TEMPLATE_DATA_ADMIN } from '../../constants'
import { Blog, BlogsService } from '../blogs'
import { AuthGuard } from '../users'


const EMPTY_BLOG = new Blog('-1', 'empty', 'No posts yet', new Date(), 'Come back soon!')


@Controller()
export class M1cr0blogController {
    constructor(
        @Inject(BlogsService)
        private readonly blogsService: BlogsService
    ) {
    }

    @Get()
    @Render('index')
    root() {
        const blog = this.blogsService.findLatest() || EMPTY_BLOG
        return {...TEMPLATE_DATA, blog}
    }

    @Get('/posts/:url')
    viewBlog(
        @Param('url') url: string,
    ) {
        const blog = this.blogsService.findByUrl(url)
        if (!blog) throw new HttpException('No such blog post ' + url, HttpStatus.NOT_FOUND)
        return {...TEMPLATE_DATA, blog}
    }

    @Get('/posts/:id/:filename')
    viewBlogFile(
        @Param('id') id: string,
        @Param('filename') filename: string,
        @Response() res: IResponse,
    ) {
        const blog = this.blogsService.findOne(id)
        if (!blog) throw new HttpException('No such blog post ' + id, HttpStatus.NOT_FOUND)
        res.sendFile(this.blogsService.getFilePath(blog, filename))
    }

    @Get('/admin/')
    @UseGuards(AuthGuard)
    @Render('admin/index')
    adminHome() {
        return TEMPLATE_DATA_ADMIN
    }
}
