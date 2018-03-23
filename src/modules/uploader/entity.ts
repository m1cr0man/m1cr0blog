import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm'

@Entity()
export class Upload {
    @PrimaryGeneratedColumn()
    // @ts-ignore
    id: number 

    @Column(type => String)
    // @ts-ignore
    filename: string 

    @CreateDateColumn()
    // @ts-ignore
    date: Date 
}
