import { BaseEntity } from "typeorm";
import { User } from "../entities/User";

export abstract class Input<T extends BaseEntity> {
  abstract getValidatedEntity(previousEntity?: T): Promise<T>;
}

export abstract class CreateInput<T extends BaseEntity> {
  abstract getEntity(currentUser: User): Promise<T>;
}

export abstract class UpdateInput<T extends BaseEntity> {
  abstract getEntity(previousEntity: T, currentUser: User): Promise<T>;
}
