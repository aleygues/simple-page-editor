import {
  IsDate,
  IsEmail,
  IsHash,
  IsEnum,
  IsStrongPassword,
  IsOptional,
  IsIn,
  IsString,
} from "class-validator";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Entity,
} from "typeorm";
import { CreateInput, Input } from "../utils/Input";
import * as argon2 from "argon2";
import { addHours } from "date-fns";
import { randomBytes } from "crypto";

export enum UserRole {
  USER = "user",
  CONTRIBUTOR = "contributor",
  ADMIN = "admin",
}

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @IsEmail()
  email!: string;

  @Column()
  @IsHash("sha256")
  password!: string;

  @Column({ default: false })
  @IsIn(["pending", "active", "blocked"])
  state: "pending" | "active" | "blocked" = "pending";

  @Column({ nullable: true })
  @IsOptional()
  passwordToken?: string;

  @Column({ nullable: true })
  @IsDate()
  @IsOptional()
  passwordTokenExpiresAt?: Date;

  @Column({ default: UserRole.USER })
  @IsEnum(UserRole)
  role: UserRole = UserRole.USER;

  @CreateDateColumn()
  @IsDate()
  createdAt!: Date;

  @UpdateDateColumn()
  @IsDate()
  updatedAt!: Date;

  generatePasswordToken(): { token: string; expiresAt: Date } {
    const token = randomBytes(32).toString("hex");
    const expiresAt = addHours(new Date(), 24);

    this.passwordToken = token;
    this.passwordTokenExpiresAt = expiresAt;

    return { token, expiresAt };
  }
}

export class UserInput extends Input<User> {
  @IsEmail()
  email!: string;

  @IsStrongPassword()
  password!: string;

  async getValidatedEntity(previousEntity?: User): Promise<User> {
    if (!previousEntity) {
      const user = new User();

      user.email = this.email;
      user.password = await argon2.hash(this.password);

      return user;
    } else {
      // TODO
      return previousEntity;
    }
  }
}

export class UserTokenCreateInput extends CreateInput<User> {
  @IsEmail()
  email!: string;

  @IsStrongPassword()
  password!: string;

  async getEntity(currentUser: User): Promise<User> {
    const user = new User();

    user.email = this.email;
    user.password = this.password;

    return user;
  }
}

export class UserPasswordInput extends Input<User> {
  @IsString()
  passwordToken!: string;

  @IsStrongPassword()
  password!: string;

  async getValidatedEntity(user?: User): Promise<User> {
    if (user) {
      if (!user.passwordTokenExpiresAt) {
        throw new Error("Password token expiration datetime is missing");
      }

      if (user.passwordTokenExpiresAt > new Date()) {
        throw new Error("Password token is expired");
      }

      user.password = await argon2.hash(this.password);
      user.passwordToken = undefined;
      user.passwordTokenExpiresAt = undefined;
      return user;
    } else {
      throw new Error("Cannot create password");
    }
  }
}
