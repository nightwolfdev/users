# Users

![Users App](./src/assets/img/users-app.png)

Add, edit, and remove users, divisions, and titles.

## Getting Started

1. Clone the repo  
  `git clone https://github.com/nightwolfdev/users.git`
2. Navigate to the project folder  
  `cd users`
3. Install dependencies  
  `npm install`
4. Run both the api and app  
  `npm start`
5. Saving changes to either the apis or app will automatically refresh when `npm start` is initially run.

## App

After running `npm start`, the app will automatically open at `http://localhost:4200`.

## APIs

After running `npm start`, the api server will be available at `http://localhost:9000`.

### Divisions
| Method  | Endpoint  | Description |
| ----------- | ----------- | ----------- |
| GET | /divisions | Get all divisions |
| GET | /divisions/:id | Get a specific division by id |
| PATCH | /divisions/:id | Update a specific division by id |
| POST | /divisions | Add a new division |

### Titles
| Method  | Endpoint  | Description |
| ----------- | ----------- | ----------- |
| GET | /titles | Get all titles |
| GET | /titles/:id | Get a specific title by id |
| PATCH | /titles/:id | Update a specific title by id |
| POST | /titles | Add a new title |

### Users
| Method  | Endpoint  | Description |
| ----------- | ----------- | ----------- |
| DELETE | /users/:id | Delete a specific user by id |
| GET | /users | Get all users |
| GET | /users/:id | Get a specific user by id |
| PATCH | /users/:id | Update a specific user by id |
| POST | /users | Add a new user |

## Database

### Start with no data

After running `npm start`, if no database file exists, one will be created automatically called `data.db`.

### Start with existing data

Create a copy of the `data-sample.db` file and rename it to `data.db`.

### Delete existing data and start over

If you want to delete existing data, delete the `data.db` file. You can start over with no data or existing data.

## Links

* [Angular](https://angular.io)
* [Clarity Design System](https://clarity.design/)
* [Express](https://expressjs.com)
* [Multiavatar](https://multiavatar.com/)
* [RxJS](https://rxjs.dev)
* [SQLite](https://www.sqlite.org)
* [TypeScript](https://www.typescriptlang.org)