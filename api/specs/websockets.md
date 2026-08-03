# Websockets

Websockets server is written using `ws` package. The manager handle the connection and the messages. The manager is initialized in the `app.ts` file.

Manager should handle connection, check the authorization (using the same logic as the middleware `authorization.ts`), retrieve the corresponding user and store it in the connection object assiciated with the user id.

The manager should provide method to send a message to a specific user and to broadcast a message to all users.
