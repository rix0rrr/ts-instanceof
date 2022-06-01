import { makeInstanceOf } from '../src';

test('test positive and negative cases', () => {
  class MyClass { }
  class YourClass { }

  const isMyClass = makeInstanceOf(MyClass, 'ts-instanceof');

  expect(isMyClass(new MyClass())).toBeTruthy();
  expect(isMyClass(new YourClass())).toBeFalsy();
});

test('test checking for explicit names', () => {
  class MyClass { }
  class YourClass { }

  const isMyClass = makeInstanceOf(MyClass, 'ts-instanceof', { typeName: 'x' });
  makeInstanceOf(YourClass, 'ts-instanceof', { typeName: 'x' }); // Obviously this is a bug, don't do this

  expect(isMyClass(new YourClass())).toBeTruthy();
});

test('test checking for required members', () => {
  class MyClass1 { member1() { return 1; }}
  class MyClass2 { member1() { return 1; }; member2() { return 2; }}
  const object1 = new MyClass1();
  const object2 = new MyClass2();

  const isMyClass1 = makeInstanceOf(MyClass1, 'ts-instanceof', { typeName: 'MyClass' });
  const isMyClass2 = makeInstanceOf(MyClass2, 'ts-instanceof', { typeName: 'MyClass' });

  expect(isMyClass1(object2)).toBeTruthy();
  expect(isMyClass1(object1, 'member1')).toBeTruthy();
  expect(isMyClass1(object2, 'member1')).toBeTruthy();
  expect(isMyClass2(object1, 'member2')).toBeFalsy();
  expect(isMyClass2(object2, 'member2')).toBeTruthy();
});