import { Response } from 'express'
import {
    HttpException, Get, Post, Res, Controller, Inject, HttpCode, UploadedFile, FileInterceptor, Param,
    UseInterceptors, Delete,
} from '@nestjs/common'
import { UploadService } from './service'
import { Upload } from './entity'
import { uploadRoot } from '../../config'

@Controller('/api/v1/uploads')
export class UploadController {
    constructor(
        @Inject(UploadService)
        private readonly service: UploadService,
    ) {}

    @Get()
    list(): Promise<Upload[]> {
        return this.service.find()
    }

    @Post()
    @HttpCode(201)
    @UseInterceptors(FileInterceptor('file', { dest: uploadRoot }))
    upload(
        @UploadedFile() file: Express.Multer.File // Express.Multer.File is in global namespace
    ): Promise<Upload> {
        if (!file) throw new HttpException('No file uploaded', 400)
        return this.service.create(file)
    }

    @Get(':id')
    view(
        @Param() params: { id: number },
    ): Promise<Upload> {
        return this.service.findOne(params.id)
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
