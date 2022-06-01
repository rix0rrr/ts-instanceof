# ts-instanceof

A robust replacement for JavaScript's built-in `instanceof`, for use in TypeScript libraries.

We often want to know whether an object is an instance of a certain class. This library
will help you create a function to type-test objects for being instances of the class.

## Usage

After defining a class, call `makeInstanceOf()` on it:

```ts
import { makeInstanceOf } of 'ts-instanceof';

class MyClass {
  public sayHello() {
    console.log('hello');
  }
}
const isMyClass = makeInstanceOf(MyClass, '@my/package', { // Your package name to disambiguate
  // Optional, taken from the class if not given. To support refactoring
  // or disambiguation.
  // typeName: 'MyClass'

});

const object = new MyClass();
console.log(isMyClass(object)); // true
console.log(isMyClass(new Date())); // false
```

### Versioning

By default, this library doesn't take version compatibility into account. That
is, if you have multiple copies of your library at different versions, and the
features between the classes are not the same, it may return `true` even though
the object you have is an instance of an *old* version of the class.

To address this, include which fields you are about to use:

```ts
function useStrangeObject(object: unknown) {

  // Will return 'false' if this happens to be an old version of 'MyClass'
  // that doesn't have 'sayHello' yet.
  if (isMyClass(object, 'sayHello')) {
    object.sayHello();
  }
}
```

## What's wrong with `instanceof` ?

JavaScript contains an `instanceof` operator which does exactly this:

```js
const object = new MyClass();
console.log(object instanceof MyClass); // true
```

So that's the need for this library?

The problem with `instanceof` is that Node has a limited view of the world: because Node doesn't
have the concept of packages, it has to resort to identifying a class by what **file** it's in.

Combine this with the fact that:

* NPM may install multiple copies of your library, if there are different versions of it in the
  dependency tree.
* Users may work on NPM projects locally by symlinking them together using `npm link`: if both of
  these projects use your library, they will both have their own copy of your library.

In both of these cases there will be multiple definitions of `MyClass`, and none
of them will be `instanceof`-compatible with each other.

Instead, this library stamps class constructors with a hidden symbol with a unique string,
and will test for the presence of this hidden symbol, so all copies of `MyClass` will test
as instances of each other.
