import { IsInt } from "class-validator";

export class Relation {
  @IsInt()
  id!: number;
}
