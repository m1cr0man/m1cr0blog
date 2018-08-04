import { Controller, Get, Param, Render, Request } from '@nestjs/common'
import { ApiOperation, ApiUseTags } from '@nestjs/swagger'
import { Request as IRequest } from 'express'
import { TEMPLATE_DATA } from '../../constants'
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
            isImage: !!(upload.mime.indexOf('image') + 1),
            isVideo: !!(upload.mime.indexOf('video') + 1),
            isAudio: !!(upload.mime.indexOf('audio') + 1),
            isText: !!(upload.mime.indexOf('text') + 1)
        }
        const meta = {
            ...TEMPLATE_DATA.meta,
            title: upload.filename,
            url: req.hostname + '/' + req.originalUrl,
            description: `${upload.filename}: Uploaded on ${upload.date.toLocaleString()}. Size: ${upload.size}`,
            image: (type.isImage) ? 'download' : null,
            date: upload.date.toLocaleString()
        }
        const downloadPath = `/api/v1/uploads/${userId}/${upload.id}/download`

        return {...TEMPLATE_DATA, upload, meta, type, downloadPath}
    }
}
