import {
    Controller,
    Delete,
    FileInterceptor,
    Get,
    Headers,
    HttpCode,
    Param,
    Post,
    Response,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common'
import { ApiOperation, ApiUseTags } from '@nestjs/swagger'
import { Upload } from './entity'
import { UploadsService, UploadsServiceDecorator as Uploads } from './service'
import { Response as IResponse } from 'express'

@ApiUseTags('Uploads')
@Controller('/api/v1/uploads')
export class UploadsController {
    @Get()
    @ApiOperation({ title: 'List' })
    list(
        @Uploads() uploads: UploadsService
    ): Upload[] {
        return uploads.find()
    }

    @Post()
    @ApiOperation({ title: 'Upload' })
    @HttpCode(201)
    @UseInterceptors(FileInterceptor('file', { dest: 'uploads' }))
    add(
        @Uploads() uploads: UploadsService,
        @UploadedFile() file: Express.Multer.File, // Express.Multer.File is in global namespace
        @Headers('x-lifespan') lifespan: number | string = 84
    ): Upload {
        return uploads.create(file, +lifespan)
    }

    @Delete(':id')
    @ApiOperation({ title: 'Delete' })
    @HttpCode(204)
    delete(
        @Uploads() uploads: UploadsService,
        @Param('id') id: string
    ): void {
        return uploads.delete(id)
    }

    @Get(':userId/:id')
    @ApiOperation({ title: 'View' })
    @HttpCode(200)
    view(
        @Uploads() uploads: UploadsService,
        @Param('id') id: string
    ): Upload {
        return uploads.findOne(id)
    }

    @Get(':userId/:id/download')
    @ApiOperation({ title: 'Download' })
    download(
        @Uploads() uploads: UploadsService,
        @Param('id') id: string,
        @Response() res: IResponse
    ): void {
        const upload = uploads.findOne(id)
        return res.sendFile(uploads.repo.getPath(upload), {
            root: '.',
            headers: {
                'Content-Disposition': `attachment; filename="${upload.filename}"`,
                'Content-Type': upload.mime
            }
        })
    }
}
