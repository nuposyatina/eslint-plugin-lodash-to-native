# eslint-plugin-lodash-to-native

lodash to native

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-lodash-to-native`:

```
$ npm install https://github.com/nuposyatina/eslint-plugin-lodash-to-native --save-dev
```

## Usage

Add `lodash-to-native` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "lodash-to-native"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "lodash-to-native/rule-name": 2
    }
}
```

## Supported Rules

lodash-to-native/map — fix lodash map method to native Array map method





