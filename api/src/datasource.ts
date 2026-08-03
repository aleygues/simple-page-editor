import { DataSource } from "typeorm";
import { Logger } from "./utils/Logger";

const entityPath = __dirname + "/entities/*.{ts,js}";
Logger.debug("datasource", "DataSource configured", { entityPath });

export const datasource: DataSource = new DataSource({
  type: "better-sqlite3",
  database: process.env.DB_PATH || "./app-data/db/database.sqlite",
  logging: false,
  synchronize: true,
  entities: [entityPath],
});
