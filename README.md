# Express API Boilerplate

**A great express boilerplate architectured to build large scale REST apis with node and express**

## Characteristics

- General
  * Mongo DB with Mongoose as ODM
  * Docker based
  * Cache response with Redis as temporal DB
  * Dotenv and configuration module
  * Custom ApiError extende from native js error object
  * Custom error handler based on the NodeJs best practices
  * Base Service and Controller clases to avoid code repetition.

- Performance
  * Compression middleware
  * Total async code

- Security
  * Mongo sanitize to avoid Mongo directives injection
  * Security headers with helmet
  * Cors enabled
  * Input validation
  * Authentication based on JWT of short live duration with refresh token schema.
  * Authentication and Authorization middlewares
  * Request limiter middleware

- Test
  * tests template with jets


## Usage

#### Instalation

```bash
git clone git@github.com:emanuelosva/express-api-boilerplate.git <your-app-name>

cd <your-app-name>

mv .env.example .env

yarn or npm install
```

#### Run the project

First fill all the env vars neede in the .env file

```bash

# Docker
yarn build:docker
yarn dev

# In local node
yarn dev:node
```

#### Test

```bash
yarn test
```


#### Lint

```bash
yarn lint

# Or

yarn lint:fix
```

## Contributing

* If you want to add some feature only fork this repository and send a pull request.

## Author

Emanuel Osorio <emanuelosva@gmail.com>
