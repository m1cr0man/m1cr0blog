import { Controller, Get, Inject, Param, Query, Render, UseGuards } from '@nestjs/common'
import { ApiUseTags } from '@nestjs/swagger'
import { TEMPLATE_DATA_ADMIN } from '../../constants'
import { AuthGuard, UserService } from '../users'
import { BackgroundsService } from './service'


@ApiUseTags('Backgrounds Admin')
@UseGuards(AuthGuard)
@Controller('/admin/users/:userId/backgrounds')
export class BackgroundsAdminController {
    constructor(
        @Inject(UserService)
        private readonly service: UserService
    ) {
    }

    getService(userId: string): BackgroundsService {
        return new BackgroundsService(this.service.findOne(userId).backgrounds)
    }

    @Get()
    @Render('admin/backgrounds/index')
    adminBackgroundsHome(
        @Param('userId') userId: string
    ) {
        const ents = this.getService(userId).find()
        const binned_tags = ents.reduce((group, ent) => {
            for (let tag of ent.tags) {
                group[tag] = (group[tag] || 0) + 1
            }
            return group
        }, {})
        const tags = Object.keys(binned_tags).map(t => ({name: t, images: binned_tags[t]}))
        return {...TEMPLATE_DATA_ADMIN, tags}
    }

    @Get('add')
    @Render('admin/backgrounds/add')
    adminBackgroundsAdd(
        @Param('userId') userId: string
    ) {
        return {...TEMPLATE_DATA_ADMIN, userId}
    }

    @Get(':tag/')
    @Render('admin/backgrounds/edit')
    adminBackgroundsEdit(
        @Param('userId') userId: string,
        @Param('tag') tag: string,
        @Query('page') page?: string
    ) {
        const intpage = (page && +page) || 0
        const query = this.getService(userId).find().filter(x => x.tags.indexOf(tag) + 1)
        const images = query.slice(intpage * 20, (intpage + 1) * 20)
        return {...TEMPLATE_DATA_ADMIN, userId, tag, images}
    }
}
