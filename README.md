# Mongest NestJS Service (BETA)

### Delightfully-typed Mongoose-wrapper service

This is a BETA, and therefore you may encounter bugs. Please [post an issue](https://github.com/OoDeLally/mongest/issues) if needed.

Note: If you use NestJS, use [mongest-nestjs-service](https://github.com/OoDeLally/mongest-nestjs-service).

Note: If you happen to use GraphQL and optionally [ReactAdmin](https://github.com/marmelab/react-admin), use also [ra-data-graphql-simple-mongest-resolver](https://github.com/OoDeLally/ra-data-graphql-simple-mongest-resolver), which includes automatic resolver boilerplates.

## TL;DR

* Service that delicately wraps Mongoose methods for your favorite entities.
* All returned documents are leans, but casted as instance of their entity class.
* Amazing discriminator-based polymorphism!
* Precise and safe typing in and out for all mongoose functions (sensitive to projection!).
* Fully overridable and expandable.


# Setup

Install (if not already there) the peer dependencies:

```bash
npm install --save mongodb mongoose
```

Then install the `mongest` lib:

```bash
npm install --save mongest
```

Now you can create your entity and your service:

```ts

export class Cat {
  _id!: ObjectId;
  kind!: CatKind;
  name!: string;
}

export const CatSchema = new Schema(
  {
    kind: { type: String, enum: CatKind },
    name: String,
  },
  { discriminatorKey: 'kind' },
);

export const CatModel = mongoose.model(Cat.name, CatSchema);

export class CatsService extends BuildMongestService(Cat) {
  async myCustomMethod(): Promise<Cat[]> {
    return await this.find({ name: 'pogo' });
  }
}

const catService = new CatsService(CatModel);
```


## Features

### Better method argument typing

Mongoose is often too lineant on what parameters are accepted (e.g. the `QueryOptions` god-object).

Mongest service methods only accept options that are really supported by the mongo driver. In addition, pagination and sorting can be expressed in a more concise way.

```ts
const cats = await catService.find(
  { name: /pogo/i },
  {
    projection: { name: 1 },
    skip: 1,
    limit: 1,
    sort: { name: 1 }
  },
);
```


### Better method lean return typing

Mongoose return typing is often too constraining for no apparent good reason. It is also too linear when using projections.

Mongest service documents are always **lean** instances of the entity class (except `aggregate()` method).

In addition, when a projection is used, the return type automatically excludes the non-projected fields, so that you will encounter a typing error if you try to use them by mistake.
Projected typing supports local field reference (`{foo: '$bar'}`), string substitution (`{foo: 'bar'}`), and operators `$`, `$slice`, `$elemMatch`. See more about [Mongest Projection](https://github.com/OoDeLally/mongest-projection).

```ts
const cat = await catService.findOne(
  { name: /pogo/i },
  {
    projection: { name: 1 },
  },
);
if (cat) {
  const isCatInstance = cat instanceof Cat; // true
  const age = cats.age; // << TypeError: Property 'age' does not exist on type '{ name: string; _id: ObjectId; }'
}
```

### Polymorphism

If you use mongoose schema discriminators, Mongest service will cast each document according to its type.

```ts
export enum CatKind {
  StrayCat = 'StrayCat',
  HomeCat = 'HomeCat',
}

// Base Cat
export class Cat {
  _id!: ObjectId;
  kind!: CatKind;
  name!: string;
}
export const CatSchema = new Schema(
  {
    kind: { type: String, enum: CatKind },
    name: String,
  },
  { discriminatorKey: 'kind' },
);
export const CatModel = mongoose.model(Cat.name, CatSchema);
export class CatsService extends BuildMongestService(Cat) {}

// Home Cat
export class HomeCat extends Cat {
  humanSlave!: string;
}
export const HomeCatSchema = new Schema(
  {
    humanSlave: String,
  },
  { discriminatorKey: 'kind' },
);
registerEntityClassForSchema(HomeCat, HomeCatSchema);
export const HomeCatModel = CatModel.discriminator(HomeCat.name, HomeCatSchema);
export class HomeCatsService extends BuildMongestService(HomeCat) {}

// Stray Cat
export class StrayCat extends Cat {
  territorySize!: number;
  enemyCount?: number;
}
export const StrayCatSchema = new Schema(
  {
    territorySize: Number,
    enemyCount: { type: Number, required: false },
  },
  { discriminatorKey: 'kind' },
);
registerEntityClassForSchema(StrayCat, StrayCatSchema);
export const StrayCatModel = CatModel.discriminator(StrayCat.name, StrayCatSchema);
export class StrayCatsService extends BuildMongestService(StrayCat) {}

// Usage
const strayCat: StrayCat = { name: 'Billy', kind: 'StrayCat', territorySize: 45 }
const homeCat: HomeCat = { name: 'Pogo', kind: 'HomeCat', humanSlave: 'Pascal' }
await catService.insertMany([strayCat, homeCat])
const cat = await catService.find({});
for (const cat of cats) {
  cat // <= Type is Cat
  cat instanceof Cat; // true
  cat.name // <= Available for all cats.
  cat.kind // <= Available for all cats.
  if (cat instanceof StrayCat) {
    cat // <= Type is StrayCat
    cat.territorySize // <= Now available !
  }
  if (cat instanceof HomeCat) {
    cat // <= Type is HomeCat
    cat.humanSlave // <= Now available !
  }
}
```

### Polymorphism, projection, and typing

While TS will not let you use non-projected fields, under the hood the docs are still instances of their leaf class, so you can still cast them with `isEntityInstanceOf(...)`.

```ts
const strayCat: StrayCat = { name: 'Billy', kind: 'StrayCat', territorySize: 45 }
const homeCat: HomeCat = { name: 'Pogo', kind: 'HomeCat', humanSlave: 'Pascal' }
await catService.insertMany([strayCat, HomeCat])
const cats = await catService.find(
  {},
  {
    projection: { name: 1, territorySize: 1 },
  }
);
for (const cat of cats) {
  cat // <= Type is { name: string, territorySize: unknown }
  if (isEntityInstanceOf(cat, StrayCat)) {
    cat // <= Type is { name: 1, territorySize: number }
    cat.territorySize // <= number
  }
  if (isEntityInstanceOf(cat, HomeCat)) {
    cat // <= Type is { name: 1 }
    cat.humanSlave // <= Error (not projected)
  }
}
```

Note that it would still work with the vanilla `if (cat instanceof StrayCat)`, but you will lose the typing information about non-projected fields.


## Limitations

  * Because lean documents are used systematically, things like virtual fields or `populate()` are not directly possible.
    Of course if you *really* need one of these fancy mongoose features, you can always invoke the model's methods directly (e.g. `service.model.findOne().populate('myRefField').exec()`).


## FAQ

### Projections

#### "My non-optional field is marked as `| undefined` in the projected document"

This happens when it is impossible to guess whether the projection is an inclusion or an exclusion.

```ts
// BAD

// Type `true` is widened to `boolean`. Impossible to guess.
this.catService.find({}, {projection: { name: true } })

const projectName = true; // Widened to `boolean`. Impossible to guess.
this.catService.find({}, {projection: { name: projectName } })

// GOOD

// Type `true` is not widened to `boolean`. Projection can be guessed.
this.catService.find({}, {projection: { name: true } as const })

// BETTER

// Type `1` is not widened to `number`. Projection can be guessed.
// This works because projections accept `1 | 0` and not `number`.
this.catService.find({}, {projection: { name: 1 } })
```

More about Typescript's type-widening: https://www.typescriptlang.org/play#example/type-widening-and-narrowing
