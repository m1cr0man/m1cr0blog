import { Get, Controller } from '@nestjs/common'

@Controller()
export class UploadController {
    @Get('upload')
    root(): string {
        return 'Hello werld!'
    }
}
