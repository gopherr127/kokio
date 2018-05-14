# Kokio

Kokio is a test case and execution management system.
The web application is based on the Ionic PWA Toolkit.

***Note: More information to come.***

## Features

- Create and manage test cases
- Create and manage test sets as collections of test cases
- Create and manage test runs as executions of test within test sets

## Getting Started with Local Development

To start building Kokio locally, clone this repo to a new directory:

```bash
git clone https://github.com/gopherr127/kokio.git
cd kokio
git remote rm origin
```

and run:

```bash
npm install
npm start
```

## Creating Production Builds

To build Kokio for production, run:

```bash
npm run build
```

## Unit Tests

To run the unit tests once, run:

```bash
npm test
```

To run the unit tests and watch for file changes during development, run:

```bash
npm run test.watch
```