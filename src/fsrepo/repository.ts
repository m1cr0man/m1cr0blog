import { HttpException } from '@nestjs/common'
import * as fs from 'fs'
import * as path from 'path'
import { BaseEntity } from './entity'

function recursiveDelete(fpath: string): void {
    if (!fs.existsSync(fpath)) return

    const stats = fs.lstatSync(fpath)

    if (stats.isDirectory()) {
        for (let child of fs.readdirSync(fpath)) recursiveDelete(path.join(fpath, child))
        fs.rmdirSync(fpath)
    } else {
        fs.unlinkSync(fpath)
    }
}

export class Join<Entity extends BaseEntity> {
    constructor(
        public repo: Repository<any>,
        public field: keyof Entity
    ) {}

    load(id: string): any {
        return this.repo.findOne(id)
    }
}

export class Repository<Entity extends BaseEntity> {
    constructor(
        public root: string,
        public enttype: { new(...args: any[]): Entity, fromJSON(data: any): Entity },
        public idLength: number = 3,
        public metafile: string = 'data.json',
        public joins: Join<Entity>[] = []
    ) {
        if (!fs.existsSync(root)) fs.mkdirSync(root)
    }

    protected writeData(ent: Entity) {
        fs.writeFileSync(
            this.getMetaPath(ent),
            JSON.stringify(ent.toJSON(true, false))
        )
    }

    protected readData(id: string): Entity {
        const jsonData = JSON.parse(
            fs.readFileSync(path.join(this.root, id, this.metafile))
            .toString('utf-8')
        )
        // noinspection JSMismatchedCollectionQueryUpdate
        const joinData: {[index: string]: any} = {}
        this.joins.map(x => joinData[x.field] = x.load(id))
        return this.enttype.fromJSON({
            ...jsonData,
            ...joinData
        })
    }

    generateId(): string {
        const id = Math.random().toString(36).slice(-this.idLength)
        return (fs.existsSync(path.join(this.root, id))) ? this.generateId() : id
    }

    getDir(ent: Entity): string {
        return path.join(this.root, ent.id)
    }

    getMetaPath(ent: Entity): string {
        return path.join(this.getDir(ent), this.metafile)
    }

    exists(id: string): boolean {
        return fs.existsSync(path.join(this.root, id, this.metafile))
    }

    save(ent: Entity): boolean {
        const dir = this.getDir(ent)

        if (!fs.existsSync(dir)) fs.mkdirSync(dir)

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
        recursiveDelete(this.getDir(ent))
    }

    findOne(id: string): Entity {
        if (!this.exists(id)) throw new HttpException(`Entity ${id} not found`, 404)
        return this.readData(id)
    }

    find(): Entity[] {
        return fs.readdirSync(this.root)
            .filter(x => this.exists(x))
            .map(x => this.readData(x))
    }
}
