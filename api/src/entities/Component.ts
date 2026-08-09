import {
  AfterInsert,
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Length, ValidateNested } from "class-validator";
import { Version } from "./Version";
import { CreateInput, UpdateInput } from "../utils/Input";
import { Relation } from "./Relation";

@Entity()
export class Component extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  @Length(3, 255)
  tag!: string;

  @OneToOne(() => Version, { nullable: true })
  @JoinColumn()
  currentVersion!: Version;

  @OneToMany(() => Version, (version) => version.component)
  versions!: Version[];

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => User)
  createdBy!: User;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User)
  updatedBy!: User;

  @AfterInsert()
  async createCurrentVersion() {
    if (!this.currentVersion) {
      const newVersion = new Version();
      newVersion.content = "";
      newVersion.createdBy = this.createdBy;
      await newVersion.save();

      this.currentVersion = newVersion;
      this.versions = [newVersion];
      await this.save();
    }
  }
}

export class ComponentCreateInput extends CreateInput<Component> {
  @Length(3, 255)
  tag!: string;

  async getEntity(currentUser: User): Promise<Component> {
    const newComponent = new Component();
    newComponent.tag = this.tag;
    newComponent.createdBy = currentUser;
    newComponent.updatedBy = currentUser;
    return newComponent;
  }
}

export class ComponentUpdateInput extends UpdateInput<Component> {
  @Length(3, 255)
  tag!: string;

  @ValidateNested()
  currentVersion!: Relation;

  async getEntity(
    previousEntity: Component,
    currentUser: User,
  ): Promise<Component> {
    Object.assign(previousEntity, this);
    previousEntity.updatedBy = currentUser;
    return previousEntity;
  }
}
