# Rules

This project is developped using Typescript and NodeJS.

TypeORM is the ORM used to interact with the database, connected to a SQLite database. Entities uses `class-validator` to validate user input (in input classes) and class before database writes (in entities). Entities use `class-transformer` to define correctly what user can see in the output.

Express is used to handle the HTTP requests. A simple HTTP server is used to handle Express app and the Websockets server.

User autorisation is based on a JWT access token and a refresh token. Both tokens duration can be configured with env variables (with default values if needed). Both secret keys for JWT should be configured with an env variable, the app should NOT start if these secrets are not missing. These tokens should be stored in cookies and automatically renewed on each request. If the access token is invalid or expired, refresh token should automatically be used to generate a new access token. If the refresh token is invalid or expired, the user should be logged out.

Images are handled as described in the `images.md` file.

The websocket server is described in the `websockets.md` file.

## Coding rules

- use `const` instead of `let` when possible
- use `===` instead of `==`
- use `async/await` instead of `Promise.then()`
- use `try/catch` for async functions
- use `interface` instead of `type` for objects
- use `enum` for constants
- use `class` for objects with methods
- use `export default` for classes and functions
- use simple loops and conditions instead of array methods (do not use `forEach`, but `map`, `filter`, `find` and `reduce` are allowed if they do not induce higher complexity)
- use the logger class for logs
- use object notation instead of map and record if possible
- use simple array instead of sets, unless sets are required for their properties

## App architecture

- REST controllers are stored in `controllers` folder and should be named after the entity they are related to (plural), new controllers must be cloned from existing ones for consistency
- REST routes are defined in `routes` folder, they should be named explicitly and middleware (especially for authentification) must be applied carefully
- REST middlewares should be defined in `middlewares` folder
- the database is managed with TypeORM, entities are stored in `entities` folder, containing the class correctly decorated with `@Entity` and `@Column` decorators, class validator decorators are used to validate the data before saving it, input entities are described in the same file and used to define shape and transformation for user input data (so input are checked before preparing new items against the input class, and before inserting in the database against the entity class)

## Logs

Logs are written in the console using the `logger` static class which handle all logs. Logs should be prefixed with the datetime, an emoji corresponding to the type of log, a simple key to identify from where the log comes, and a message

Logs should be printed in the console and filtered by their criticality level, defined using an environment variable `LOG_LEVEL`. By default, all logs are printed
