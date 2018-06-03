import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { M1cr0blogModule } from './modules/m1cr0blog/module'

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(M1cr0blogModule, { cors: true })

    // Set up static content rendering
    app.useStaticAssets(__dirname + '/static')
    app.setBaseViewsDir(__dirname + '/views')
    app.setViewEngine('hbs')

    // Set up Swagger
    const options = new DocumentBuilder()
        .setTitle('M1cr0blog API')
        .setDescription('Backend REST API for m1cr0man\'s blog')
        .setVersion('1.0')
        .addTag('Users', 'User management system')
        .addBearerAuth()
        .build()
    const document = SwaggerModule.createDocument(app, options)
    SwaggerModule.setup('api/swagger', app, document)

    await app.listen(3000)
}

bootstrap()
