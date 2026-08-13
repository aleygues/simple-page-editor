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
import {
  IsDate,
  IsOptional,
  Length,
  MinLength,
  ValidateNested,
} from "class-validator";
import { Version } from "./Version";
import { CreateInput, UpdateInput } from "../utils/Input";
import { Relation } from "./Relation";
import { getUniqueSlug } from "../utils/getUniqueSlug";

@Entity()
export class Page extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @Length(3, 255)
  title!: string;

  @Column({ unique: true })
  slug!: string;

  @Column({ nullable: true })
  @MinLength(3)
  description?: string;

  @Column({ default: true })
  inSitemap!: boolean;

  @OneToOne(() => Version, { nullable: true })
  @JoinColumn()
  currentVersion!: Version;

  @OneToMany(() => Version, (version) => version.page)
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

export class PageCreateInput extends CreateInput<Page> {
  @Length(3, 255)
  title!: string;

  @Length(3, 255)
  @IsOptional()
  slug!: string;

  @MinLength(3)
  description?: string;

  @IsOptional()
  inSitemap?: boolean;

  async getEntity(currentUser: User): Promise<Page> {
    const newPage = new Page();
    newPage.title = this.title;
    newPage.description = this.description;
    newPage.slug = await getUniqueSlug(this.slug || this.title);
    newPage.description = this.description;
    newPage.inSitemap = this.inSitemap ?? true;
    newPage.createdBy = currentUser;
    newPage.updatedBy = currentUser;
    return newPage;
  }
}

export class PageUpdateInput extends UpdateInput<Page> {
  @Length(3, 255)
  title!: string;

  @Length(3, 255)
  slug!: string;

  @MinLength(3)
  description?: string;

  @IsOptional()
  inSitemap?: boolean;

  @ValidateNested()
  currentVersion!: Relation;

  async getEntity(previousEntity: Page, currentUser: User): Promise<Page> {
    Object.assign(previousEntity, this);

    if (this.slug && this.slug !== previousEntity.slug) {
      previousEntity.slug = await getUniqueSlug(this.slug);
    }

    if (this.inSitemap !== undefined) {
      previousEntity.inSitemap = this.inSitemap;
    }

    previousEntity.updatedBy = currentUser;
    return previousEntity;
  }
}
