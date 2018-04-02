import { Upload } from './entity'

export class UploadResponseDto {
    // @ts-ignore
    id: number
    // @ts-ignore
    owner: string
    // @ts-ignore
    filename: string
    // @ts-ignore
    size: number
    // @ts-ignore
    mime: string
    // @ts-ignore
    date: Date

    constructor(upload: Upload) {
        this.id = upload.id
        this.owner = (upload.user || {}).name
        this.filename = upload.filename
        this.size = upload.size
        this.mime = upload.mime
        this.date = upload.date
    }
}
