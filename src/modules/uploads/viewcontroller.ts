import { Controller, Get, Param, Render, Request } from '@nestjs/common'
import { ApiOperation, ApiUseTags } from '@nestjs/swagger'
import { Request as IRequest } from 'express'
import { PageMetadata, TEMPLATE_DATA } from '../../constants'
import { UploadsPipe } from './pipe'
import { UploadsService } from './service'


@ApiUseTags('Uploads Viewer')
@Controller('/upload/:userId/:id')
export class UploadsViewController {

    @Get()
    @ApiOperation({title: 'View'})
    @Render('uploads')
    view(
        @Param('userId', UploadsPipe) uploads: UploadsService,
        @Param('userId') userId: string,
        @Param('id') id: string,
        @Request() req: IRequest
    ) {
        const upload = uploads.findOne(id)
        const type = {
            isImage: upload.mime.includes('image'),
            isVideo: upload.mime.includes('video'),
            isAudio: upload.mime.includes('audio'),
            isText: upload.mime.includes('text')
        }

        const downloadPath = `/api/v1/uploads/${userId}/${upload.id}/download`
        const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`

        const meta: PageMetadata = {
            ...TEMPLATE_DATA,
            title: upload.filename,
            url,
            description: `${upload.filename}: Uploaded on ${upload.date.toDateString()}. Size: ${upload.size}`,
            image: (type.isImage) ? url + downloadPath : undefined,
            date: upload.date.toDateString(),
        }

        return {...meta, upload, type, downloadPath}
    }
}
