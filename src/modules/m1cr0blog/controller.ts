import { Body, Controller, Get, Inject, Param, Post, Render, Response, UseGuards } from '@nestjs/common'
import { Response as IResponse } from 'express'
import { Blog, BlogsService, CreateBlogDto } from '../blogs'
import { AuthGuard, CreateUserDto, UserService } from '../users'


const TEMPLATE_DATA = {
    titleSuffix: 'M1cr0man\'s blog',
    title: 'M1cr0man\'s blog',
    mainClasses: '',
    meta: {
        url: '/'
    }
}

const TEMPLATE_DATA_ADMIN = {
    ...TEMPLATE_DATA,
    mainClasses: 'pure-g padded-body'
}

const EMPTY_BLOG = new Blog('-1', 'empty', 'No posts yet', new Date(), 'Come back soon!')


@Controller()
export class M1cr0blogController {
    constructor(
        @Inject(BlogsService)
        private readonly blogsService: BlogsService,
        @Inject(UserService)
        private readonly usersService: UserService
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

    // User management
    @Get('/admin/users/')
    @UseGuards(AuthGuard)
    @Render('admin/users/index')
    adminUsersHome() {
        const users = this.usersService.find()
        return {...TEMPLATE_DATA_ADMIN, users}
    }

    @Get('/admin/users/:id/')
    @UseGuards(AuthGuard)
    @Render('admin/users/edit')
    adminUsersEdit(
        @Param('id') id: string
    ) {
        const user = this.usersService.findOne(id)
        return {...TEMPLATE_DATA_ADMIN, user}
    }

    @Post('/admin/users/:id/')
    @UseGuards(AuthGuard)
    async adminUsersUpdate(
        @Param('id') id: string,
        @Body() updateUserDto: Partial<CreateUserDto>,
        @Response() res: IResponse
    ) {
        // Filter out an empty password field
        const data: { name?: string, password?: string } = {name: updateUserDto.name}
        if ((updateUserDto.password || '').length)
            data.password = updateUserDto.password
        await this.usersService.update(id, data)
        return res.redirect('./')
    }

    // Blogs management
    @Get('/admin/blogs/')
    @UseGuards(AuthGuard)
    @Render('admin/blogs/index')
    adminBlogsHome() {
        const blogs = this.blogsService.find()
        return {...TEMPLATE_DATA_ADMIN, blogs}
    }

    @Get('/admin/blogs/add')
    @UseGuards(AuthGuard)
    @Render('admin/blogs/edit')
    adminBlogsAdd() {
        return TEMPLATE_DATA_ADMIN
    }

    // TODO fix DTOs
    @Post('/admin/blogs/add')
    @UseGuards(AuthGuard)
    adminBlogsCreate(
        @Body() createBlogDto: CreateBlogDto,
        @Response() res: IResponse
    ) {
        this.blogsService.create(createBlogDto)
        return res.redirect('./')
    }

    @Get('/admin/blogs/:id/')
    @UseGuards(AuthGuard)
    @Render('admin/blogs/edit')
    adminBlogsEdit(
        @Param('id') id: string
    ) {
        const blog = this.blogsService.findOne(id)
        return {...TEMPLATE_DATA_ADMIN, blog}
    }

    @Post('/admin/blogs/:id/')
    @UseGuards(AuthGuard)
    adminBlogsUpdate(
        @Param('id') id: string,
        @Body() updateBlogDto: Partial<CreateBlogDto>,
        @Response() res: IResponse
    ) {
        this.blogsService.update(id, updateBlogDto)
        return res.redirect('./')
    }

    @Get('/admin/blogs/:id/delete')
    @UseGuards(AuthGuard)
    adminbBlogsDelete(
        @Param('id') id: string,
        @Response() res: IResponse
    ) {
        this.blogsService.delete(id)
        return res.redirect('../')
    }

    @Get('/admin/blogs/:id/publish')
    @UseGuards(AuthGuard)
    adminbBlogsPublish(
        @Param('id') id: string,
        @Response() res: IResponse
    ) {
        const blog = this.blogsService.findOne(id)
        blog.published = true
        blog.timestamp = new Date()
        this.blogsService.update(id, blog)
        return res.redirect('../')
    }
}
