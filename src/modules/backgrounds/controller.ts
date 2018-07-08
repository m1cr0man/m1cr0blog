import { Body, Controller, Delete, Get, HttpCode, Param, Post, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiUseTags } from '@nestjs/swagger'
import { AuthGuard } from '../users'
import { AddBackgroundDto } from './dtos'
import { Background } from './entity'
import { BackgroundsService, BackgroundsServiceDecorator as Backgrounds } from './service'


@ApiUseTags('Backgrounds')
@UseGuards(AuthGuard)
@Controller('/api/v1/backgrounds')
export class BackgroundsController {
    @Get()
    @ApiOperation({ title: 'List' })
    list(
        @Backgrounds() service: BackgroundsService
    ): Background[] {
        return service.find()
    }

    @Post()
    @ApiOperation({ title: 'Add' })
    @HttpCode(201)
    add(
        @Backgrounds() service: BackgroundsService,
        @Body() addBgDto: AddBackgroundDto
    ): Background {
        return service.create(addBgDto.uploadId, addBgDto.tags || [])
    }

    @Get(':uploadId')
    @ApiOperation({ title: 'View' })
    view(
        @Backgrounds() service: BackgroundsService,
        @Param('uploadId') uploadId: string
    ): Background {
        return service.findOne(uploadId)
    }

    @Delete(':uploadId')
    @ApiOperation({ title: 'Delete' })
    @HttpCode(204)
    delete(
        @Backgrounds() service: BackgroundsService,
        @Param('uploadId') uploadId: string
    ): void {
        return service.delete(uploadId)
    }

    @Post(':uploadId/tag/:tag')
    @ApiOperation({ title: 'Add Tag' })
    @HttpCode(201)
    addTag(
        @Backgrounds() service: BackgroundsService,
        @Param('tag') tag: string,
        @Param('uploadId') uploadId: string
    ): void {
        return service.addTag(uploadId, tag)
    }

    @Delete(':uploadId/tag/:tag')
    @ApiOperation({ title: 'Remove Tag' })
    @HttpCode(204)
    removeTag(
        @Backgrounds() service: BackgroundsService,
        @Param('tag') tag: string,
        @Param('uploadId') uploadId: string
    ): void {
        return service.removeTag(uploadId, tag)
    }
}
