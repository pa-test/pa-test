# Press Association technical test

[![CircleCI](https://circleci.com/gh/pa-test/pa-test/tree/master.svg?style=shield&circle-token=26dd2415adee2f563094d2c989386cf184319c53)](https://circleci.com/gh/pa-test/pa-test/tree/master)<br>
(master)

[![CircleCI](https://circleci.com/gh/pa-test/pa-test/tree/develop.svg?style=shield&circle-token=26dd2415adee2f563094d2c989386cf184319c53)](https://circleci.com/gh/pa-test/pa-test/tree/develop)<br>
(develop)

## Install

1. Install Node and MongoDB
2. `git clone https://github.com/pa-test/pa-test`
3. `npm install`
4. Start a MongoDB server on `localhost`
5. `npm test`
6. `node ./app/api/api.js`

Notes: default server address, port is `localhost`, `8080`; see commit list for CircleCI test history

## API Docs

Choose from the following categories: `["world", "politics", "technology", "culture", "business", "lifestyle", "sports"]`.
Categories are case insensitive and whitespace insensitive.

### Upload an article

* Location: `/upload`
* Method: POST
* Format: JSON
* Layout example:
```
{
    "publishDate": "2012-04-23T18:25:43.511Z",  // Not required, ISO date format
    "categories": ["sports", "world"],  // At least one category required
    "article": {
        "author": "Don Smith",  // Required
        "headline": "This is a great article",  // Required
        "content": "Lorem ipsum dolor sit amet..."  // Required
    }
}
```

### Subscribe to selected categories

Call this endpoint more than once to add new categories.
New categories will be appended, duplicate categories will be ignored.

* Location: `/subscribe`
* Method: POST
* Format: JSON
* Layout example:
```
{
    "email": "johnsmith@gmail.com",  // Required
    "categories": ["world", "technology"]  // At least one category required
}
```

### Unsubscribe from selected categories

Leave categories blank to remove the subscriber from the database.
Unsubscribe from all subscribed categories to remove the subscriber from the database.
Categories that a subscriber is already unsubscribed from will be ignored.

* Location: `/unsubscribe`
* Method: POST
* Format: JSON
* Layout example:
```
{
    "email": "johnsmith@gmail.com",  // Required
    "categories": ["world"]  // Not required
}
```

### [For testing only] Reset the whole database

Remove all article and subscription entries from the database.

* Location: `/reset`
* Method: POST
