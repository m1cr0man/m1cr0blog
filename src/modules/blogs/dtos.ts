import { ApiModelProperty } from '@nestjs/swagger'


export class CreateBlogDto {
    @ApiModelProperty()
        // @ts-ignore
    url: string

    @ApiModelProperty()
        // @ts-ignore
    title: string

    @ApiModelProperty()
        // @ts-ignore
    timestamp: Date

    @ApiModelProperty()
        // @ts-ignore
    markdown: string
}


export class UpdateBlogDto extends CreateBlogDto {
    @ApiModelProperty()
        // @ts-ignore
    published: boolean = false

    @ApiModelProperty()
        // @ts-ignore
    tags: string[]
}
