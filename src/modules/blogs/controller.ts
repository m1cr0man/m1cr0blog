import { Body, Controller, Delete, Get, HttpCode, Inject, Param, Post, Put, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiUseTags } from '@nestjs/swagger'
import { AuthGuard } from '../users'
import { CreateBlogDto, UpdateBlogDto } from './dtos'
import { Blog } from './entity'
import { BlogsService } from './service'


@ApiUseTags('Blogs')
@UseGuards(AuthGuard)
@Controller('/api/v1/blogs')
export class UploadsController {
    constructor(
        @Inject(BlogsService)
        private readonly service: BlogsService
    ) {
    }

    @Get()
    @ApiOperation({title: 'List'})
    list(): Blog[] {
        return this.service.find()
    }

    @Post()
    @ApiOperation({title: 'Create'})
    @HttpCode(201)
    add(
        @Body() data: CreateBlogDto
    ): Blog {
        return this.service.create(data)
    }

    @Get(':id')
    @ApiOperation({title: 'View'})
    view(
        @Param('id') id: string
    ): Blog {
        return this.service.findOne(id)
    }

    @Put(':id')
    @ApiOperation({title: 'Update'})
    update(
        @Param('id') id: string,
        @Body() data: UpdateBlogDto
    ) {
        return this.service.update(id, data)
    }

    @Delete(':id')
    @ApiOperation({title: 'Delete'})
    @HttpCode(204)
    delete(
        @Param('id') id: string
    ): void {
        return this.service.delete(id)
    }

    @Post('/:id/publish')
    @ApiOperation({title: 'Publish'})
    @HttpCode(204)
    publish(
        @Param('id') id: string
    ): void {
        return this.service.publish(id)
    }
}
