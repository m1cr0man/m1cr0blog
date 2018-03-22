import { Get, Controller } from '@nestjs/common'

@Controller()
export class M1cr0blogController {
    @Get()
    root(): string {
        return 'Hello world!'
    }
}
