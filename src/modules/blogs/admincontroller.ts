import { Body, Controller, Get, Inject, Param, Post, Render, Response, UseGuards } from '@nestjs/common'
import { ApiUseTags } from '@nestjs/swagger'
import { Response as IResponse } from 'express'
import { TEMPLATE_DATA_ADMIN } from '../../constants'
import { AuthGuard } from '../users'
import { CreateBlogDto, UpdateBlogDto } from './dtos'
import { BlogsService } from './service'


@ApiUseTags('Blogs Admin')
@Controller('/admin/blogs')
@UseGuards(AuthGuard)
export class BlogsAdminController {
    constructor(
        @Inject(BlogsService)
        private readonly service: BlogsService
    ) {
    }

    @Get()
    @Render('admin/blogs/index')
    adminBlogsHome() {
        const blogs = this.service.find()
        return {...TEMPLATE_DATA_ADMIN, blogs}
    }

    @Get('add')
    adminBlogsAdd(
        @Response() res: IResponse
    ) {
        const blog = this.service.create(new CreateBlogDto())
        return res.redirect('./' + blog.id)
    }

    @Get(':id/')
    @Render('admin/blogs/edit')
    adminBlogsEdit(
        @Param('id') id: string
    ) {
        const blog = this.service.findOne(id)
        const files = this.service.repo.getFiles(blog)
        return {...TEMPLATE_DATA_ADMIN, blog, files}
    }

    @Post(':id/')
    adminBlogsUpdate(
        @Param('id') id: string,
        @Body() updateBlogDto: Partial<UpdateBlogDto>,
        @Response() res: IResponse
    ) {
        this.service.update(id, updateBlogDto)
        return res.redirect('./')
    }

    @Get(':id/delete')
    adminbBlogsDelete(
        @Param('id') id: string,
        @Response() res: IResponse
    ) {
        this.service.delete(id)
        return res.redirect('../')
    }

    @Get(':id/publish')
    adminbBlogsPublish(
        @Param('id') id: string,
        @Response() res: IResponse
    ) {
        this.service.changePublish(id)
        return res.redirect('../')
    }

    @Get(':id/unpublish')
    adminbBlogsUnpublish(
        @Param('id') id: string,
        @Response() res: IResponse
    ) {
        this.service.changePublish(id, false)
        return res.redirect('../')
    }
}
