import { Controller, Get, Render } from '@nestjs/common'

@Controller()
export class M1cr0blogController {
    @Get()
    @Render('index')
    root() {
        return {message: 'Hello world!'}
    }
}
