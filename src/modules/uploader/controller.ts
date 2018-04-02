import { Response } from 'express'
import {
    HttpException, Get, Post, Res, Controller, Inject, HttpCode, UploadedFile, FileInterceptor, Param,
    UseInterceptors, Delete,
} from '@nestjs/common'
import { UploadService } from './service'
import { uploadRoot } from '../../config'
import { UploadResponseDto } from './dtos'

@Controller('/api/v1/uploads')
export class UploadController {
    constructor(
        @Inject(UploadService)
        private readonly service: UploadService,
    ) {}

    @Get()
    async list(): Promise<UploadResponseDto[]> {
        return (await this.service.find()).map(
            upload => new UploadResponseDto(upload)
        )
    }

    @Post()
    @HttpCode(201)
    @UseInterceptors(FileInterceptor('file', { dest: uploadRoot }))
    async upload(
        @UploadedFile() file: Express.Multer.File // Express.Multer.File is in global namespace
    ): Promise<UploadResponseDto> {
        if (!file) throw new HttpException('No file uploaded', 400)
        return new UploadResponseDto(await this.service.create(file))
    }

    @Get(':id')
    async view(
        @Param() params: { id: number },
    ): Promise<UploadResponseDto> {
        return new UploadResponseDto(await this.service.findOne(params.id))
    }

    @Delete(':id')
    @HttpCode(204)
    delete(
        @Param() params: { id: number },
    ): Promise<void> {
        return this.service.delete(params.id)
    }

    @Get(':id/download')
    async download(
        @Param() params: { id: number },
        @Res() res: Response,
    ): Promise<void> {
        const upload = await this.service.findOne(params.id)

        // sendFile is the preferred method here - under the hood it uses a library
        // called send which handles partials and conditional GETs
        return res.sendFile(upload.path, { headers: {
            'Content-Disposition': `attachment; filename="${upload.filename}"`,
            'Content-Type': upload.mime
        }})
    }
}
