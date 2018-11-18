import {
    Body,
    Controller,
    Delete,
    FileInterceptor,
    Get,
    HttpCode,
    Inject,
    Param,
    Post,
    Put,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common'
import { ApiOperation, ApiUseTags } from '@nestjs/swagger'
import { MULTER_TMPDIR } from '../../constants'
import { AuthGuard } from '../users'
import { CreateBlogDto, UpdateBlogDto } from './dtos'
import { Blog } from './entity'
import { BlogsService } from './service'


@ApiUseTags('Blogs')
@UseGuards(AuthGuard)
@Controller('/api/v1/blogs')
export class BlogsController {
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
        return this.service.changePublish(id)
    }

    @Post('/:id/unpublish')
    @ApiOperation({title: 'Unpublish'})
    @HttpCode(204)
    unpublish(
        @Param('id') id: string
    ): void {
        return this.service.changePublish(id, false)
    }

    @Get('/:id/files')
    @ApiOperation({title: 'List Files'})
    listFiles(
        @Param('id') id: string
    ) {
        return this.service.getFiles(id)
    }

    @Post('/:id/files')
    @ApiOperation({title: 'Add File'})
    @UseInterceptors(FileInterceptor('file', {dest: MULTER_TMPDIR}))
    @HttpCode(201)
    addFile(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File // Express.Multer.File is in global namespace
    ): void {
        this.service.addFile(id, file)
    }

    @Delete('/:id/files/:filename')
    @ApiOperation({title: 'Delete File'})
    @HttpCode(204)
    deleteFile(
        @Param('id') id: string,
        @Param('filename') filename: string
    ): void {
        this.service.deleteFile(id, filename)
    }
}
