# Users

This entity represents the users of the application. It is used to store the user's information and to authenticate the user

A guest user can create an account freely (with the role `user`), the account must be validated using an email link. This email is sent using Resend

A simple user can only request his profile and update it. He can also delete his account

A contributor do everything like a simple user, but can create, update and delete medias. He can also create, update and delete pages. He can see all users but cannot update or delete them

An admin can do everything like a contributor, but can manage user aswell

## Read contraints

Read constraints should be applied on database requests (do not forget to filter data if needed) and by using class-transformer before sending data to the client. For example: `user.password` should never be returned to the client
