import {
    Controller,
    Delete,
    FileInterceptor,
    Get,
    HttpCode,
    HttpException,
    Inject,
    Param,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common'
import { ApiOperation, ApiUseTags } from '@nestjs/swagger'
import { Upload } from './entity'
import { UploadsService } from './service'
import { AuthedUser } from '../../auth.middleware'
import { User } from '../users/entity'
import { UserService } from '../users/service'
import { ReadStream } from 'fs'

@ApiUseTags('Uploads')
@Controller('/api/v1/uploads')
export class UploadsController {
    constructor(
        @Inject(UserService)
        private readonly userService: UserService,
    ) {}

    @Get()
    @ApiOperation({ title: 'List' })
    list(
        @AuthedUser() user: User
    ): Upload[] {
        return UploadsService.find(user)
    }

    @Post()
    @ApiOperation({ title: 'Upload' })
    @HttpCode(201)
    @UseInterceptors(FileInterceptor('file', { dest: 'uploads' }))
    async add(
        @AuthedUser() user: User,
        @UploadedFile() file: Express.Multer.File // Express.Multer.File is in global namespace
    ): Promise<Upload> {
        return UploadsService.create(user, file)
    }

    @Delete(':id')
    @ApiOperation({ title: 'Delete' })
    @HttpCode(204)
    delete(
        @AuthedUser() user: User,
        @Param() params: { id: string }
    ): void {
        return UploadsService.delete(user, params.id)
    }

    @Get(':user/:id')
    @ApiOperation({ title: 'View' })
    @HttpCode(200)
    view(
        @Param() params: { id: string, user: string }
    ): Upload {
        const user = this.userService.findOne(params.user)
        const upload = user.uploads.findOne(params.id)
        if (!upload) throw new HttpException('Upload not found', 404)
        return upload
    }

    @Get(':user/:id/download')
    @ApiOperation({ title: 'Download' })
    // TODO add file name header
    download(
        @Param() params: { id: string, user: string }
    ): ReadStream {
        const user = this.userService.findOne(params.user)
        return UploadsService.read(user, params.id)
    }
}
