Pint
====

A social network for actually being social.

Pint allows you to arrange a shared calendar with your friends, helping you
make plans with ease.

I want to build it on an Express server with React somewhere in there. I'm not sure yet.

Development
-----------

Clone the repo, install the dependencies, start the database, run the app.
> You'll need to open a new terminal session after starting mongo.

```bash
$ git clone git@github.com:trmml/Pint.git
$ cd Pint && yarn install
$ mongod # starts on 27017
$ yarn run start # browse localhost:8030
```

If you want additional logging, you can run `index.js` with a few environment variables.

```bash
$ DEBUG="info,express:router" nodemon
```

> If you're using Fish shell, just prepend `env` to the former command

TODO
----

### UI
- Look into colour scheme because the current one sucks
- Create a navigation bar cause I suck at UI (user settings, logout, etc)

### Routing
- Home/index
- Register/Login
- Profiles (/username)

Contributing
------------

If you'd like to help, feel free to fork the repo and create a branch
for the addition/feature/fix you're contributing.

Before pushing, make sure you verify you're following
the [ESLint](https://eslint.org/docs/rules/) style guide,
and that your code runs successfully. You can verify both of these with
a simple yarn command.

```bash
$ yarn run check
```

License
-------

Code and documentation is licenced under [MIT](LICENSE).
