import { Controller, Get, Inject, Render, UseGuards } from '@nestjs/common'
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

    @Get('/admin/')
    @UseGuards(AuthGuard)
    @Render('admin/index')
    adminHome() {
        return TEMPLATE_DATA_ADMIN
    }
}
