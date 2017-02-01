# Angular Rome

An Angular directive wrapping [Rome](http://bevacqua.github.io/rome/).

## Installation

### npm
```
npm i angular-rome --save
```

Then inject it into your Angular module.
```js
require('angular-rome');

angular.module('whatevs', [
  'rome'
]);
```


## Usage

Basic Example
```html
<rome ng-model="vm.whatevs"></rome>
```

All The Things
```html
<rome ng-model="vm.whatevs" options="vm.options"></rome>
```

## Properties
```options```
You can pass an object with any options handled by Rome, they will be pased through to the Rome instance.

```options.inputClass```
Allows to pass the CSS classes string that will be applied to the Rome input

Aside of that after the instance of Rome will be created you will be able to call ```getApi()``` method
that will get bound to your ```options``` object to get the underlying Rome instance API.

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## History

TODO: Write history

## Credits

* Nicolas Bevacqua for beautifully crafting [Rome](http://bevacqua.github.io/rome/).

## License

See LICENSE.
