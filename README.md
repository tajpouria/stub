# Stub [![Build Status](https://travis-ci.org/tajpouria/stub.svg?branch=master)](https://travis-ci.org/tajpouria/stub) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/9c9227f12d5949c0af19184e50ab8d16)](https://app.codacy.com/manual/tajpouria/stub?utm_source=github.com&utm_medium=referral&utm_content=tajpouria/stub&utm_campaign=Badge_Grade_Dashboard)

**UNSTABLE DESIGN DOCUMENT** definitely will change along the way!

## Services

### Authentication service [![Coverage Status](https://coveralls.io/repos/github/tajpouria/stub/badge.svg?branch=master)](https://coveralls.io/github/tajpouria/stub?branch=master)

Authenticate users using either local(email) or OAuth(Google) strategy, Send users confirmation and forgot password email, and expose JWT cookie session.

### Charge service [![Coverage Status](https://coveralls.io/repos/gitlab/tajpouria/stub-charge/badge.svg?branch=master)](https://coveralls.io/gitlab/tajpouria/stub-charge?branch=master)

Responsible to create, store, and handling linking charge to locally replicated order instance, Charges the given credit card using stripe API with given amount and publish an 'order:completed' event.

### Expiration service [![Go Report Card](https://goreportcard.com/badge/github.com/tajpouria/stub)](https://goreportcard.com/report/github.com/tajpouria/stub)

Using NSQ to publish and 'order:expired' event whenever created order expiration date exceeded.

### Order service [![Coverage Status](https://coveralls.io/repos/gitlab/tajpouria/stub-order/badge.svg?branch=master)](https://coveralls.io/gitlab/tajpouria/stub-order?branch=master)

Responsible to create, store, and handling linking order to locally replicated ticket instance and publishing 'order:created' event.

### Ticket service [![Coverage Status](https://coveralls.io/repos/gitlab/tajpouria/stub-ticket/badge.svg?branch=master)](https://coveralls.io/gitlab/tajpouria/stub-ticket?branch=master)

Responsible to create, store and managing ticket status (Created|Completed|Cancelled) by listening to order events and publish ticket updates.

### Client [![Netlify Status](https://api.netlify.com/api/v1/badges/1ddee602-c042-4e47-bd2f-5d120f28e261/deploy-status)](https://app.netlify.com/sites/stub-client/deploys)

Exposes an HTTP server to serve the Nuxt web application.

## Package

### @tajpouria/stub-common [![](https://img.shields.io/npm/v/@tajpouria/stub-common)](https://www.npmjs.com/package/@tajpouria/stub-common)

Share common modules between node-based services.

## License

Stub is [MIT licensed](LICENSE).
