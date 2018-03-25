import { Response } from 'express'
import { HttpException, Get, Post, Res, Controller, Inject, HttpCode, UploadedFile, FileInterceptor, Param, UseInterceptors } from '@nestjs/common'
import { UploadService } from './service'
import { Upload } from './entity'
import { uploadRoot } from '../../config'

@Controller()
export class UploadController {
    constructor(
        @Inject(UploadService)
        private readonly service: UploadService,
    ) {}

    @Get('upload')
    list(): Promise<Upload[]> {
        return this.service.find()
    }

    @Post('upload')
    @HttpCode(201)
    @UseInterceptors(FileInterceptor('file', { dest: uploadRoot }))
    upload(
        @UploadedFile() file: Express.Multer.File // Express.Multer.File is in global namespace
    ): Promise<Upload> {
        if (!file) throw new HttpException('No file uploaded', 400)
        return this.service.create(file)
    }

    @Get('upload/:id')
    view(
        @Param() id: number,
    ): Promise<Upload> {
        return this.service.findOne(id)
    }

    @Get('upload/:id/download')
    async download(
        @Param() id: number,
        @Res() res: Response,
    ): Promise<void> {
        const upload = await this.service.findOne(id)

        // sendFile is the preferred method here - under the hood it uses a library
        // called send which handles partials and conditional GETs
        return res.sendFile(upload.path, { headers: {
            'Content-Disposition': `attachment; filename="${upload.filename}"`,
            'Content-Type': upload.mime
        }})
    }
}
