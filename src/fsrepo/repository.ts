import * as fs from 'fs'
import * as path from 'path'
import { BaseEntity } from './entity'

export class Repository<Entity extends BaseEntity> {
    root: string
    enttype
    metafile: string = 'data.json'

    constructor(root: string, enttype: { new(...args: any[]): Entity }, metafile?: string) {
        this.root = root
        this.enttype = enttype
        this.metafile = metafile || this.metafile

        if (!fs.existsSync(root)) fs.mkdirSync(root)
    }

    protected writeData(ent: Entity) {
        fs.writeFileSync(
            this.getMetaPath(ent),
            ent.toJSON(true)
        )
    }

    protected readData(id: string): Entity {
        return this.enttype.fromSerializableObject(JSON.parse(
            fs.readFileSync(path.join(this.root, id, this.metafile)
            ).toString('utf-8')
        ))
    }

    generateId(ent: Entity): string {
        const id = Math.random().toString(36).slice(-3)
        return (fs.existsSync(path.join(this.root, id))) ? this.generateId(ent) : id
    }

    getDir(ent: Entity): string {
        return path.join(this.root, ent.id)
    }

    getMetaPath(ent: Entity): string {
        return path.join(this.getDir(ent), this.metafile)
    }

    exists(id: string): boolean {
        return fs.existsSync(path.join(this.root, id))
    }

    save(ent: Entity): boolean {
        ent.id = this.generateId(ent)
        const dir = this.getDir(ent)

        // generateId can be overloaded to return non-unique IDs
        // Make sure that the path doesn't already exist
        // TODO handle the false return
        if (fs.existsSync(dir)) return false
        fs.mkdirSync(dir)

        this.writeData(ent)

        return true
    }

    merge(ent: Entity, new_ent: Partial<Entity>): Entity {
        return new this.enttype({
            ...ent as object,
            ...new_ent as object,
            // Don't let people change the original object ID
            id: ent.id
        })
    }

    delete(ent: Entity): void {
        if (fs.existsSync(this.getDir(ent))) fs.unlinkSync(this.getDir(ent))
    }

    findOne(id: string): Entity | false {
        return typeof id == 'string' && this.exists(id) && this.readData(id)
    }

    find(): Entity[] {
        return fs.readdirSync(this.root).map(x => this.readData(x))
    }
}
