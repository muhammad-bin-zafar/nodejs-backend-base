<p align=center>
<img height=auto width=400 src="https://user-images.githubusercontent.com/90899789/175958801-35e9eb1a-c26c-4f2c-9e92-734862b15db0.png"/>
</p>

<p align=center>
	<img heigh=auto width=400 src="https://cdn.pixabay.com/photo/2015/04/23/17/41/node-js-736399_960_720.png"/>
	<p align=center><b>D E V &nbsp;&nbsp;&nbsp; G U I D E L I N E S</b></p>
</p>
<hr></hr>

The purpose of the guidelines are:
- to bring consistency & uniformity in Node.js backend code
- to enable developers to focus on the business value, instead of the backend application itself
- to enable developers to write code faster, that are:
	- clean
	- readable & maintainable
	- scalable

Some files are added as examples in the folder structure.

### Features
- Simple & scalable project structure
- Consistent dev environment
	- precommit hooks to format code, for uniformity in code style
	- support for multiple platform i.e. Windows, Mac, Linux
- TypeScript-integrated ORM, Sequelize
- TypeScript-integrated validator, Joi
- TypeScript-integrated tests for API response compatibility, to check and fail tests, if there are:
	- changes in properties' data-type
	- new properties
	- removed properties
	- null-able properties
- (todo) Built-in support for file upload
- (todo) Built-in security features

<!--
## REST API
One of the most important guiding principles of REST is _stateless_. 
Meaning, the requests do not reuse any previous context. Each request
contains enough info to understand the individual request.

## Concepts
In REST, the primary data representation is called a "resource".

- `users` is a **collection** (collection resouce, plural naming), identified by `/users`.
- `user` is a **document**(singleton resource, singular naming), identified by `/users/{userId}`.
- A **controller** (named as a Verb) is an executable function, with parameters and return values, an example: `/users/{userId}/cart/pay`.
- **Sub-collection resources** are nested. In the URI `/users/{userId}/repositories`, "repositories" is a sub-collection resource. Similarly, a singleton in that sub-collection will be `/users/{userId}/repositories/{repositoryId}`.


## Consistency
Some constraints in REST API naming ensures a design of scalable API endpoints:
- Use nouns to name represent resources. Example: `users`, `orders`, `categories`.
- Use hypen, not underscores. Use lowercase letters in URI, never camel-case. `GET /food-categories`.
- No trailing forward slash. Example: `GET /users/` is wrong, and `GET /users` is correct.
- Never use CRUD function names in URIs. Rather:
	- `GET /users` - get all users.
	- `GET /users/:id` - get a single user.
	- `POST /users/:id` - create a single user.
	- `PUT /users/:id` - update a single user.
	- `DELETE /users/:id` - delete a single user.
- Use query components to filter collection, never use for anything else. Example: `/users?region=Malaysia&sort=createdAt`.


# Data Transfer Objects
Joi is used to validate/sanitize the client data. JSON is primarily supported.
The purpose of request fields are:
- `req.body`: 
	- To send data in POST and PUT
	- To create/update. 
	- In many platforms, in a GET request, the request body is ignored/removed. Example: Swagger.
- `req.query`: 
	- To control what data is returned in endpoint responses.
	- To sort.
	- To filter.
	- To add search condition.
	- Example: `/users?region=Malaysia&sort=createdAt`.
- `req.params`:
	- Path variables are used to get a singleton from a collection resource.
	- Example: `GET /users/{userId}`, `GET /categories/{id}`.

To get type-annotated & type-safe DTO:
```ts
// file: src/modules/user/controller.ts
import {Request} from 'express'
import dto from '@src/dto'

function signup (req:Request, res) {
	const data = req.data(dto.user.signup, 'body')
	data.email = 123 // TS ERROR, since TS knows that `email` is `string`.
}
```


# Data Access Objects
Sequelize is the most popular Node.js ORM in the entire NPM registry. Sequelize and Prisma compete 
closely, so they are almost the same popular. However, much of the features of Sequlize requires
dynamic configuration internally. So static analysis doesn't become possible, and Sequelize doesn't
provide much advantage of type-anotation with TypeScript. That's why efforts were undertaken in this regard.

To get type-annotated & type-safe DAO:
```ts
// file: src/modules/user/controller.ts
import db from '@src/db'

async function login (req, res) {
	const user = await db.user.findById(10)
	user.email = 123 // TS ERROR, since TS knows that `email` is `string`.
	user.save()
}
```
-->
