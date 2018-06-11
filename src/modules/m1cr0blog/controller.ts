import { Controller, Get, Render } from '@nestjs/common'

const TEMPLATE_DATA = {
    titleSuffix: 'M1cr0man\'s blog',
    title: 'M1cr0man\'s blog',
    mainClasses: '',
    meta: {
        url: '/'
    }
}

@Controller()
export class M1cr0blogController {
    @Get()
    @Render('index')
    root() {
        return {...TEMPLATE_DATA, message: 'Hello world!'}
    }
}
