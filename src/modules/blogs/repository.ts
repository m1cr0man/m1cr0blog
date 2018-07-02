import { existsSync, readdirSync, renameSync, unlinkSync } from 'fs'
import { join as j } from 'path'
import { Repository } from '../../fsrepo/repository'
import { Blog } from './entity'


export class BlogsRepository extends Repository<Blog> {
    constructor() {
        super('blogs', Blog)
    }

    findOneByUrl(url: string): Blog | null {
        const blogs = this.find()
        return blogs.reduce((_: any, x) => x.url == url && x || null, null)
    }

    getFiles(blog: Blog): string[] {
        const dir = this.getDir(blog)
        return readdirSync(dir)
            .filter(x => x != this.metafile)
    }

    saveFile(blog: Blog, file: Express.Multer.File): void {
        return renameSync(file.path, j(this.getDir(blog), file.originalname))
    }

    deleteFile(blog: Blog, filename: string): void {
        const path = j(this.getDir(blog), filename)
        if (existsSync(path))
            unlinkSync(path)
    }
}
