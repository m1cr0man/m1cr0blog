import { Body, Controller, Get, Inject, Param, Post, Render, Response, UseGuards } from '@nestjs/common'
import { ApiUseTags } from '@nestjs/swagger'
import { Response as IResponse } from 'express'
import { TEMPLATE_DATA_ADMIN } from '../../constants'
import { CreateUserDto } from './dtos'
import { AuthGuard } from './guard'
import { UserService } from './service'


@ApiUseTags('Users Admin')
@UseGuards(AuthGuard)
@Controller('/admin/users')
export class UserAdminController {
    constructor(
        @Inject(UserService)
        private readonly service: UserService
    ) {
    }

    @Get()
    @Render('admin/users/index')
    adminUsersHome() {
        const users = this.service.find()
        return {...TEMPLATE_DATA_ADMIN, users}
    }

    @Get(':id/')
    @Render('admin/users/edit')
    adminUsersEdit(
        @Param('id') id: string
    ) {
        const user = this.service.findOne(id)
        return {...TEMPLATE_DATA_ADMIN, user}
    }

    @Post(':id/')
    async adminUsersUpdate(
        @Param('id') id: string,
        @Body() updateUserDto: Partial<CreateUserDto>,
        @Response() res: IResponse
    ) {
        // Filter out an empty password field
        const data: { name?: string, password?: string } = {name: updateUserDto.name}
        if ((updateUserDto.password || '').length)
            data.password = updateUserDto.password
        await this.service.update(id, data)
        return res.redirect('./')
    }
}
