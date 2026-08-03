import {
  AfterInsert,
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { IsDate, MinLength, ValidateNested } from "class-validator";
import { Page } from "./Page";
import { CreateInput, UpdateInput } from "../utils/Input";
import { Relation } from "./Relation";
import { Type } from "class-transformer";

@Entity()
export class Version extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @MinLength(3)
  content!: string;

  @ManyToOne(() => Page, (page) => page.versions)
  @JoinColumn()
  page!: Page;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => User)
  createdBy!: User;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User)
  updatedBy!: User;

  @AfterInsert()
  async updatePageCurrentPage() {
    if (this.page) {
      await Page.update(this.page.id, { currentVersion: this });
    }
  }
}

export class VersionCreateInput extends CreateInput<Version> {
  @MinLength(3)
  content!: string;

  @ValidateNested()
  @Type(() => Relation)
  page!: Relation;

  async getEntity(currentUser: User) {
    const newVersion = new Version();
    newVersion.content = this.content;
    newVersion.page = await Page.findOneOrFail({ where: { id: this.page.id } });
    newVersion.createdBy = currentUser;
    newVersion.updatedBy = currentUser;
    return newVersion;
  }
}

export class VersionUpdateInput extends UpdateInput<Version> {
  @MinLength(3)
  content!: string;

  async getEntity(previousEntity: Version, currentUser: User) {
    previousEntity.content = this.content;
    previousEntity.updatedBy = currentUser;
    return previousEntity;
  }
}
