import { existsSync, readdirSync, rename, unlink, unlinkSync } from 'fs'
import { join as j } from 'path'
import { Repository } from '../../fsrepo/repository'
import { Blog } from './entity'
import * as sharp from 'sharp'
import { promisify } from 'util'
import { getType } from 'mime'

const renamer = promisify(rename)
const unlinker = promisify(unlink)

// Both these values refer to the height
const IMAGE_SIZES = [
    256,
    384,
    600,
]

const IMAGE_MAX_SIZE = 1440

export class BlogsRepository extends Repository<Blog> {
    constructor() {
        super('blogs', Blog)
    }

    getFiles(blog: Blog): string[] {
        const dir = this.getDir(blog)
        return readdirSync(dir)
            .filter(x => x != this.metafile && !x.match(/^.*\.h\d+.webp$/))
    }

    async saveFile(blog: Blog, file: Express.Multer.File): Promise<string> {
        const extStart = file.originalname.lastIndexOf('.')
        const name = file.originalname.substr(0, extStart)

        // If the file is an image create thumbnails + convert to webp
        if (file.mimetype.includes('image')) {
            for (const height of IMAGE_SIZES) {
                await sharp(file.path)
                    .resize(null, height)
                    .webp({alphaQuality: 0})
                    .toFile(j(this.getDir(blog), name + '.h' + height + '.webp'))
            }

            // Convert to webp
            let img = sharp(file.path)
                .webp({alphaQuality: 0})

            // if image is bigger than original size resize it
            if ((await img.stats()).channels.reduce((v, s) => (v > s.maxY) ? v : s.maxY, 0) > IMAGE_MAX_SIZE) {
                img = img.resize(null, IMAGE_MAX_SIZE)
            }

            await img.toFile(j(this.getDir(blog), name + '.webp'))

            // Delete original image
            await unlinker(file.path)

            return name + '.webp'
        }

        // Not an image, just move to right location
        await renamer(file.path, j(this.getDir(blog), file.originalname))
        return file.originalname
    }

    deleteFile(blog: Blog, filename: string): void {
        const path = j(this.getDir(blog), filename)
        if (existsSync(path))
            unlinkSync(path)

        // Remove thumbnails of images
        if ((getType(path) || '').includes('image')) {
            for (const height of IMAGE_SIZES) {
                const thumbPath = path.replace('.webp', 'h' + height + '.webp')
                if (existsSync(thumbPath))
                    unlinkSync(thumbPath)
            }
        }
    }
}
