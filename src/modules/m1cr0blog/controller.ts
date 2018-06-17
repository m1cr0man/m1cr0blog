import { Controller, Get, Inject, Render } from '@nestjs/common'
import { Blog } from '../blogs/entity'
import { BlogsService } from '../blogs/service'


const TEMPLATE_DATA = {
    titleSuffix: 'M1cr0man\'s blog',
    title: 'M1cr0man\'s blog',
    mainClasses: '',
    meta: {
        url: '/'
    }
}

const EMPTY_BLOG = new Blog('-1', 'empty', 'No posts yet', new Date(), true, 'Come back soon!')

@Controller()
export class M1cr0blogController {
    constructor(
        @Inject(BlogsService)
        private readonly blogsServie: BlogsService
    ) {
    }

    @Get()
    @Render('index')
    root() {
        const blog = this.blogsServie.findLatest() || EMPTY_BLOG
        return {...TEMPLATE_DATA, blog}
    }
}
