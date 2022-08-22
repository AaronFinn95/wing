# Wing Language Reference

- [Wing Language Reference](#wing-language-reference)
  - [1. General](#1-general)
    - [1.1 Types](#11-types)
      - [1.1.1 Primitive Types](#111-primitive-types)
      - [1.1.2 Container Types](#112-container-types)
    - [1.2 Debugging Utilities](#12-debugging-utilities)
    - [1.3 Phase Modifiers](#13-phase-modifiers)
    - [1.4 Storage Modifiers](#14-storage-modifiers)
    - [1.5 Visibility](#15-visibility)
    - [1.6 Mutability](#16-mutability)
    - [1.7 Optionality](#17-optionality)
    - [1.8 Type Inference](#18-type-inference)
    - [1.9 Error Handling](#19-error-handling)
    - [1.10 Formatting](#110-formatting)
    - [1.11 Memory Management](#111-memory-management)
  - [2. Expressions](#2-expressions)
    - [2.1 bring expression](#21-bring-expression)
    - [2.2 break expression](#22-break-expression)
    - [2.3 continue expression](#23-continue-expression)
    - [2.4 return expression](#24-return-expression)
    - [2.5 await Expression](#25-await-expression)
  - [3. Statements](#3-statements)
    - [3.1 if statement](#31-if-statement)
    - [3.2 for statement](#32-for-statement)
    - [3.3 while statement](#33-while-statement)
  - [4. Declarations](#4-declarations)
    - [4.1 Structs](#41-structs)
    - [4.2 Interfaces](#42-interfaces)
    - [4.3 Classes](#43-classes)
    - [4.4 Resources](#44-resources)
    - [4.5 Variables](#45-variables)
    - [4.6 Functions](#46-functions)
      - [4.6.1 Free Functions](#461-free-functions)
      - [4.6.2 Closures](#462-closures)
      - [4.6.3 Futures](#463-futures)
    - [4.7 Arrays](#47-arrays)
    - [4.8 Enumeration](#48-enumeration)
  - [5. Module System](#5-module-system)
    - [5.1 Imports](#51-imports)
    - [5.2 Exports](#52-exports)
  - [6. Dependency Injection](#6-dependency-injection)
    - [6.1 Pure Resources](#61-pure-resources)
    - [6.2 Symbol Resolution](#62-symbol-resolution)
  - [7. Miscellaneous](#7-miscellaneous)
    - [7.1 Strings](#71-strings)
      - [7.1.1 Normal strings "..."](#711-normal-strings-)
      - [7.1.2 Shell strings \`...\`](#712-shell-strings-)
    - [7.2 Comments](#72-comments)
    - [7.3 Operators](#73-operators)
      - [7.3.1 Relational Operators](#731-relational-operators)
      - [7.3.2 Logical Operators](#732-logical-operators)
      - [7.3.3 Bitwise Operators](#733-bitwise-operators)
      - [7.3.4 Mathematics Operators](#734-mathematics-operators)
      - [7.3.5 Operator Precedence](#735-operator-precedence)
      - [7.3.6 Short Circuiting](#736-short-circuiting)
      - [7.3.7 Non-numeric Operators](#737-non-numeric-operators)
    - [7.4 Kitchen Sink](#74-kitchen-sink)
    - [7.6 Standard Library](#76-standard-library)
    - [7.7 Credits](#77-credits)

## 1. General

### 1.1 Types

#### 1.1.1 Primitive Types

| Name     | Extra information                         |
| -------- | ----------------------------------------- |
| `nil`    | represents the absence of a value or type |
| `any`    | represents everything and anything        |
| `bool`   | represents true or false                  |
| `number` | represents numbers (doubles)              |
| `string` | UTF-16 encoded strings                    |

> ```TS
> // Wing program:
> let x = 1;                  // x is a number
> let y = "Hello";            // y is a string
> let z = true;               // z is a boolean
> let w : any = 1;            // w is an any
> let a : mut = "World";      // a is a mutable string
> let q : opt number = nil;   // q is an optional number
> ```
>
> ```TS
> // Equivalent TypeScript:
> const x: number = 1;
> const y: string = "Hello";
> const z: boolean = true;
> const w: any = 1;
> let a: string = "World";
> const q: number? = undefined;
> ```

[`▲ top`][top]

---

#### 1.1.2 Container Types

| Name           | Extra information                     |
| -------------- | ------------------------------------- |
| `set<T>`       | set type (array of unique items)      |
| `map<T>`       | map type (key-value with string keys) |
| `enum<T>`      | enum type (enumerations of constants) |
| `array<T>`     | dynamic array of a certain type       |
| `class<T>`     | class type (object)                   |
| `future<T>`    | future type (promise)                 |
| `struct<T>`    | struct type (structural shape)        |
| `resource<T>`  | resource type (composite)             |
| `interface<T>` | interface type (contract)             |

Motivation for these types is full compatibility with the JSII type system. Due
to polyglot nature of Wing, container types are meant to represent types which
are semi-portable and representable in other programming languages.

> ```TS
> // Wing program:
> let z : set<number> = { 1, 2, 3 };
> let y : map<number> = { "a": 1, "b": 2 };
> let x = [1, 2, 3];      // x is array<number>
> let w = SampleClass();  // w is class<SampleClass>
> ```
>
> ```TS
> // Equivalent TypeScript:
> const z: Set<number> = new Set([1, 2, 3]);
> const y: Map<string, number> = new Map([["a", 1], ["b", 2]]);
> const x: number[] = [1, 2, 3];
> const w: SampleClass = new SampleClass();
> ```
>
> Code samples for `future<T>`, `struct<T>`, `resource<T>`, and `interface<T>`
> are not shown here. They are shown in their sections respectively.

[`▲ top`][top]

---

### 1.2 Debugging Utilities

| Name    | Extra information                                          |
| ------- | ---------------------------------------------------------- |
| `print` | prints anything serializable.                              |
| `panic` | exits with a serializable, dumps the trace + a core dump   |
| `check` | asserts a condition and _panics_ if evaluated to false     |
| `event` | records an arbitrary event, acts like a black-hole of data |

Wing is a statically typed language, so attempting to redefine any of the above
functions, just like any other "symbol" will result in a compile-time error.

variadic arguments are not supported in Wing at syntax level for users to define
new variadic functions. Functions above are exception to this rule:

> ```TS
> // Wing program:
> print(23, "Hello", true);
> panic("Something went wrong", [1,2]);
> check(x > 0, x < 10);
> event("Something happened", { "x": 1, "y": 2 });
> ```
>
> ```TS
> // Equivalent TypeScript:
> console.log(23, "Hello", true);
> // calling panic in wing is fatal
> (() => {
>   console.error("Something went wrong", [1,2]);
>   // generate core dump
>   // show stack trace
>   process.exit(1);
> })();
> // multiple assertions
> (() => { assert.ok(x > 0); assert.ok(x < 10); })();
> // record an arbitrary "struct" with Google Analytics backend
> (() => {
>   const { GA_TRACKING_ID } = process.env;
>   const event = [ "Something happened", { "x": 1, "y": 2 } ];
>   if (GA_TRACKING_ID) {
>     const data = {
>       "v": '1',
>       "tid": GA_TRACKING_ID,
>       "cid": '555', // when trace() is available, use trace.id
>       "t": 'event', // Event hit type. Fixed.
>       "ec": "wing", // Event category.
>       "ea": "record", // Event action.
>       // event label is source information for debugging
>       "el": 'event("Something happened", { "x": 1, "y": 2 });',
>       "ev": event,
>     };
>
>     await fetch('http://www.google-analytics.com/debug/collect', {
>       params: data,
>     }).catch(console.error);
>   }
> })();
> ```

[`▲ top`][top]

---

### 1.3 Phase Modifiers

| Name        | Extra information                          |
| ----------- | ------------------------------------------ |
| `preflight` | phase is in preflight, keyword is optional |
| `inflight`  | phase is in inflight, keyword is mandatory |

Multiple phase modifiers are invalid and forbidden.  
Phase modifier is allowed in the context of defining interfaces, and resources.
Example code is shown in the [resources](#44-resources) section.

[`▲ top`][top]

---

### 1.4 Storage Modifiers

Currently the only storage modifier is `static`. `static` indicates a definition
is only available once per program. All statics must be defined inline.  
Statics are not allowed on structs or interfaces.

Variables declared at block scope with the specifier static have static storage
duration and are initialized the first time control passes through their
declaration (unless their initialization is "nil" or constant-initialization,
which can be performed before the block is first entered). On all further calls,
the declaration is skipped. Statics are both supported in inflight as well as
preflight mode of execution.

A declaration for a static member is a member declaration whose declaration
specifiers contain the keyword static. The keyword static must appear before
other specifiers. More details in the [classes](#43-classes) section.

The name of any static data member and static member function must be different
from the name of the containing class.

Code samples for `static` are not shown here. They are shown in the relevant
sections below.

To avoid confusion, it is invalid to have a static and a non-static with the
same name. Overriding a static is allowed however. Accessing static is done via
the type name and the `.` operator.

[`▲ top`][top]

---

### 1.5 Visibility

Visibility inference is done with the following rules:

- if no visibility modifier is specified, the default is `private`.
- `public`: visibility is "public" (visible everywhere)
- `protected`: visibility is "protected" (visible to self and derived classes)
- `internal`: visibility is "internal" (C# internal).

Accessing field, member, or structured data is done with `.`.  
Wing does not support `->` or `::` or any other form of accessing addressed and
structured data.

Visibility modifiers can be applied to members of classes, resources, and free
functions. If applied to free functions, the rules are applied at module level.
`protected` and `internal` are not available for free functions.

Users coming from C# and TypeScript notice that there is no `readonly` in Wing.
Data is immutable by default, therefore public none `mut` fields automatically
become `readonly`.

[`▲ top`][top]

---

### 1.6 Mutability

Mutability in Wing is a lot like TypeScript but with an inverted `const`. Every
thing is immutable (`const`) by default, unless otherwise specified with the
`mut` keyword after `let` and before type name.
`mut mut` is invalid.

> ```TS
> // Wing program:
> let x : mut = 1;
> let y : mut = "Hello";
> let z : mut opt = nil;
> ```
>
> ```TS
> // Equivalent TypeScript:
> let x: number = 1;
> let y: string = "Hello";
> let z: number? = undefined;
> ```

[`▲ top`][top]

---

### 1.7 Optionality

Keyword **opt** can mark a type as optional.
Optionality means the value behind type can be either present or nil.

Rules of optionality applies to the entire new container type of `type opt` and
not the value behind it (`type`).  
`opt opt` is invalid.

The only way to "cast" an optional value to a non-optional value is to use the
`??` operator. This forces a value to be present for the l-value (left hand side
of the assignment operator).

> ```TS
> // Wing program:
> let x : opt = 44;
> let y = x ?? 55;
> ```
>
> ```TS
> // Equivalent TypeScript:
> const x: number? = 44;
> const y = x ?? 55;
> ```

[`▲ top`][top]

---

### 1.8 Type Inference

Type can optionally be put between name and the equal sign, using a colon.  
Partial type inference is allowed while using `mut` and/or `opt` keywords.

When type annotation is missing, type will be inferred from r-value type.  
r-value refers to the right hand side of an assignment here.

All defined symbols are immutable (constant) by default.  
Type casting is generally not allowed unless otherwise specified.

Function arguments and their return type is always required. Function argument
type is inferred iff a default value is provided.

> ```TS
> // Wing program:
> let i = 5;
> let m = i;
> let n : mut = 5;
> let arr_opt : mut opt array<mut number>;
> let arr: mut array<number> = [];
> let copy = arr;
> let i1 : opt = nil;
> let i2 : number opt = i;
> let j1 : mut = 1;
> let j2 = j1;
> ```
>
> ```TS
> // Equivalent TypeScript:
> const i: number = 5;
> const m: number = i;
> let n: number = 5;
> let arr_opt: number[]? = undefined;
> let arr: number[] = [];
> let copy: number[] = arr;
> const i1: number? = undefined;
> const i2: number? = i;
> let j1: number = 1;
> const j2: number = j1;
> ```

[`▲ top`][top]

---

### 1.9 Error Handling

Exceptions and `try/catch/finally` is the error mechanism. Mechanics directly
translate to JavaScript. If exception is uncaught, it crashes your app with a
`panic` call. You can create a new exception with `error`.  
In the presence of `try`, `catch` is required but `finally` is optional.

> ```TS
> // Wing program:
> try {
>   let x : mut opt = 1;
>   error("hello exception");
> } catch e {
>   print(e);
> } finally {
>   x = nil;
> }
> ```
>
> ```TS
> // Equivalent TypeScript:
> try {
>   let x: number? = 1;
>   throw new Error("hello exception");
> } catch (e) {
>   console.log(e);
> } finally {
>   x = undefined;
> }
> ```

[`▲ top`][top]

---

### 1.10 Formatting

Wing is opinionated about formatting and whitespace. The opinion is:

- indentations of lines are 2 spaces
- each statement must end with a semicolon
- everywhere ":" is needed, it must be surrounded by spaces " : "
- class, struct, interface, and resource names must be TitleCased
- every other declaration name must be snake_cased unless otherwise specified

[`▲ top`][top]

---

### 1.11 Memory Management

There is no implicit memory de-allocation function, dynamic memory is managed by
Wing and is garbage collected (Relying on JSII target GC for the meantime).

[`▲ top`][top]

---

## 2. Expressions

### 2.1 bring expression

"bring" expression can be used to import and reuse code from other Wing files or
other JSII supported languages. The expression is detailed in its own section in
this document: [Module System](#5-module-system).

[`▲ top`][top]

---

### 2.2 break expression

**break** expression allows to end execution of a cycle.  
`break;` is a "cycle-breaker".

[`▲ top`][top]

---

### 2.3 continue expression

**continue** expression allows to skip to the next iteration of a cycle.  
`continue;` skips to the end of current cycle.

[`▲ top`][top]

---

### 2.4 return expression

**return** expression allows to return a value or exit from a function.

```TS
return; // exits function, returning void type (nil).
return expr; // exits function, returning result of "expr".
```

[`▲ top`][top]

---

### 2.5 await Expression

**await** expression allows to wait for a future and grab its execution result.
"await" and "future" are semantically similar to JavaScript's promises.  
"await" expression is only valid in async function declarations.

> ```Rust
> // Wing program:
> async fn foo() : number {
>   let x = await some_future();
>   return x;
> }
> fn boo() : future<number> {
>   let x = some_future();
>   return x;
> }
> ```
>
> ```TS
> // Equivalent TypeScript:
> async function foo(): number {
>   const x = await some_future();
>   return x;
> }
> function foo(): Promise<number> {
>   const x = some_future();
>   return x;
> }
> ```

[`▲ top`][top]

---

## 3. Statements

### 3.1 if statement

Flow control can be done with `if/elif/else` statements.  
The `if` statement is optionally followed by `elif` and `else`.  
Parenthesis are not required around the condition.

> ```TS
> // Wing program:
> let x = 1;
> let y = "sample";
> if x == 2 {
>   print("x is 2");
> } elif y != "sample" {
>   print("y is not sample");
> } else {
>   print("x is 1 and y is sample");
> }
> ```
>
> ```TS
> // Equivalent TypeScript:
> const x: number = 1;
> const y: string = "sample";
> if (x === 2) {
>   console.log("x is 2");
> } else if (y !== "sample") {
>   console.log("y is not sample");
> } else {
>   console.log("x is 1 and y is sample");
> }
> ```

[`▲ top`][top]

---

### 3.2 for statement

For..in statement is used to iterate over an array or set.
type annotation after an iteratee (left hand side of `in`) is optional.

> ```TS
> // Wing program:
> let arr = [1, 2, 3];
> let set = {1, 2, 3};
> for item in arr {
>   print(item);
> }
> for item : number in set {
>   print(item);
> }
> for item in 0..100 {
>   print(item);
> }
> ```
>
> ```TS
> // Equivalent TypeScript:
> const arr: number[] = [1, 2, 3];
> const set: Set<number> = new Set([1, 2, 3]);
> for (const item of arr) {
>   console.log(item);
> }
> for (const item of Object.freeze(Array.from(Array(100).keys()))) {
>   console.log(item);
> }
> for (const item of set) {
>   console.log(item);
> }
> ```

[`▲ top`][top]

---

### 3.3 while statement

while statement is used to execute a block of code while a condition is true.

> ```TS
> // Wing program:
> while call_some_function() {
>   print("hello");
> }
> ```
>
> ```TS
> // Equivalent TypeScript:
> while (call_some_function()) {
>   console.log("hello");
> }
> ```

[`▲ top`][top]

---

## 4. Declarations

### 4.1 Structs

Structs are loosely modeled after typed JSON literals in JavaScript.  
Structs are defined with the `struct` keyword.  
Structs are "bags" of data.

Structs can only have fields of primitive types, resources, and other structs.  
Array, set, and map of above types is also allowed in struct field definition.  
Visibility, storage and phase modifiers are not allowed in struct fields.

Structs cannot inherit from interfaces, resources or classes.  
Structs can inherit from other structs.

> ```Rust
> // Wing program:
> struct MyDataModel1 {
>   field1 : number;
>   field2 : string;
> };
> struct MyDataModel2 {
>   field3 : number;
>   field4 : opt bool;
> };
> struct MyDataModel3 implements struct<MyDataModel1>, struct<MyDataModel2> {
>   field5 : string;
> }
> let s1 : struct<MyDataModel1> = { field1 : 1, field2 : "sample" };
> let s2 : struct<MyDataModel2> = { field3 : 1, field4 : true };
> let s3 : struct<MyDataModel2> = { field3 : 1, field4 : nil };
> let s4 : struct<MyDataModel3> = {
>   field1 : 12,
>   field2 : "sample", 
>   field3 : 11,
>   field4 : false,
>   field5 : "sample"
> };
> ```
>
> ```TS
> // Equivalent TypeScript:
> interface MyDataModel1 {
>   public readonly field1: number;
>   public readonly field2: string;
> }
> interface MyDataModel2 {
>   public readonly field3: number;
>   public readonly field4?: boolean;
> }
> interface MyDataModel3 extends MyDataModel1, MyDataModel2 {
>   public readonly field5: string;
>   public readonly field6: number;
> }
> const s1: MyDataModel1 = { field1: 1, field2: "sample" };
> const s2: MyDataModel2 = { field3: 1, field4: true };
> const s3: MyDataModel2 = { field3: 1, field4: undefined };
> const s4: MyDataModel3 = {
>   field1: 12,
>   field2: "sample",
>   field3: 11,
>   field4: false,
>   field5: "sample",
>   field6: 11
> };
> ```

[`▲ top`][top]

---

### 4.2 Interfaces

Interfaces represent a contract that a class or resource must fulfill.  
Interfaces are defined with the `interface` keyword.  
Both preflight and inflight signatures are allowed.  
`implements` keyword is used to implement an interface or multiple interfaces
that are separated with commas.

All methods of an interface are public by default and cannot be of any other
type of visibility (private, protected, etc.). public keyword is optional.

> ```TS
> // Wing program:
> interface MyInterface1 {
>   field1 : number;
>   method1(x : number) : string;
> };
> interface MyInterface2 {
>   field2~ : string;
>   method2~() : string;
> };
> class MyClass implements interface<MyInterface1> {
>   field1 : number;
>   new(x : number) {
>     // preflight constructor
>     this.field1 = x;
>   }
>   method1(x : number) : string {
>     return "sample: ${x}";
>   }
> };
> resource MyResource
>   extends class<MyClass>
>   implements interface<MyInterface1>, interface<MyInterface2> {
>   field2~ : string;
>   new~() {
>     // inflight client initialization
>     this.field2~ = "sample";
>   }
>   method2~() : string {
>     return this.field2~;
>   }
> };
> ```
>
> ```TS
> // Equivalent TypeScript:
> interface MyInterface1 {
>   public readonly field1: number;
>   public method1(x: number): string;
> }
> interface MyInterface2 {
>   public readonly __inflight__field2: string;
>   public __inflight__method2(): string;
> }
> class MyClass implements MyInterface1 {
>   public readonly field1: number;
>   public constructor(x: number) {
>     // preflight constructor
>     Object.assign(this, { field1: x });
>   }
>   public method1(x: number): string {
>     return `sample: ${x}`;
>   }
> }
> class MyResource
>   extends constructs.Construct
>   implements MyInterface1, MyInterface2 {
>   public readonly field1: number;
>   public readonly __inflight__field2: string;
>   public constructor(scope: constructs.Construct, id: string, x: number) {
>     super(scope, id);
>     // preflight constructor
>     Object.assign(this, { field1: x });
>   }
>   public __inflight__constructor() {
>     // inflight client initialization
>     Object.assign(this, { __inflight__field2: "sample" });
>   }
>   public __inflight__method2(): string {
>     return this.__inflight__field2;
>   }
>   public method1(x: number): string {
>     return `sample: ${x}`;
>   }
> }
> ```

[`▲ top`][top]

---

### 4.3 Classes

Class consists of fields and methods in any order,
The class system is single-dispatch class based object orientated system.

A class member function that has the name **new** is considered to be a class
constructor (or initializer, or allocator).

A Default constructor is simply a constructor that can be called without any
arguments (constructor can have default function arguments).

There is no implicit default constructor in a class offered by the compiler.

```TS
class Name
  extends class<Base>
  implements interface<MyInterface1>, interface<MyInterface2> {
  new() {
    // default constructor implementation
    // order is up to user
    this.field1 = 1;
    this.field2 = "sample";
  }

  // class fields
  field1: number;
  field2: string,

  // private methods
  private_method(arg:type, arg:type, ...) : type {
    // concrete implementation
  }
  static static_method(arg:type, arg:type, ...);
  // visible to outside the instance
  public public_method(arg:type, arg:type, ...);
  // visible to children only
  protected internal_method(type:arg, type:arg, ...) { }
  // public in current compilation unit only
  internal protect_method3(type:arg, type:arg, ...) : type { }
}
```

Default initialization does not exist in Wing. All member fields must be
initialized in the constructor. Absent initialization is a compile error.

Member function and field access in constructor with the "this" keyword before
all fields are initialized is invalid and should throw a compile error.

```TS
class Foo {
  x: number;
  new() { this.x = 1; }
}
class Bar {
  y: number;
  z: Foo;
  new() {
    this.y = 1;
    this.z = Foo();
  }
  public print() {
    print(this.y);
  }
}
let a = Bar();
a.print(); // prints 20.
```

Overloading methods is allowed.  
Overloading the constructor is allowed.  
Inheritance is allowed with the `extends` keyword. `super` can be used to access
the base class, immediately up the inheritance chain (parent class).

```TS
class Foo {
  x: number;
  new() { this.x = 0; }
  public method() { }
}
class Boo extends Foo {
  new() { super(); this.x = 10; }
  public override method() {
    // override implementation
  }
}
```

`extends` keyword accepts classes, interfaces and records as its right hand side
and accepts resources iff left hand side is also a resource.

You can use the keyword `final` to stop the inheritance.

```TS
class Foo {
  x: number;
  new() { this.x = 0; }
  public method() { }
}
class Boo final extends Foo {
  new() { super(); this.x = 10; }
  public override method() {
    // override implementation
  }
}
// compile error
// class FinalBoo extends Boo {}
```

By default all methods are virtual. But if you are about to override a method,
you need to explicitly provide the keyword **override**.  
Static, private, and internal methods cannot be and are not virtual.

Child class must not introduce additional signatures for overridden methods.

Multiple inheritance is invalid and forbidden.  
Multiple implementations of various interfaces is allowed.  
Multiple implementations of the same interface is invalid and forbidden.

[`▲ top`][top]

---

### 4.4 Resources

Resources provide first class composite pattern support in Wing.  
Resources can be defined like so:

```TS
// Wing Code:
resource Foo {
  new() {} // preflight constructor
  new~() {} // optional client initializer
  fin() {} // sync finalizer
  // async fin() {} // async finalizer (can be either sync or async)

  // inflight members
  inflight foo(arg:number) : number { return arg; }
  boo~() : number { return 32; }
  inflight field1 : number;
  inflight field2 : string;
  field3~ : bool;

  // preflight members
  foo(arg:number) : number { return arg; }
  boo() : number { return 32; }
  field1 : number;
  field2 : string;
  field3 : bool;
}
```

Resources all have a scope and a unique ID. Compiler provides an implicit scope
and ID for each resource, both overrideable by user-defined ones in constructor.

Resource instantiation syntax is as follows:

```pre
let <name> [: <type>] = <resource> [be <id>] [in <scope>];
```

```TS
// Wing Code:
let a = Foo(); // with default scope and id
let a = Foo() in scope; // with user-defined scope
let a = Foo() be "custom-id" in scope; // with user-defined scope and id
let a = Foo(...) be "custom-id" in scope; // with constructor arguments
```

"id" must be of type string. It can also be a string literal.  
"scope" must be a variable of resource type.

In addition to the `new` keyword for defining constructors, resources have a
unique `fin` definable method that offer async finalization of a resource in
preflight time.  
Order of execution of async finalization is not guaranteed.

Resources can be captured into inflight functions and once that happens, inside
the capture block only the inflight members are available. This new "type" is an
anonymous type, but guarantees to implement the same interface for two captures
of the same resource type in preflight.

Resources can extend other resources (but not structs) and implement interfaces.
Resources can extend classes and all parent class methods are assumed preflight.

```TS
// Wing Code:
class MyResourcePreflightImplementation { /* ... */ };
interface MyResourceInflightInterface { /* ... */ };
resource MyResource
  extends class<MyResourcePreflightImplementation>
  implements interface<MyResourceInflightInterface> {
    // inflight implementation
  }
```

Access to "tree" behind all resources is done with the `nodeof(resource)` call.
The tree is the constructs tree that enables composition of resources.

[`▲ top`][top]

---

### 4.5 Variables

```pre
let <name> [: <type>] = <value>;
```

Assignment operator is `=` and is optional if a default value is given or both
`opt` and `mut` are present in the type annotation.  
`opt`, `mut` and alligator brackets can be mixed together to form complex types.

> ```TS
> // Wing Code:
> let n = 10;
> let s : string = "hello";
> let a : opt mut string;
> a = "world";
> ```
>
> ```TS
> // Equivalent TypeScript:
> const n: number = 10;
> const s: string = "hello";
> let a: string?;
> a = "world";
> ```

[`▲ top`][top]

---

### 4.6 Functions

#### 4.6.1 Free Functions

```pre
[inflight|preflight] fn <name>[~](<args>)[: <return_type>] {
  <body>
}
```

Function definition starts with keyword **fn**, name and a list of arguments in
parenthesis. These definition are always at block level.  
List of arguments starts with one or more parameter names, separated by comma.
After comma, a colon is followed by a type expression.  
After parenthesis, an optional colon with a type specifier can be specified to
forward declare the return type.  
Function body must be enclosed in { } block.  
Default argument values must be compile time constants.  
Function argument type can be inferred only if it has default argument value.  
Function default argument value is specified by writing "= value" directly after
argument name.

In all definitions, presence of `~` indicates "inflight-ness".  

It is possible to have functions with same name but both preflight and inflight.
In that case, if both definitions are in the same scope, caller must supply the
`~` character after the function's name in the call signature.

Function names are all snake_case and lower case.  
If return statement missing, `return nil` is assumed.  
If return type is missing, `: nil` is assumed.

> ```Rust
> // Wing Code:
> fn foo(x : number, y = 12) {
>   print("preflight", x + y);
> }
> // inflight block level function
> fn foo~(x : number, y : number = 16) {
>   print("inflight", x + y);
> }
> struct MyProps {
>   x : number;
>   y : number;
>   z : number;
> }
> // use a struct as an argument with the expansion operator
> let s : struct<MyProps> = { x = 1, y = 2, z = 3 };
> // inflight block level function (full keyword)
> inflight fn boo(props: struct<MyProps>) {
>   print(props);
> }
> // preflight block level function (optional with full keyword)
> preflight fn too(props: struct<MyProps>, a = 12) {
>   print(props);
> }
> ```

Capturing variables works as you'd expect in other languages like JavaScript but
restrictions are applied when variable captures happen from preflight into all
inflight definitions.

Only following types are capture-able inside inflight functions:

1. Structs
1. Resources
1. Primitive types
1. Arrays, Maps, and Sets of above types

Of the captured variables, only their inflight members are accessible inside the
scope of another inflight function. It is possible to have both a preflight and
an inflight member with the same name.

Resources are not usable inside inflight functions. Also when a Resource is
captured inside an inflight function, it no longer is the original type. The
captured type is opaque and only known to the compiler.

If "bring" expression is used to import non Wing code, it is assumed that the
imported code is safe to be executed in either preflight or inflight.

[`▲ top`][top]

---

#### 4.6.2 Closures

It is possible to create closures.  
It is not possible to create named closures.  
However, it is possible to create anonymous closures and assign to variables.  
Inflight closures as well as preflight closures are supported.

> ```TS
> // Wing Code:
> let f1 = (a, b) => { print(a + b) };
> // inflight closures
> let f2 = (a, b) ~> { print(a + b) };
> // full syntax
> let f3 = (a : number, b : number) : nil => { print(a + b) };
> ```

[`▲ top`][top]

---

#### 4.6.3 Futures

Futures (a.k.a promises) in Wing are defined with `future<T>` syntax.  
Functions that use the keyword "await" in their body must return a future.

> ```Rust
> // Wing Code:
> fn number() : future<number> {
>   return 23;
> }
> fn handler() : future<nil>
> {
>   let t = await number();
>   print(t);
> }
> ```
>
> ```TS
> // Equivalent TypeScript:
> async function number() : number {
>   return 23;
> }
> async function handler() : undefined {
>   const t: number = await number();
>   console.log(t);
> }
> ```

[`▲ top`][top]

---

### 4.7 Arrays

Arrays are dynamically sized in Wing and are defined with the `[]` syntax.  
Individual array items are also access with the `[]` syntax.
You can call `sizeof` to get the size of the array.
Numeric ranged arrays are supported: `[0..10]`.

> ```TS
> // Wing Code:
> let arr1: array<number> = [1, 2, 3];
> let arr1_2: array<number> = 1..3;
> let arr2: array<string> = ["a", "b", "c"];
> let arr3: mut array<mut string> = ["a1", "b2", "c3"];
> let l = sizeof(arr1) + sizeof(arr2) + sizeof(arr3) + arr1[0];
> ```
>
> ```TS
> // Equivalent TypeScript:
> const arr1: number[] = Object.freeze([1, 2, 3]);
> const arr1_2: number[] = Object.freeze([1, 2, 3]);
> const arr2: string[] = Object.freeze(["a", "b", "c"]);
> let arr3: string[] = ["a1", "b2", "c3"];
> const l = arr1.length + arr2.length + arr3.length + arr1[0];
> ```

[`▲ top`][top]

---

### 4.8 Enumeration

Enumeration type (enum) is a type that groups a list of named constant members.
Enumeration is defined by writing **enum**, followed by enumeration name and a
list of comma-separated constants in a {}. Last comma is optional in single line
definitions but forbidden in multi line definitions.
Naming convention for enums is to use "TitleCase".

> ```TS
> // Wing Code:
> enum SomeEnum { One, Two, Three };
> enum MyFoo {
>   A,
>   B,
>   C,
> };
> let x: enum<MyFoo> = MyFoo.B;
> let y = x; // type is enum<MyFoo>
> ```
>
> ```TS
> // Equivalent TypeScript:
> enum SomeEnum { One, Two, Three };
> enum MyFoo {
>   A,
>   B,
>   C,
> };
> const x: MyFoo = MyFoo.B;
> const y: MyFoo = x;
> ```

[`▲ top`][top]

---

## 5. Module System

The module system in Wing uses the "bring" expression to reuse code.  
**bring** expression allows code to "import" functions, classes and variables
from other files, to allow reusability.  
**bring** expression is only allowed at the top of the file before any other
code. Comments before the first bring expression are valid.

### 5.1 Imports

"bring" expression starts with `from` keyword and followed by a file path,
either with or without an extension. If there is no extension, file path is
treated as a Wing import, otherwise it is treated as a JSII import.  
In case of Wing, quotes around the file path are optional.  
The expression is followed by a `bring` keyword and a list of names to import.  
Names can be renamed with `as` keyword.

> ```TS
> // Wing Code:
> from std bring *;
> from std bring * as std2;
> from std bring io;
> from std bring io as io2;
> from std bring io, fs, name as module;
> ```
>
> ```TS
> // Equivalent TypeScript:
> import * from 'std'; // @monadahq/wingsdk is available as "std" in "wingrt"
> import * as std2 from 'std';
> import { io } from 'std';
> import { io as io2 } from 'std';
> import { io, fs, name as module } from 'std';
> ```

To promote polyglot programming, A string literal can also be placed after
**bring**. This allows importing and reusing code from JSII packages:

> ```TS
> // Wing Code:
> from "cdk-spa" bring *;
> from "cdk-spa" bring * as spa;
> from "cdk-spa" bring SomeConstruct;
> from "cdk-spa" bring SomeConstruct as SomeConstruct2;
> from "cdk-spa" bring SomeConstruct, OtherType as module;
> ```
>
> ```TS
> // Equivalent TypeScript:
> import * from 'cdk-spa';
> import * as spa from 'cdk-spa';
> import { SomeConstruct } from 'cdk-spa';
> import { SomeConstruct as SomeConstruct2 } from 'cdk-spa';
> import { SomeConstruct, OtherType as module } from 'cdk-spa';
> ```

Motivation for the notation and the way bring expression is designed the way it
is, is to make it easier for IDEs and other similar tools to autocomplete all
named imports after typing the module path.

[`▲ top`][top]

---

### 5.2 Exports

In preflight, anything with `public` at block scope level is importable.  
This includes functions, classes, structs, interfaces and resources.  
In inflight, the above excluding resources are importable.  
Variables are not exportable.

Resources are not usable in inflight functions. There is no synthesizer inside
the inflight body to synthesize inflight resources.

[`▲ top`][top]

---

## 6. Dependency Injection

### 6.1 Pure Resources

You may declare a pure resource with the `resource` keyword. These types of
resources are not meant to have a body declaration and their implementation is
meant to be resolved by the compiler at compile time based on options provided.
These resources must always implement at least one interface.

```TS
resource MyPureResource implements interface<BucketApi>;
```

`MyPureResource` is a pure resource. A resource with no concrete implementation.
All pure resources must resolve at compile time. Partial resolves are invalid.

[`▲ top`][top]

---

### 6.2 Symbol Resolution

Compiler implementation must provide the following options to allow resolve of
pure resources to concrete implementation at compile time:

1. Compiler must allow symbols to be overridden via command line. Choice of the
  command name is up to implementation. `--resolve "<PureSymbol>=<Symbol>"` is
  an example of such command line.
1. Compiler must allow symbols to be overridden via environment variables.
  Choice of the environment variable name is up to implementation.
  `WING_RESOLVE_<PureSymbol>` is an example of such environment variable. This
  mode must be explicitly enabled (e.g. by passing empty `--resolve`). This can
  prevent accidental usage of leftover environment variables.
  Content of this environment variable would be `<Symbol>`.
1. Compiler must allow symbols to be overridden via `wing.w` file. This mode is
  enabled by the existence of the `wing.w` file:

    ```Rust
    from cloud bring aws;
    from lib/my-resources bring MyPureResource;
    public fn build(ctx: mut Context) : Context {
      ctx.resolver.assign(MyPureResource, aws.s3.Bucket);
      // OR:
      ctx.resolver.assign(
        "lib/my-resources.MyPureResource",
        "cloud/aws.s3.Bucket"
      );
    }
    ```

Format of both `<PureSymbol>` and `<Symbol>` is simple:

- up to first `.` is Wing module path to use
- after first `.` is the exported resource accessor

```pre
<path/to/wing/module>.<resource accessor>
```

[`▲ top`][top]

---

## 7. Miscellaneous

### 7.1 Strings

Type of string is UTF-16 internally.  
All string declaration variants are multi-line.  
You can call `sizeof` to get the length of the string.

[`▲ top`][top]

---

#### 7.1.1 Normal strings "..."

The string inside the double quotes is processed, and all notations of form
`${<expression>}` are substituted from their respective scopes. The behavior is
similar to `` `text ${sub.prop}` `` notation in JavaScript.  
Processing unicode escape sequences happens in these strings.

> ```TS
> // Wing Code:
> let name = "World";
> let s = "Hello, ${name}!";
> let l = sizeof(s);
> ```
>
> ```TS
> // Equivalent TypeScript:
> const name = "World";
> const s = `Hello, ${name}!`; // with substitution
> const l = s.length; // length of string
> ```

[`▲ top`][top]

---

#### 7.1.2 Shell strings \`...\`

If string is enclosed with backticks, the contents of that string will be
interpreted as a shell command and its output will be used as a string.
`` `echo "Hello"` `` is equal to `"Hello"`.  
The string inside the backtick is evaluated in shell at compile time and its
stdout is returned as a string. If command exits with non-zero, this throws
with an exception containing the stderr of the command and its return code.

The string is evaluated at compile time as a escape hatch for ops workflows.

Substitution is not allowed in shell strings.  
Shell strings are invalid in the bring expression.  
Not all targets support shell execution. Backticks throw in absence of a shell.

Internally compiler calls the host environment's command processor (e.g.
`/bin/sh`, `cmd.exe`, `command.com`) with the enclosed command.

> ```TS
> // Wing Code:
> let name = `echo "World"`;
> let s = "Hello, ${name}!";
> ```
>
> ```TS
> // Equivalent TypeScript:
> const name = await new Promise((resolve, reject) => {
>   const child_process = require("child_process");
>   let process = child_process.exec(`echo "World"`, (err, stdout, stderr) => {
>   if (err) {
>     console.error(err);
>     throw new Error({ stderr, code: process.exitCode });
>   }
>   resolve(stdout);
> });
> let s = `Hello, ${name}!`;
> ```

[`▲ top`][top]

---

### 7.2 Comments

Single line comments start with a `//` and continue to the end of the line.  
Multi-line comments are supported with the `/* ... */` syntax.

> ```TS
> // comment
> /* comment */
> /*
>    multi line comment
> */
> ```

[`▲ top`][top]

---

### 7.3 Operators

Unary operators are not supported except outline below.  
Arithmetic assignment operators are not supported.  
Ternary or conditional operators are not supported.

#### 7.3.1 Relational Operators

| Operator | Description                                      | Example  |
| -------- | ------------------------------------------------ | -------- |
| `==`     | Checks for equality                              | `a == b` |
| `!=`     | Checks for inequality                            | `a != b` |
| `>`      | Checks if left is greater than right             | `a > b`  |
| `<`      | Checks if left less than right                   | `a < b`  |
| `>=`     | Checks if left is greater than or equal to right | `a >= b` |
| `<=`     | Checks if left is less than or equal to right    | `a <= b` |

[`▲ top`][top]

---

#### 7.3.2 Logical Operators

| Operator     | Description          | Example              |
| ------------ | -------------------- | -------------------- |
| `&&`, `and`  | Logical AND operator | `a && b`, `a and b`  |
| `\|\|`, `or` | Logical OR operator  | `a \|\| b`, `a or b` |
| `!`, `not`   | Logical NOT operator | `!a`, `not a`        |

[`▲ top`][top]

---

#### 7.3.3 Bitwise Operators

| Operator | Description                 | Example  |
| -------- | --------------------------- | -------- |
| `&`      | Binary AND                  | `a & b`  |
| `\|`     | Binary OR                   | `a \| b` |
| `^`      | Binary XOR                  | `a ^ b`  |
| `~`      | Binary One's Complement     | `~a`     |
| `<<`     | Binary Left Shift Operator  | `a << 1` |
| `>>`     | Binary Right Shift Operator | `a >> 1` |

[`▲ top`][top]

---

#### 7.3.4 Mathematics Operators

| Operator | Description    | Example |
| -------- | -------------- | ------- |
| `*`      | Multiplication | `a * b` |
| `/`      | Division       | `a / b` |
| `\`      | Floor Division | `a \ b` |
| `%`      | Modulus        | `a % b` |
| `+`      | Addition       | `a + b` |
| `-`      | Subtraction    | `a - b` |
| `^`      | Exponent       | `a ^ b` |

[`▲ top`][top]

---

#### 7.3.5 Operator Precedence

| Operator             | Notes                                             |
| -------------------- | ------------------------------------------------- |
| ()                   | Parentheses                                       |
| +x, -x, ~x           | Unary plus, Unary minus, Bitwise NOT              |
| \*, /, \\, %         | Multiplication, Division, Floor division, Modulus |
| +, -                 | Addition, Subtraction                             |
| <<, >>               | Bitwise shift operators                           |
| &                    | Bitwise AND                                       |
| ^                    | Bitwise XOR                                       |
| \|                   | Bitwise OR                                        |
| ==, !=, >, >=, <, <= | Comparisons, Identity, operators                  |
| !,not                | Logical NOT                                       |
| &&,and               | Logical AND                                       |
| \|\|,or              | Logical OR                                        |

Table above is in descending order of precedence.  
`=` operator in Wing does not return a value so you cannot do `let x = y = 1`.  
Operators of the same row in the table above have precedence from left to right
in the expression they appear in (e.g. `4 * 2 \ 3`). In other words, order is
determined by associativity.

[`▲ top`][top]

---

#### 7.3.6 Short Circuiting

For the built-in logical NOT operators, the result is `true` if the operand is
`false`. Otherwise, the result is `false`.

For the built-in logical AND operators, the result is `true` if both operands
are `true`. Otherwise, the result is `false`. This operator is short-circuiting
if the first operand is `false`, the second operand is not evaluated.

For the built-in logical OR operators, the result is `true` if either the first
or the second operand (or both) is `true`. This operator is short-circuiting if
the first operand is `true`, the second operand is not evaluated.

Note that bitwise logic operators do not perform short-circuiting.

[`▲ top`][top]

---

#### 7.3.7 Non-numeric Operators

Of the operators above, the following can be used with non-numeric operands:

- `==`: can be used to check for equality of types and values in operands.
- `!=`: can be used to check for inequality of types and values in operands.

[`▲ top`][top]

---

### 7.4 Kitchen Sink

This is an example with almost every feature of the Wing, showing you a whole
picture of what the syntax feels like.

```TS
from std bring fs;
from std bring math;
from cloud bring poly;

// single line comment about "file"
let file = fs.File({ content: 'hello world!' });
let file2 = fs.File() be "my-file";
file2.write('hello file2!');

resource Uploader {
  // "fs.File" is also a Resource
  public output : fs.File;
  // "poly.serverless.Bucket" is also a Resource
  public bucket : poly.serverless.Bucket;
  // constructor with one argument
  new(file : fs.File) {
    this.output = file;
    this.bucket = poly.storage.Bucket() be "uploader-bucket-${file.ext}";
  }
  // when this is called in preflight by accident, panic
  public upload() {
    panic('not implemented');
  }
  // this is called in inflight. "bucket.upload" is inflight itself
  public upload~() : bool {
    try {
      let filename = math.random() * 100;
      if this.bucket.upload({
        key: "/path/to/${filename}.txt",
        file: this.output
      }) {
        print("uploaded ${filename}");
      } else {
        error("upload failed");
      }
    } catch err {
      panic(err);
    }
  }
};

// create an uploader and make it a child of the root resource directly
let uploader = Uploader(file) be "my-uploader";
let root = nodeof(uploader).root;

// make a lambda handler that consumes the uploader and uploads the file
fn~ handler() {
  if uploader.upload() {
    print('uploaded!');
  } else {
    panic('mayday mayday!');
  }
};

let function = poly.serverless.Function({
  handler: handler,
  runtime: "nodejs",
  timeout: "60s"
});

trace("function created: ${function.name}")
event({ successful_build: "${`bash -c 'date'`}" })
```

[`▲ top`][top]

---

### 7.6 Standard Library

| Module  | Name    | Description                                      |
| ------- | ------- | ------------------------------------------------ |
| `std`   | `io`    | standard io and stream operations                |
| `std`   | `fs`    | filesystem and directory operations              |
| `std`   | `fi`    | flight information (os, process, platform, etc.) |
| `std`   | `bb`    | black box (error reporting, core dumps, etc.)    |
| `std`   | `ct`    | control tower (monitoring and observability)     |
| `std`   | `vm`    | preflight runtime interface                      |
| `std`   | `log`   | standard logging library                         |
| `std`   | `net`   | native networking (TCP, UDP, MQTT, etc.)         |
| `std`   | `http`  | http(s) library                                  |
| `std`   | `math`  | math and matrix library                          |
| `cloud` | `poly`  | high level cloud abstractions                    |
| `cloud` | `aws`   | aws cloud abstractions                           |
| `cloud` | `gcp`   | gcp cloud abstractions                           |
| `cloud` | `azure` | azure cloud abstractions                         |

[`▲ top`][top]

---

### 7.7 Credits

- <https://github.com/WheretIB/nullc>
- <https://github.com/chaos-lang/chaos>
- <https://github.com/BlazifyOrg/blazex>
- <https://github.com/YorickPeterse/inko>
- <https://github.com/thesephist/ink>
- <https://github.com/vlang/v>

[top]: #wing-language-reference
