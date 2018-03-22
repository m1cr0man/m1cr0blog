import { NestFactory } from '@nestjs/core'
import { M1cr0blogModule } from './modules/m1cr0blog/module'

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create(M1cr0blogModule)

	await app.listen(3000)
}

bootstrap()
