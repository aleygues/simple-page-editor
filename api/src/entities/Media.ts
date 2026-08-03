import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Media extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  path!: string;

  @Column()
  mimetype!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => User)
  createdBy!: User;
}
