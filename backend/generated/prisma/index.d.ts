
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Paper
 * 
 */
export type Paper = $Result.DefaultSelection<Prisma.$PaperPayload>
/**
 * Model ReviewerAssignment
 * 
 */
export type ReviewerAssignment = $Result.DefaultSelection<Prisma.$ReviewerAssignmentPayload>
/**
 * Model Review
 * 
 */
export type Review = $Result.DefaultSelection<Prisma.$ReviewPayload>
/**
 * Model Comment
 * 
 */
export type Comment = $Result.DefaultSelection<Prisma.$CommentPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Role: {
  READER: 'READER',
  AUTHOR: 'AUTHOR',
  REVIEWER: 'REVIEWER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN'
};

export type Role = (typeof Role)[keyof typeof Role]


export const PaperStatus: {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
};

export type PaperStatus = (typeof PaperStatus)[keyof typeof PaperStatus]


export const AssignmentStatus: {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED'
};

export type AssignmentStatus = (typeof AssignmentStatus)[keyof typeof AssignmentStatus]

}

export type Role = $Enums.Role

export const Role: typeof $Enums.Role

export type PaperStatus = $Enums.PaperStatus

export const PaperStatus: typeof $Enums.PaperStatus

export type AssignmentStatus = $Enums.AssignmentStatus

export const AssignmentStatus: typeof $Enums.AssignmentStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.paper`: Exposes CRUD operations for the **Paper** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Papers
    * const papers = await prisma.paper.findMany()
    * ```
    */
  get paper(): Prisma.PaperDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.reviewerAssignment`: Exposes CRUD operations for the **ReviewerAssignment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ReviewerAssignments
    * const reviewerAssignments = await prisma.reviewerAssignment.findMany()
    * ```
    */
  get reviewerAssignment(): Prisma.ReviewerAssignmentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.review`: Exposes CRUD operations for the **Review** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Reviews
    * const reviews = await prisma.review.findMany()
    * ```
    */
  get review(): Prisma.ReviewDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.comment`: Exposes CRUD operations for the **Comment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Comments
    * const comments = await prisma.comment.findMany()
    * ```
    */
  get comment(): Prisma.CommentDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.4.0
   * Query Engine version: ab56fe763f921d033a6c195e7ddeb3e255bdbb57
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Paper: 'Paper',
    ReviewerAssignment: 'ReviewerAssignment',
    Review: 'Review',
    Comment: 'Comment'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "paper" | "reviewerAssignment" | "review" | "comment"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Paper: {
        payload: Prisma.$PaperPayload<ExtArgs>
        fields: Prisma.PaperFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PaperFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaperPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PaperFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaperPayload>
          }
          findFirst: {
            args: Prisma.PaperFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaperPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PaperFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaperPayload>
          }
          findMany: {
            args: Prisma.PaperFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaperPayload>[]
          }
          create: {
            args: Prisma.PaperCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaperPayload>
          }
          createMany: {
            args: Prisma.PaperCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PaperCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaperPayload>[]
          }
          delete: {
            args: Prisma.PaperDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaperPayload>
          }
          update: {
            args: Prisma.PaperUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaperPayload>
          }
          deleteMany: {
            args: Prisma.PaperDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PaperUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PaperUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaperPayload>[]
          }
          upsert: {
            args: Prisma.PaperUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaperPayload>
          }
          aggregate: {
            args: Prisma.PaperAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePaper>
          }
          groupBy: {
            args: Prisma.PaperGroupByArgs<ExtArgs>
            result: $Utils.Optional<PaperGroupByOutputType>[]
          }
          count: {
            args: Prisma.PaperCountArgs<ExtArgs>
            result: $Utils.Optional<PaperCountAggregateOutputType> | number
          }
        }
      }
      ReviewerAssignment: {
        payload: Prisma.$ReviewerAssignmentPayload<ExtArgs>
        fields: Prisma.ReviewerAssignmentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReviewerAssignmentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewerAssignmentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReviewerAssignmentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewerAssignmentPayload>
          }
          findFirst: {
            args: Prisma.ReviewerAssignmentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewerAssignmentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReviewerAssignmentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewerAssignmentPayload>
          }
          findMany: {
            args: Prisma.ReviewerAssignmentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewerAssignmentPayload>[]
          }
          create: {
            args: Prisma.ReviewerAssignmentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewerAssignmentPayload>
          }
          createMany: {
            args: Prisma.ReviewerAssignmentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ReviewerAssignmentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewerAssignmentPayload>[]
          }
          delete: {
            args: Prisma.ReviewerAssignmentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewerAssignmentPayload>
          }
          update: {
            args: Prisma.ReviewerAssignmentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewerAssignmentPayload>
          }
          deleteMany: {
            args: Prisma.ReviewerAssignmentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReviewerAssignmentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ReviewerAssignmentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewerAssignmentPayload>[]
          }
          upsert: {
            args: Prisma.ReviewerAssignmentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewerAssignmentPayload>
          }
          aggregate: {
            args: Prisma.ReviewerAssignmentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReviewerAssignment>
          }
          groupBy: {
            args: Prisma.ReviewerAssignmentGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReviewerAssignmentGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReviewerAssignmentCountArgs<ExtArgs>
            result: $Utils.Optional<ReviewerAssignmentCountAggregateOutputType> | number
          }
        }
      }
      Review: {
        payload: Prisma.$ReviewPayload<ExtArgs>
        fields: Prisma.ReviewFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReviewFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReviewFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>
          }
          findFirst: {
            args: Prisma.ReviewFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReviewFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>
          }
          findMany: {
            args: Prisma.ReviewFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>[]
          }
          create: {
            args: Prisma.ReviewCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>
          }
          createMany: {
            args: Prisma.ReviewCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ReviewCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>[]
          }
          delete: {
            args: Prisma.ReviewDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>
          }
          update: {
            args: Prisma.ReviewUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>
          }
          deleteMany: {
            args: Prisma.ReviewDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReviewUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ReviewUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>[]
          }
          upsert: {
            args: Prisma.ReviewUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReviewPayload>
          }
          aggregate: {
            args: Prisma.ReviewAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReview>
          }
          groupBy: {
            args: Prisma.ReviewGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReviewGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReviewCountArgs<ExtArgs>
            result: $Utils.Optional<ReviewCountAggregateOutputType> | number
          }
        }
      }
      Comment: {
        payload: Prisma.$CommentPayload<ExtArgs>
        fields: Prisma.CommentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CommentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CommentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          findFirst: {
            args: Prisma.CommentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CommentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          findMany: {
            args: Prisma.CommentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>[]
          }
          create: {
            args: Prisma.CommentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          createMany: {
            args: Prisma.CommentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CommentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>[]
          }
          delete: {
            args: Prisma.CommentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          update: {
            args: Prisma.CommentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          deleteMany: {
            args: Prisma.CommentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CommentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CommentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>[]
          }
          upsert: {
            args: Prisma.CommentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          aggregate: {
            args: Prisma.CommentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateComment>
          }
          groupBy: {
            args: Prisma.CommentGroupByArgs<ExtArgs>
            result: $Utils.Optional<CommentGroupByOutputType>[]
          }
          count: {
            args: Prisma.CommentCountArgs<ExtArgs>
            result: $Utils.Optional<CommentCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    paper?: PaperOmit
    reviewerAssignment?: ReviewerAssignmentOmit
    review?: ReviewOmit
    comment?: CommentOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    papers: number
    reviewerAssignments: number
    reviews: number
    comments: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    papers?: boolean | UserCountOutputTypeCountPapersArgs
    reviewerAssignments?: boolean | UserCountOutputTypeCountReviewerAssignmentsArgs
    reviews?: boolean | UserCountOutputTypeCountReviewsArgs
    comments?: boolean | UserCountOutputTypeCountCommentsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPapersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaperWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountReviewerAssignmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReviewerAssignmentWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountReviewsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReviewWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCommentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommentWhereInput
  }


  /**
   * Count Type PaperCountOutputType
   */

  export type PaperCountOutputType = {
    assignments: number
    reviews: number
    comments: number
  }

  export type PaperCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    assignments?: boolean | PaperCountOutputTypeCountAssignmentsArgs
    reviews?: boolean | PaperCountOutputTypeCountReviewsArgs
    comments?: boolean | PaperCountOutputTypeCountCommentsArgs
  }

  // Custom InputTypes
  /**
   * PaperCountOutputType without action
   */
  export type PaperCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaperCountOutputType
     */
    select?: PaperCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PaperCountOutputType without action
   */
  export type PaperCountOutputTypeCountAssignmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReviewerAssignmentWhereInput
  }

  /**
   * PaperCountOutputType without action
   */
  export type PaperCountOutputTypeCountReviewsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReviewWhereInput
  }

  /**
   * PaperCountOutputType without action
   */
  export type PaperCountOutputTypeCountCommentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommentWhereInput
  }


  /**
   * Count Type CommentCountOutputType
   */

  export type CommentCountOutputType = {
    replies: number
  }

  export type CommentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    replies?: boolean | CommentCountOutputTypeCountRepliesArgs
  }

  // Custom InputTypes
  /**
   * CommentCountOutputType without action
   */
  export type CommentCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommentCountOutputType
     */
    select?: CommentCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CommentCountOutputType without action
   */
  export type CommentCountOutputTypeCountRepliesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommentWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    password: string | null
    role: $Enums.Role | null
    isBanned: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    password: string | null
    role: $Enums.Role | null
    isBanned: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    password: number
    role: number
    isBanned: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
    isBanned?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
    isBanned?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
    isBanned?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    name: string
    email: string
    password: string
    role: $Enums.Role
    isBanned: boolean
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    isBanned?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    papers?: boolean | User$papersArgs<ExtArgs>
    reviewerAssignments?: boolean | User$reviewerAssignmentsArgs<ExtArgs>
    reviews?: boolean | User$reviewsArgs<ExtArgs>
    comments?: boolean | User$commentsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    isBanned?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    isBanned?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    isBanned?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "password" | "role" | "isBanned" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    papers?: boolean | User$papersArgs<ExtArgs>
    reviewerAssignments?: boolean | User$reviewerAssignmentsArgs<ExtArgs>
    reviews?: boolean | User$reviewsArgs<ExtArgs>
    comments?: boolean | User$commentsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      papers: Prisma.$PaperPayload<ExtArgs>[]
      reviewerAssignments: Prisma.$ReviewerAssignmentPayload<ExtArgs>[]
      reviews: Prisma.$ReviewPayload<ExtArgs>[]
      comments: Prisma.$CommentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      email: string
      password: string
      role: $Enums.Role
      isBanned: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    papers<T extends User$papersArgs<ExtArgs> = {}>(args?: Subset<T, User$papersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaperPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    reviewerAssignments<T extends User$reviewerAssignmentsArgs<ExtArgs> = {}>(args?: Subset<T, User$reviewerAssignmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReviewerAssignmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    reviews<T extends User$reviewsArgs<ExtArgs> = {}>(args?: Subset<T, User$reviewsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    comments<T extends User$commentsArgs<ExtArgs> = {}>(args?: Subset<T, User$commentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'Role'>
    readonly isBanned: FieldRef<"User", 'Boolean'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.papers
   */
  export type User$papersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Paper
     */
    select?: PaperSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Paper
     */
    omit?: PaperOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaperInclude<ExtArgs> | null
    where?: PaperWhereInput
    orderBy?: PaperOrderByWithRelationInput | PaperOrderByWithRelationInput[]
    cursor?: PaperWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PaperScalarFieldEnum | PaperScalarFieldEnum[]
  }

  /**
   * User.reviewerAssignments
   */
  export type User$reviewerAssignmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReviewerAssignment
     */
    select?: ReviewerAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReviewerAssignment
     */
    omit?: ReviewerAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewerAssignmentInclude<ExtArgs> | null
    where?: ReviewerAssignmentWhereInput
    orderBy?: ReviewerAssignmentOrderByWithRelationInput | ReviewerAssignmentOrderByWithRelationInput[]
    cursor?: ReviewerAssignmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReviewerAssignmentScalarFieldEnum | ReviewerAssignmentScalarFieldEnum[]
  }

  /**
   * User.reviews
   */
  export type User$reviewsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
    where?: ReviewWhereInput
    orderBy?: ReviewOrderByWithRelationInput | ReviewOrderByWithRelationInput[]
    cursor?: ReviewWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReviewScalarFieldEnum | ReviewScalarFieldEnum[]
  }

  /**
   * User.comments
   */
  export type User$commentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    where?: CommentWhereInput
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    cursor?: CommentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Paper
   */

  export type AggregatePaper = {
    _count: PaperCountAggregateOutputType | null
    _avg: PaperAvgAggregateOutputType | null
    _sum: PaperSumAggregateOutputType | null
    _min: PaperMinAggregateOutputType | null
    _max: PaperMaxAggregateOutputType | null
  }

  export type PaperAvgAggregateOutputType = {
    embedding: number | null
  }

  export type PaperSumAggregateOutputType = {
    embedding: number[]
  }

  export type PaperMinAggregateOutputType = {
    id: string | null
    title: string | null
    abstract: string | null
    domain: string | null
    status: $Enums.PaperStatus | null
    rejectionReason: string | null
    aiSummary: string | null
    reviewAISuggestion: string | null
    createdAt: Date | null
    updatedAt: Date | null
    approvedAt: Date | null
    submittedBy: string | null
  }

  export type PaperMaxAggregateOutputType = {
    id: string | null
    title: string | null
    abstract: string | null
    domain: string | null
    status: $Enums.PaperStatus | null
    rejectionReason: string | null
    aiSummary: string | null
    reviewAISuggestion: string | null
    createdAt: Date | null
    updatedAt: Date | null
    approvedAt: Date | null
    submittedBy: string | null
  }

  export type PaperCountAggregateOutputType = {
    id: number
    title: number
    abstract: number
    domain: number
    keywords: number
    status: number
    rejectionReason: number
    aiSummary: number
    embedding: number
    reviewAISuggestion: number
    createdAt: number
    updatedAt: number
    approvedAt: number
    submittedBy: number
    _all: number
  }


  export type PaperAvgAggregateInputType = {
    embedding?: true
  }

  export type PaperSumAggregateInputType = {
    embedding?: true
  }

  export type PaperMinAggregateInputType = {
    id?: true
    title?: true
    abstract?: true
    domain?: true
    status?: true
    rejectionReason?: true
    aiSummary?: true
    reviewAISuggestion?: true
    createdAt?: true
    updatedAt?: true
    approvedAt?: true
    submittedBy?: true
  }

  export type PaperMaxAggregateInputType = {
    id?: true
    title?: true
    abstract?: true
    domain?: true
    status?: true
    rejectionReason?: true
    aiSummary?: true
    reviewAISuggestion?: true
    createdAt?: true
    updatedAt?: true
    approvedAt?: true
    submittedBy?: true
  }

  export type PaperCountAggregateInputType = {
    id?: true
    title?: true
    abstract?: true
    domain?: true
    keywords?: true
    status?: true
    rejectionReason?: true
    aiSummary?: true
    embedding?: true
    reviewAISuggestion?: true
    createdAt?: true
    updatedAt?: true
    approvedAt?: true
    submittedBy?: true
    _all?: true
  }

  export type PaperAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Paper to aggregate.
     */
    where?: PaperWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Papers to fetch.
     */
    orderBy?: PaperOrderByWithRelationInput | PaperOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PaperWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Papers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Papers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Papers
    **/
    _count?: true | PaperCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PaperAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PaperSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PaperMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PaperMaxAggregateInputType
  }

  export type GetPaperAggregateType<T extends PaperAggregateArgs> = {
        [P in keyof T & keyof AggregatePaper]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePaper[P]>
      : GetScalarType<T[P], AggregatePaper[P]>
  }




  export type PaperGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaperWhereInput
    orderBy?: PaperOrderByWithAggregationInput | PaperOrderByWithAggregationInput[]
    by: PaperScalarFieldEnum[] | PaperScalarFieldEnum
    having?: PaperScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PaperCountAggregateInputType | true
    _avg?: PaperAvgAggregateInputType
    _sum?: PaperSumAggregateInputType
    _min?: PaperMinAggregateInputType
    _max?: PaperMaxAggregateInputType
  }

  export type PaperGroupByOutputType = {
    id: string
    title: string
    abstract: string
    domain: string
    keywords: string[]
    status: $Enums.PaperStatus
    rejectionReason: string | null
    aiSummary: string | null
    embedding: number[]
    reviewAISuggestion: string | null
    createdAt: Date
    updatedAt: Date
    approvedAt: Date | null
    submittedBy: string
    _count: PaperCountAggregateOutputType | null
    _avg: PaperAvgAggregateOutputType | null
    _sum: PaperSumAggregateOutputType | null
    _min: PaperMinAggregateOutputType | null
    _max: PaperMaxAggregateOutputType | null
  }

  type GetPaperGroupByPayload<T extends PaperGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PaperGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PaperGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PaperGroupByOutputType[P]>
            : GetScalarType<T[P], PaperGroupByOutputType[P]>
        }
      >
    >


  export type PaperSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    abstract?: boolean
    domain?: boolean
    keywords?: boolean
    status?: boolean
    rejectionReason?: boolean
    aiSummary?: boolean
    embedding?: boolean
    reviewAISuggestion?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    approvedAt?: boolean
    submittedBy?: boolean
    author?: boolean | UserDefaultArgs<ExtArgs>
    assignments?: boolean | Paper$assignmentsArgs<ExtArgs>
    reviews?: boolean | Paper$reviewsArgs<ExtArgs>
    comments?: boolean | Paper$commentsArgs<ExtArgs>
    _count?: boolean | PaperCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["paper"]>

  export type PaperSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    abstract?: boolean
    domain?: boolean
    keywords?: boolean
    status?: boolean
    rejectionReason?: boolean
    aiSummary?: boolean
    embedding?: boolean
    reviewAISuggestion?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    approvedAt?: boolean
    submittedBy?: boolean
    author?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["paper"]>

  export type PaperSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    abstract?: boolean
    domain?: boolean
    keywords?: boolean
    status?: boolean
    rejectionReason?: boolean
    aiSummary?: boolean
    embedding?: boolean
    reviewAISuggestion?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    approvedAt?: boolean
    submittedBy?: boolean
    author?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["paper"]>

  export type PaperSelectScalar = {
    id?: boolean
    title?: boolean
    abstract?: boolean
    domain?: boolean
    keywords?: boolean
    status?: boolean
    rejectionReason?: boolean
    aiSummary?: boolean
    embedding?: boolean
    reviewAISuggestion?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    approvedAt?: boolean
    submittedBy?: boolean
  }

  export type PaperOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "abstract" | "domain" | "keywords" | "status" | "rejectionReason" | "aiSummary" | "embedding" | "reviewAISuggestion" | "createdAt" | "updatedAt" | "approvedAt" | "submittedBy", ExtArgs["result"]["paper"]>
  export type PaperInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    author?: boolean | UserDefaultArgs<ExtArgs>
    assignments?: boolean | Paper$assignmentsArgs<ExtArgs>
    reviews?: boolean | Paper$reviewsArgs<ExtArgs>
    comments?: boolean | Paper$commentsArgs<ExtArgs>
    _count?: boolean | PaperCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PaperIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    author?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PaperIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    author?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $PaperPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Paper"
    objects: {
      author: Prisma.$UserPayload<ExtArgs>
      assignments: Prisma.$ReviewerAssignmentPayload<ExtArgs>[]
      reviews: Prisma.$ReviewPayload<ExtArgs>[]
      comments: Prisma.$CommentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      abstract: string
      domain: string
      keywords: string[]
      status: $Enums.PaperStatus
      rejectionReason: string | null
      aiSummary: string | null
      embedding: number[]
      reviewAISuggestion: string | null
      createdAt: Date
      updatedAt: Date
      approvedAt: Date | null
      submittedBy: string
    }, ExtArgs["result"]["paper"]>
    composites: {}
  }

  type PaperGetPayload<S extends boolean | null | undefined | PaperDefaultArgs> = $Result.GetResult<Prisma.$PaperPayload, S>

  type PaperCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PaperFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PaperCountAggregateInputType | true
    }

  export interface PaperDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Paper'], meta: { name: 'Paper' } }
    /**
     * Find zero or one Paper that matches the filter.
     * @param {PaperFindUniqueArgs} args - Arguments to find a Paper
     * @example
     * // Get one Paper
     * const paper = await prisma.paper.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PaperFindUniqueArgs>(args: SelectSubset<T, PaperFindUniqueArgs<ExtArgs>>): Prisma__PaperClient<$Result.GetResult<Prisma.$PaperPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Paper that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PaperFindUniqueOrThrowArgs} args - Arguments to find a Paper
     * @example
     * // Get one Paper
     * const paper = await prisma.paper.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PaperFindUniqueOrThrowArgs>(args: SelectSubset<T, PaperFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PaperClient<$Result.GetResult<Prisma.$PaperPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Paper that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaperFindFirstArgs} args - Arguments to find a Paper
     * @example
     * // Get one Paper
     * const paper = await prisma.paper.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PaperFindFirstArgs>(args?: SelectSubset<T, PaperFindFirstArgs<ExtArgs>>): Prisma__PaperClient<$Result.GetResult<Prisma.$PaperPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Paper that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaperFindFirstOrThrowArgs} args - Arguments to find a Paper
     * @example
     * // Get one Paper
     * const paper = await prisma.paper.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PaperFindFirstOrThrowArgs>(args?: SelectSubset<T, PaperFindFirstOrThrowArgs<ExtArgs>>): Prisma__PaperClient<$Result.GetResult<Prisma.$PaperPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Papers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaperFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Papers
     * const papers = await prisma.paper.findMany()
     * 
     * // Get first 10 Papers
     * const papers = await prisma.paper.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const paperWithIdOnly = await prisma.paper.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PaperFindManyArgs>(args?: SelectSubset<T, PaperFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaperPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Paper.
     * @param {PaperCreateArgs} args - Arguments to create a Paper.
     * @example
     * // Create one Paper
     * const Paper = await prisma.paper.create({
     *   data: {
     *     // ... data to create a Paper
     *   }
     * })
     * 
     */
    create<T extends PaperCreateArgs>(args: SelectSubset<T, PaperCreateArgs<ExtArgs>>): Prisma__PaperClient<$Result.GetResult<Prisma.$PaperPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Papers.
     * @param {PaperCreateManyArgs} args - Arguments to create many Papers.
     * @example
     * // Create many Papers
     * const paper = await prisma.paper.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PaperCreateManyArgs>(args?: SelectSubset<T, PaperCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Papers and returns the data saved in the database.
     * @param {PaperCreateManyAndReturnArgs} args - Arguments to create many Papers.
     * @example
     * // Create many Papers
     * const paper = await prisma.paper.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Papers and only return the `id`
     * const paperWithIdOnly = await prisma.paper.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PaperCreateManyAndReturnArgs>(args?: SelectSubset<T, PaperCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaperPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Paper.
     * @param {PaperDeleteArgs} args - Arguments to delete one Paper.
     * @example
     * // Delete one Paper
     * const Paper = await prisma.paper.delete({
     *   where: {
     *     // ... filter to delete one Paper
     *   }
     * })
     * 
     */
    delete<T extends PaperDeleteArgs>(args: SelectSubset<T, PaperDeleteArgs<ExtArgs>>): Prisma__PaperClient<$Result.GetResult<Prisma.$PaperPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Paper.
     * @param {PaperUpdateArgs} args - Arguments to update one Paper.
     * @example
     * // Update one Paper
     * const paper = await prisma.paper.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PaperUpdateArgs>(args: SelectSubset<T, PaperUpdateArgs<ExtArgs>>): Prisma__PaperClient<$Result.GetResult<Prisma.$PaperPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Papers.
     * @param {PaperDeleteManyArgs} args - Arguments to filter Papers to delete.
     * @example
     * // Delete a few Papers
     * const { count } = await prisma.paper.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PaperDeleteManyArgs>(args?: SelectSubset<T, PaperDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Papers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaperUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Papers
     * const paper = await prisma.paper.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PaperUpdateManyArgs>(args: SelectSubset<T, PaperUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Papers and returns the data updated in the database.
     * @param {PaperUpdateManyAndReturnArgs} args - Arguments to update many Papers.
     * @example
     * // Update many Papers
     * const paper = await prisma.paper.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Papers and only return the `id`
     * const paperWithIdOnly = await prisma.paper.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PaperUpdateManyAndReturnArgs>(args: SelectSubset<T, PaperUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaperPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Paper.
     * @param {PaperUpsertArgs} args - Arguments to update or create a Paper.
     * @example
     * // Update or create a Paper
     * const paper = await prisma.paper.upsert({
     *   create: {
     *     // ... data to create a Paper
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Paper we want to update
     *   }
     * })
     */
    upsert<T extends PaperUpsertArgs>(args: SelectSubset<T, PaperUpsertArgs<ExtArgs>>): Prisma__PaperClient<$Result.GetResult<Prisma.$PaperPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Papers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaperCountArgs} args - Arguments to filter Papers to count.
     * @example
     * // Count the number of Papers
     * const count = await prisma.paper.count({
     *   where: {
     *     // ... the filter for the Papers we want to count
     *   }
     * })
    **/
    count<T extends PaperCountArgs>(
      args?: Subset<T, PaperCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PaperCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Paper.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaperAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PaperAggregateArgs>(args: Subset<T, PaperAggregateArgs>): Prisma.PrismaPromise<GetPaperAggregateType<T>>

    /**
     * Group by Paper.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaperGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PaperGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PaperGroupByArgs['orderBy'] }
        : { orderBy?: PaperGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PaperGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPaperGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Paper model
   */
  readonly fields: PaperFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Paper.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PaperClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    author<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    assignments<T extends Paper$assignmentsArgs<ExtArgs> = {}>(args?: Subset<T, Paper$assignmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReviewerAssignmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    reviews<T extends Paper$reviewsArgs<ExtArgs> = {}>(args?: Subset<T, Paper$reviewsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    comments<T extends Paper$commentsArgs<ExtArgs> = {}>(args?: Subset<T, Paper$commentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Paper model
   */
  interface PaperFieldRefs {
    readonly id: FieldRef<"Paper", 'String'>
    readonly title: FieldRef<"Paper", 'String'>
    readonly abstract: FieldRef<"Paper", 'String'>
    readonly domain: FieldRef<"Paper", 'String'>
    readonly keywords: FieldRef<"Paper", 'String[]'>
    readonly status: FieldRef<"Paper", 'PaperStatus'>
    readonly rejectionReason: FieldRef<"Paper", 'String'>
    readonly aiSummary: FieldRef<"Paper", 'String'>
    readonly embedding: FieldRef<"Paper", 'Float[]'>
    readonly reviewAISuggestion: FieldRef<"Paper", 'String'>
    readonly createdAt: FieldRef<"Paper", 'DateTime'>
    readonly updatedAt: FieldRef<"Paper", 'DateTime'>
    readonly approvedAt: FieldRef<"Paper", 'DateTime'>
    readonly submittedBy: FieldRef<"Paper", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Paper findUnique
   */
  export type PaperFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Paper
     */
    select?: PaperSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Paper
     */
    omit?: PaperOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaperInclude<ExtArgs> | null
    /**
     * Filter, which Paper to fetch.
     */
    where: PaperWhereUniqueInput
  }

  /**
   * Paper findUniqueOrThrow
   */
  export type PaperFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Paper
     */
    select?: PaperSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Paper
     */
    omit?: PaperOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaperInclude<ExtArgs> | null
    /**
     * Filter, which Paper to fetch.
     */
    where: PaperWhereUniqueInput
  }

  /**
   * Paper findFirst
   */
  export type PaperFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Paper
     */
    select?: PaperSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Paper
     */
    omit?: PaperOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaperInclude<ExtArgs> | null
    /**
     * Filter, which Paper to fetch.
     */
    where?: PaperWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Papers to fetch.
     */
    orderBy?: PaperOrderByWithRelationInput | PaperOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Papers.
     */
    cursor?: PaperWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Papers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Papers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Papers.
     */
    distinct?: PaperScalarFieldEnum | PaperScalarFieldEnum[]
  }

  /**
   * Paper findFirstOrThrow
   */
  export type PaperFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Paper
     */
    select?: PaperSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Paper
     */
    omit?: PaperOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaperInclude<ExtArgs> | null
    /**
     * Filter, which Paper to fetch.
     */
    where?: PaperWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Papers to fetch.
     */
    orderBy?: PaperOrderByWithRelationInput | PaperOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Papers.
     */
    cursor?: PaperWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Papers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Papers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Papers.
     */
    distinct?: PaperScalarFieldEnum | PaperScalarFieldEnum[]
  }

  /**
   * Paper findMany
   */
  export type PaperFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Paper
     */
    select?: PaperSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Paper
     */
    omit?: PaperOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaperInclude<ExtArgs> | null
    /**
     * Filter, which Papers to fetch.
     */
    where?: PaperWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Papers to fetch.
     */
    orderBy?: PaperOrderByWithRelationInput | PaperOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Papers.
     */
    cursor?: PaperWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Papers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Papers.
     */
    skip?: number
    distinct?: PaperScalarFieldEnum | PaperScalarFieldEnum[]
  }

  /**
   * Paper create
   */
  export type PaperCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Paper
     */
    select?: PaperSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Paper
     */
    omit?: PaperOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaperInclude<ExtArgs> | null
    /**
     * The data needed to create a Paper.
     */
    data: XOR<PaperCreateInput, PaperUncheckedCreateInput>
  }

  /**
   * Paper createMany
   */
  export type PaperCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Papers.
     */
    data: PaperCreateManyInput | PaperCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Paper createManyAndReturn
   */
  export type PaperCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Paper
     */
    select?: PaperSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Paper
     */
    omit?: PaperOmit<ExtArgs> | null
    /**
     * The data used to create many Papers.
     */
    data: PaperCreateManyInput | PaperCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaperIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Paper update
   */
  export type PaperUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Paper
     */
    select?: PaperSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Paper
     */
    omit?: PaperOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaperInclude<ExtArgs> | null
    /**
     * The data needed to update a Paper.
     */
    data: XOR<PaperUpdateInput, PaperUncheckedUpdateInput>
    /**
     * Choose, which Paper to update.
     */
    where: PaperWhereUniqueInput
  }

  /**
   * Paper updateMany
   */
  export type PaperUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Papers.
     */
    data: XOR<PaperUpdateManyMutationInput, PaperUncheckedUpdateManyInput>
    /**
     * Filter which Papers to update
     */
    where?: PaperWhereInput
    /**
     * Limit how many Papers to update.
     */
    limit?: number
  }

  /**
   * Paper updateManyAndReturn
   */
  export type PaperUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Paper
     */
    select?: PaperSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Paper
     */
    omit?: PaperOmit<ExtArgs> | null
    /**
     * The data used to update Papers.
     */
    data: XOR<PaperUpdateManyMutationInput, PaperUncheckedUpdateManyInput>
    /**
     * Filter which Papers to update
     */
    where?: PaperWhereInput
    /**
     * Limit how many Papers to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaperIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Paper upsert
   */
  export type PaperUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Paper
     */
    select?: PaperSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Paper
     */
    omit?: PaperOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaperInclude<ExtArgs> | null
    /**
     * The filter to search for the Paper to update in case it exists.
     */
    where: PaperWhereUniqueInput
    /**
     * In case the Paper found by the `where` argument doesn't exist, create a new Paper with this data.
     */
    create: XOR<PaperCreateInput, PaperUncheckedCreateInput>
    /**
     * In case the Paper was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PaperUpdateInput, PaperUncheckedUpdateInput>
  }

  /**
   * Paper delete
   */
  export type PaperDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Paper
     */
    select?: PaperSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Paper
     */
    omit?: PaperOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaperInclude<ExtArgs> | null
    /**
     * Filter which Paper to delete.
     */
    where: PaperWhereUniqueInput
  }

  /**
   * Paper deleteMany
   */
  export type PaperDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Papers to delete
     */
    where?: PaperWhereInput
    /**
     * Limit how many Papers to delete.
     */
    limit?: number
  }

  /**
   * Paper.assignments
   */
  export type Paper$assignmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReviewerAssignment
     */
    select?: ReviewerAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReviewerAssignment
     */
    omit?: ReviewerAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewerAssignmentInclude<ExtArgs> | null
    where?: ReviewerAssignmentWhereInput
    orderBy?: ReviewerAssignmentOrderByWithRelationInput | ReviewerAssignmentOrderByWithRelationInput[]
    cursor?: ReviewerAssignmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReviewerAssignmentScalarFieldEnum | ReviewerAssignmentScalarFieldEnum[]
  }

  /**
   * Paper.reviews
   */
  export type Paper$reviewsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
    where?: ReviewWhereInput
    orderBy?: ReviewOrderByWithRelationInput | ReviewOrderByWithRelationInput[]
    cursor?: ReviewWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReviewScalarFieldEnum | ReviewScalarFieldEnum[]
  }

  /**
   * Paper.comments
   */
  export type Paper$commentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    where?: CommentWhereInput
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    cursor?: CommentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * Paper without action
   */
  export type PaperDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Paper
     */
    select?: PaperSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Paper
     */
    omit?: PaperOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaperInclude<ExtArgs> | null
  }


  /**
   * Model ReviewerAssignment
   */

  export type AggregateReviewerAssignment = {
    _count: ReviewerAssignmentCountAggregateOutputType | null
    _min: ReviewerAssignmentMinAggregateOutputType | null
    _max: ReviewerAssignmentMaxAggregateOutputType | null
  }

  export type ReviewerAssignmentMinAggregateOutputType = {
    id: string | null
    status: $Enums.AssignmentStatus | null
    assignedAt: Date | null
    paperId: string | null
    reviewerId: string | null
  }

  export type ReviewerAssignmentMaxAggregateOutputType = {
    id: string | null
    status: $Enums.AssignmentStatus | null
    assignedAt: Date | null
    paperId: string | null
    reviewerId: string | null
  }

  export type ReviewerAssignmentCountAggregateOutputType = {
    id: number
    status: number
    assignedAt: number
    paperId: number
    reviewerId: number
    _all: number
  }


  export type ReviewerAssignmentMinAggregateInputType = {
    id?: true
    status?: true
    assignedAt?: true
    paperId?: true
    reviewerId?: true
  }

  export type ReviewerAssignmentMaxAggregateInputType = {
    id?: true
    status?: true
    assignedAt?: true
    paperId?: true
    reviewerId?: true
  }

  export type ReviewerAssignmentCountAggregateInputType = {
    id?: true
    status?: true
    assignedAt?: true
    paperId?: true
    reviewerId?: true
    _all?: true
  }

  export type ReviewerAssignmentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ReviewerAssignment to aggregate.
     */
    where?: ReviewerAssignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReviewerAssignments to fetch.
     */
    orderBy?: ReviewerAssignmentOrderByWithRelationInput | ReviewerAssignmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ReviewerAssignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReviewerAssignments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReviewerAssignments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ReviewerAssignments
    **/
    _count?: true | ReviewerAssignmentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReviewerAssignmentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReviewerAssignmentMaxAggregateInputType
  }

  export type GetReviewerAssignmentAggregateType<T extends ReviewerAssignmentAggregateArgs> = {
        [P in keyof T & keyof AggregateReviewerAssignment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReviewerAssignment[P]>
      : GetScalarType<T[P], AggregateReviewerAssignment[P]>
  }




  export type ReviewerAssignmentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReviewerAssignmentWhereInput
    orderBy?: ReviewerAssignmentOrderByWithAggregationInput | ReviewerAssignmentOrderByWithAggregationInput[]
    by: ReviewerAssignmentScalarFieldEnum[] | ReviewerAssignmentScalarFieldEnum
    having?: ReviewerAssignmentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReviewerAssignmentCountAggregateInputType | true
    _min?: ReviewerAssignmentMinAggregateInputType
    _max?: ReviewerAssignmentMaxAggregateInputType
  }

  export type ReviewerAssignmentGroupByOutputType = {
    id: string
    status: $Enums.AssignmentStatus
    assignedAt: Date
    paperId: string
    reviewerId: string
    _count: ReviewerAssignmentCountAggregateOutputType | null
    _min: ReviewerAssignmentMinAggregateOutputType | null
    _max: ReviewerAssignmentMaxAggregateOutputType | null
  }

  type GetReviewerAssignmentGroupByPayload<T extends ReviewerAssignmentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReviewerAssignmentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReviewerAssignmentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReviewerAssignmentGroupByOutputType[P]>
            : GetScalarType<T[P], ReviewerAssignmentGroupByOutputType[P]>
        }
      >
    >


  export type ReviewerAssignmentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    status?: boolean
    assignedAt?: boolean
    paperId?: boolean
    reviewerId?: boolean
    paper?: boolean | PaperDefaultArgs<ExtArgs>
    reviewer?: boolean | UserDefaultArgs<ExtArgs>
    review?: boolean | ReviewerAssignment$reviewArgs<ExtArgs>
  }, ExtArgs["result"]["reviewerAssignment"]>

  export type ReviewerAssignmentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    status?: boolean
    assignedAt?: boolean
    paperId?: boolean
    reviewerId?: boolean
    paper?: boolean | PaperDefaultArgs<ExtArgs>
    reviewer?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["reviewerAssignment"]>

  export type ReviewerAssignmentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    status?: boolean
    assignedAt?: boolean
    paperId?: boolean
    reviewerId?: boolean
    paper?: boolean | PaperDefaultArgs<ExtArgs>
    reviewer?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["reviewerAssignment"]>

  export type ReviewerAssignmentSelectScalar = {
    id?: boolean
    status?: boolean
    assignedAt?: boolean
    paperId?: boolean
    reviewerId?: boolean
  }

  export type ReviewerAssignmentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "status" | "assignedAt" | "paperId" | "reviewerId", ExtArgs["result"]["reviewerAssignment"]>
  export type ReviewerAssignmentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    paper?: boolean | PaperDefaultArgs<ExtArgs>
    reviewer?: boolean | UserDefaultArgs<ExtArgs>
    review?: boolean | ReviewerAssignment$reviewArgs<ExtArgs>
  }
  export type ReviewerAssignmentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    paper?: boolean | PaperDefaultArgs<ExtArgs>
    reviewer?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ReviewerAssignmentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    paper?: boolean | PaperDefaultArgs<ExtArgs>
    reviewer?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ReviewerAssignmentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ReviewerAssignment"
    objects: {
      paper: Prisma.$PaperPayload<ExtArgs>
      reviewer: Prisma.$UserPayload<ExtArgs>
      review: Prisma.$ReviewPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      status: $Enums.AssignmentStatus
      assignedAt: Date
      paperId: string
      reviewerId: string
    }, ExtArgs["result"]["reviewerAssignment"]>
    composites: {}
  }

  type ReviewerAssignmentGetPayload<S extends boolean | null | undefined | ReviewerAssignmentDefaultArgs> = $Result.GetResult<Prisma.$ReviewerAssignmentPayload, S>

  type ReviewerAssignmentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ReviewerAssignmentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ReviewerAssignmentCountAggregateInputType | true
    }

  export interface ReviewerAssignmentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ReviewerAssignment'], meta: { name: 'ReviewerAssignment' } }
    /**
     * Find zero or one ReviewerAssignment that matches the filter.
     * @param {ReviewerAssignmentFindUniqueArgs} args - Arguments to find a ReviewerAssignment
     * @example
     * // Get one ReviewerAssignment
     * const reviewerAssignment = await prisma.reviewerAssignment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReviewerAssignmentFindUniqueArgs>(args: SelectSubset<T, ReviewerAssignmentFindUniqueArgs<ExtArgs>>): Prisma__ReviewerAssignmentClient<$Result.GetResult<Prisma.$ReviewerAssignmentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ReviewerAssignment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ReviewerAssignmentFindUniqueOrThrowArgs} args - Arguments to find a ReviewerAssignment
     * @example
     * // Get one ReviewerAssignment
     * const reviewerAssignment = await prisma.reviewerAssignment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReviewerAssignmentFindUniqueOrThrowArgs>(args: SelectSubset<T, ReviewerAssignmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ReviewerAssignmentClient<$Result.GetResult<Prisma.$ReviewerAssignmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ReviewerAssignment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewerAssignmentFindFirstArgs} args - Arguments to find a ReviewerAssignment
     * @example
     * // Get one ReviewerAssignment
     * const reviewerAssignment = await prisma.reviewerAssignment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReviewerAssignmentFindFirstArgs>(args?: SelectSubset<T, ReviewerAssignmentFindFirstArgs<ExtArgs>>): Prisma__ReviewerAssignmentClient<$Result.GetResult<Prisma.$ReviewerAssignmentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ReviewerAssignment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewerAssignmentFindFirstOrThrowArgs} args - Arguments to find a ReviewerAssignment
     * @example
     * // Get one ReviewerAssignment
     * const reviewerAssignment = await prisma.reviewerAssignment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReviewerAssignmentFindFirstOrThrowArgs>(args?: SelectSubset<T, ReviewerAssignmentFindFirstOrThrowArgs<ExtArgs>>): Prisma__ReviewerAssignmentClient<$Result.GetResult<Prisma.$ReviewerAssignmentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ReviewerAssignments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewerAssignmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ReviewerAssignments
     * const reviewerAssignments = await prisma.reviewerAssignment.findMany()
     * 
     * // Get first 10 ReviewerAssignments
     * const reviewerAssignments = await prisma.reviewerAssignment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const reviewerAssignmentWithIdOnly = await prisma.reviewerAssignment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ReviewerAssignmentFindManyArgs>(args?: SelectSubset<T, ReviewerAssignmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReviewerAssignmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ReviewerAssignment.
     * @param {ReviewerAssignmentCreateArgs} args - Arguments to create a ReviewerAssignment.
     * @example
     * // Create one ReviewerAssignment
     * const ReviewerAssignment = await prisma.reviewerAssignment.create({
     *   data: {
     *     // ... data to create a ReviewerAssignment
     *   }
     * })
     * 
     */
    create<T extends ReviewerAssignmentCreateArgs>(args: SelectSubset<T, ReviewerAssignmentCreateArgs<ExtArgs>>): Prisma__ReviewerAssignmentClient<$Result.GetResult<Prisma.$ReviewerAssignmentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ReviewerAssignments.
     * @param {ReviewerAssignmentCreateManyArgs} args - Arguments to create many ReviewerAssignments.
     * @example
     * // Create many ReviewerAssignments
     * const reviewerAssignment = await prisma.reviewerAssignment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ReviewerAssignmentCreateManyArgs>(args?: SelectSubset<T, ReviewerAssignmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ReviewerAssignments and returns the data saved in the database.
     * @param {ReviewerAssignmentCreateManyAndReturnArgs} args - Arguments to create many ReviewerAssignments.
     * @example
     * // Create many ReviewerAssignments
     * const reviewerAssignment = await prisma.reviewerAssignment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ReviewerAssignments and only return the `id`
     * const reviewerAssignmentWithIdOnly = await prisma.reviewerAssignment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ReviewerAssignmentCreateManyAndReturnArgs>(args?: SelectSubset<T, ReviewerAssignmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReviewerAssignmentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ReviewerAssignment.
     * @param {ReviewerAssignmentDeleteArgs} args - Arguments to delete one ReviewerAssignment.
     * @example
     * // Delete one ReviewerAssignment
     * const ReviewerAssignment = await prisma.reviewerAssignment.delete({
     *   where: {
     *     // ... filter to delete one ReviewerAssignment
     *   }
     * })
     * 
     */
    delete<T extends ReviewerAssignmentDeleteArgs>(args: SelectSubset<T, ReviewerAssignmentDeleteArgs<ExtArgs>>): Prisma__ReviewerAssignmentClient<$Result.GetResult<Prisma.$ReviewerAssignmentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ReviewerAssignment.
     * @param {ReviewerAssignmentUpdateArgs} args - Arguments to update one ReviewerAssignment.
     * @example
     * // Update one ReviewerAssignment
     * const reviewerAssignment = await prisma.reviewerAssignment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ReviewerAssignmentUpdateArgs>(args: SelectSubset<T, ReviewerAssignmentUpdateArgs<ExtArgs>>): Prisma__ReviewerAssignmentClient<$Result.GetResult<Prisma.$ReviewerAssignmentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ReviewerAssignments.
     * @param {ReviewerAssignmentDeleteManyArgs} args - Arguments to filter ReviewerAssignments to delete.
     * @example
     * // Delete a few ReviewerAssignments
     * const { count } = await prisma.reviewerAssignment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ReviewerAssignmentDeleteManyArgs>(args?: SelectSubset<T, ReviewerAssignmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ReviewerAssignments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewerAssignmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ReviewerAssignments
     * const reviewerAssignment = await prisma.reviewerAssignment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ReviewerAssignmentUpdateManyArgs>(args: SelectSubset<T, ReviewerAssignmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ReviewerAssignments and returns the data updated in the database.
     * @param {ReviewerAssignmentUpdateManyAndReturnArgs} args - Arguments to update many ReviewerAssignments.
     * @example
     * // Update many ReviewerAssignments
     * const reviewerAssignment = await prisma.reviewerAssignment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ReviewerAssignments and only return the `id`
     * const reviewerAssignmentWithIdOnly = await prisma.reviewerAssignment.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ReviewerAssignmentUpdateManyAndReturnArgs>(args: SelectSubset<T, ReviewerAssignmentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReviewerAssignmentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ReviewerAssignment.
     * @param {ReviewerAssignmentUpsertArgs} args - Arguments to update or create a ReviewerAssignment.
     * @example
     * // Update or create a ReviewerAssignment
     * const reviewerAssignment = await prisma.reviewerAssignment.upsert({
     *   create: {
     *     // ... data to create a ReviewerAssignment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ReviewerAssignment we want to update
     *   }
     * })
     */
    upsert<T extends ReviewerAssignmentUpsertArgs>(args: SelectSubset<T, ReviewerAssignmentUpsertArgs<ExtArgs>>): Prisma__ReviewerAssignmentClient<$Result.GetResult<Prisma.$ReviewerAssignmentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ReviewerAssignments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewerAssignmentCountArgs} args - Arguments to filter ReviewerAssignments to count.
     * @example
     * // Count the number of ReviewerAssignments
     * const count = await prisma.reviewerAssignment.count({
     *   where: {
     *     // ... the filter for the ReviewerAssignments we want to count
     *   }
     * })
    **/
    count<T extends ReviewerAssignmentCountArgs>(
      args?: Subset<T, ReviewerAssignmentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReviewerAssignmentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ReviewerAssignment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewerAssignmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ReviewerAssignmentAggregateArgs>(args: Subset<T, ReviewerAssignmentAggregateArgs>): Prisma.PrismaPromise<GetReviewerAssignmentAggregateType<T>>

    /**
     * Group by ReviewerAssignment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewerAssignmentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ReviewerAssignmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReviewerAssignmentGroupByArgs['orderBy'] }
        : { orderBy?: ReviewerAssignmentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ReviewerAssignmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReviewerAssignmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ReviewerAssignment model
   */
  readonly fields: ReviewerAssignmentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ReviewerAssignment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReviewerAssignmentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    paper<T extends PaperDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PaperDefaultArgs<ExtArgs>>): Prisma__PaperClient<$Result.GetResult<Prisma.$PaperPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    reviewer<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    review<T extends ReviewerAssignment$reviewArgs<ExtArgs> = {}>(args?: Subset<T, ReviewerAssignment$reviewArgs<ExtArgs>>): Prisma__ReviewClient<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ReviewerAssignment model
   */
  interface ReviewerAssignmentFieldRefs {
    readonly id: FieldRef<"ReviewerAssignment", 'String'>
    readonly status: FieldRef<"ReviewerAssignment", 'AssignmentStatus'>
    readonly assignedAt: FieldRef<"ReviewerAssignment", 'DateTime'>
    readonly paperId: FieldRef<"ReviewerAssignment", 'String'>
    readonly reviewerId: FieldRef<"ReviewerAssignment", 'String'>
  }
    

  // Custom InputTypes
  /**
   * ReviewerAssignment findUnique
   */
  export type ReviewerAssignmentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReviewerAssignment
     */
    select?: ReviewerAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReviewerAssignment
     */
    omit?: ReviewerAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewerAssignmentInclude<ExtArgs> | null
    /**
     * Filter, which ReviewerAssignment to fetch.
     */
    where: ReviewerAssignmentWhereUniqueInput
  }

  /**
   * ReviewerAssignment findUniqueOrThrow
   */
  export type ReviewerAssignmentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReviewerAssignment
     */
    select?: ReviewerAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReviewerAssignment
     */
    omit?: ReviewerAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewerAssignmentInclude<ExtArgs> | null
    /**
     * Filter, which ReviewerAssignment to fetch.
     */
    where: ReviewerAssignmentWhereUniqueInput
  }

  /**
   * ReviewerAssignment findFirst
   */
  export type ReviewerAssignmentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReviewerAssignment
     */
    select?: ReviewerAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReviewerAssignment
     */
    omit?: ReviewerAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewerAssignmentInclude<ExtArgs> | null
    /**
     * Filter, which ReviewerAssignment to fetch.
     */
    where?: ReviewerAssignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReviewerAssignments to fetch.
     */
    orderBy?: ReviewerAssignmentOrderByWithRelationInput | ReviewerAssignmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ReviewerAssignments.
     */
    cursor?: ReviewerAssignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReviewerAssignments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReviewerAssignments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ReviewerAssignments.
     */
    distinct?: ReviewerAssignmentScalarFieldEnum | ReviewerAssignmentScalarFieldEnum[]
  }

  /**
   * ReviewerAssignment findFirstOrThrow
   */
  export type ReviewerAssignmentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReviewerAssignment
     */
    select?: ReviewerAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReviewerAssignment
     */
    omit?: ReviewerAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewerAssignmentInclude<ExtArgs> | null
    /**
     * Filter, which ReviewerAssignment to fetch.
     */
    where?: ReviewerAssignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReviewerAssignments to fetch.
     */
    orderBy?: ReviewerAssignmentOrderByWithRelationInput | ReviewerAssignmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ReviewerAssignments.
     */
    cursor?: ReviewerAssignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReviewerAssignments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReviewerAssignments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ReviewerAssignments.
     */
    distinct?: ReviewerAssignmentScalarFieldEnum | ReviewerAssignmentScalarFieldEnum[]
  }

  /**
   * ReviewerAssignment findMany
   */
  export type ReviewerAssignmentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReviewerAssignment
     */
    select?: ReviewerAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReviewerAssignment
     */
    omit?: ReviewerAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewerAssignmentInclude<ExtArgs> | null
    /**
     * Filter, which ReviewerAssignments to fetch.
     */
    where?: ReviewerAssignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReviewerAssignments to fetch.
     */
    orderBy?: ReviewerAssignmentOrderByWithRelationInput | ReviewerAssignmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ReviewerAssignments.
     */
    cursor?: ReviewerAssignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReviewerAssignments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReviewerAssignments.
     */
    skip?: number
    distinct?: ReviewerAssignmentScalarFieldEnum | ReviewerAssignmentScalarFieldEnum[]
  }

  /**
   * ReviewerAssignment create
   */
  export type ReviewerAssignmentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReviewerAssignment
     */
    select?: ReviewerAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReviewerAssignment
     */
    omit?: ReviewerAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewerAssignmentInclude<ExtArgs> | null
    /**
     * The data needed to create a ReviewerAssignment.
     */
    data: XOR<ReviewerAssignmentCreateInput, ReviewerAssignmentUncheckedCreateInput>
  }

  /**
   * ReviewerAssignment createMany
   */
  export type ReviewerAssignmentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ReviewerAssignments.
     */
    data: ReviewerAssignmentCreateManyInput | ReviewerAssignmentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ReviewerAssignment createManyAndReturn
   */
  export type ReviewerAssignmentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReviewerAssignment
     */
    select?: ReviewerAssignmentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ReviewerAssignment
     */
    omit?: ReviewerAssignmentOmit<ExtArgs> | null
    /**
     * The data used to create many ReviewerAssignments.
     */
    data: ReviewerAssignmentCreateManyInput | ReviewerAssignmentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewerAssignmentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ReviewerAssignment update
   */
  export type ReviewerAssignmentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReviewerAssignment
     */
    select?: ReviewerAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReviewerAssignment
     */
    omit?: ReviewerAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewerAssignmentInclude<ExtArgs> | null
    /**
     * The data needed to update a ReviewerAssignment.
     */
    data: XOR<ReviewerAssignmentUpdateInput, ReviewerAssignmentUncheckedUpdateInput>
    /**
     * Choose, which ReviewerAssignment to update.
     */
    where: ReviewerAssignmentWhereUniqueInput
  }

  /**
   * ReviewerAssignment updateMany
   */
  export type ReviewerAssignmentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ReviewerAssignments.
     */
    data: XOR<ReviewerAssignmentUpdateManyMutationInput, ReviewerAssignmentUncheckedUpdateManyInput>
    /**
     * Filter which ReviewerAssignments to update
     */
    where?: ReviewerAssignmentWhereInput
    /**
     * Limit how many ReviewerAssignments to update.
     */
    limit?: number
  }

  /**
   * ReviewerAssignment updateManyAndReturn
   */
  export type ReviewerAssignmentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReviewerAssignment
     */
    select?: ReviewerAssignmentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ReviewerAssignment
     */
    omit?: ReviewerAssignmentOmit<ExtArgs> | null
    /**
     * The data used to update ReviewerAssignments.
     */
    data: XOR<ReviewerAssignmentUpdateManyMutationInput, ReviewerAssignmentUncheckedUpdateManyInput>
    /**
     * Filter which ReviewerAssignments to update
     */
    where?: ReviewerAssignmentWhereInput
    /**
     * Limit how many ReviewerAssignments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewerAssignmentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ReviewerAssignment upsert
   */
  export type ReviewerAssignmentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReviewerAssignment
     */
    select?: ReviewerAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReviewerAssignment
     */
    omit?: ReviewerAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewerAssignmentInclude<ExtArgs> | null
    /**
     * The filter to search for the ReviewerAssignment to update in case it exists.
     */
    where: ReviewerAssignmentWhereUniqueInput
    /**
     * In case the ReviewerAssignment found by the `where` argument doesn't exist, create a new ReviewerAssignment with this data.
     */
    create: XOR<ReviewerAssignmentCreateInput, ReviewerAssignmentUncheckedCreateInput>
    /**
     * In case the ReviewerAssignment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReviewerAssignmentUpdateInput, ReviewerAssignmentUncheckedUpdateInput>
  }

  /**
   * ReviewerAssignment delete
   */
  export type ReviewerAssignmentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReviewerAssignment
     */
    select?: ReviewerAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReviewerAssignment
     */
    omit?: ReviewerAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewerAssignmentInclude<ExtArgs> | null
    /**
     * Filter which ReviewerAssignment to delete.
     */
    where: ReviewerAssignmentWhereUniqueInput
  }

  /**
   * ReviewerAssignment deleteMany
   */
  export type ReviewerAssignmentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ReviewerAssignments to delete
     */
    where?: ReviewerAssignmentWhereInput
    /**
     * Limit how many ReviewerAssignments to delete.
     */
    limit?: number
  }

  /**
   * ReviewerAssignment.review
   */
  export type ReviewerAssignment$reviewArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
    where?: ReviewWhereInput
  }

  /**
   * ReviewerAssignment without action
   */
  export type ReviewerAssignmentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReviewerAssignment
     */
    select?: ReviewerAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReviewerAssignment
     */
    omit?: ReviewerAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewerAssignmentInclude<ExtArgs> | null
  }


  /**
   * Model Review
   */

  export type AggregateReview = {
    _count: ReviewCountAggregateOutputType | null
    _avg: ReviewAvgAggregateOutputType | null
    _sum: ReviewSumAggregateOutputType | null
    _min: ReviewMinAggregateOutputType | null
    _max: ReviewMaxAggregateOutputType | null
  }

  export type ReviewAvgAggregateOutputType = {
    score: number | null
  }

  export type ReviewSumAggregateOutputType = {
    score: number | null
  }

  export type ReviewMinAggregateOutputType = {
    id: string | null
    strengths: string | null
    weaknesses: string | null
    score: number | null
    recommendation: string | null
    createdAt: Date | null
    paperId: string | null
    reviewerId: string | null
    assignmentId: string | null
  }

  export type ReviewMaxAggregateOutputType = {
    id: string | null
    strengths: string | null
    weaknesses: string | null
    score: number | null
    recommendation: string | null
    createdAt: Date | null
    paperId: string | null
    reviewerId: string | null
    assignmentId: string | null
  }

  export type ReviewCountAggregateOutputType = {
    id: number
    strengths: number
    weaknesses: number
    score: number
    recommendation: number
    createdAt: number
    paperId: number
    reviewerId: number
    assignmentId: number
    _all: number
  }


  export type ReviewAvgAggregateInputType = {
    score?: true
  }

  export type ReviewSumAggregateInputType = {
    score?: true
  }

  export type ReviewMinAggregateInputType = {
    id?: true
    strengths?: true
    weaknesses?: true
    score?: true
    recommendation?: true
    createdAt?: true
    paperId?: true
    reviewerId?: true
    assignmentId?: true
  }

  export type ReviewMaxAggregateInputType = {
    id?: true
    strengths?: true
    weaknesses?: true
    score?: true
    recommendation?: true
    createdAt?: true
    paperId?: true
    reviewerId?: true
    assignmentId?: true
  }

  export type ReviewCountAggregateInputType = {
    id?: true
    strengths?: true
    weaknesses?: true
    score?: true
    recommendation?: true
    createdAt?: true
    paperId?: true
    reviewerId?: true
    assignmentId?: true
    _all?: true
  }

  export type ReviewAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Review to aggregate.
     */
    where?: ReviewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reviews to fetch.
     */
    orderBy?: ReviewOrderByWithRelationInput | ReviewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ReviewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reviews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reviews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Reviews
    **/
    _count?: true | ReviewCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ReviewAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ReviewSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReviewMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReviewMaxAggregateInputType
  }

  export type GetReviewAggregateType<T extends ReviewAggregateArgs> = {
        [P in keyof T & keyof AggregateReview]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReview[P]>
      : GetScalarType<T[P], AggregateReview[P]>
  }




  export type ReviewGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReviewWhereInput
    orderBy?: ReviewOrderByWithAggregationInput | ReviewOrderByWithAggregationInput[]
    by: ReviewScalarFieldEnum[] | ReviewScalarFieldEnum
    having?: ReviewScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReviewCountAggregateInputType | true
    _avg?: ReviewAvgAggregateInputType
    _sum?: ReviewSumAggregateInputType
    _min?: ReviewMinAggregateInputType
    _max?: ReviewMaxAggregateInputType
  }

  export type ReviewGroupByOutputType = {
    id: string
    strengths: string
    weaknesses: string
    score: number
    recommendation: string
    createdAt: Date
    paperId: string
    reviewerId: string
    assignmentId: string
    _count: ReviewCountAggregateOutputType | null
    _avg: ReviewAvgAggregateOutputType | null
    _sum: ReviewSumAggregateOutputType | null
    _min: ReviewMinAggregateOutputType | null
    _max: ReviewMaxAggregateOutputType | null
  }

  type GetReviewGroupByPayload<T extends ReviewGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReviewGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReviewGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReviewGroupByOutputType[P]>
            : GetScalarType<T[P], ReviewGroupByOutputType[P]>
        }
      >
    >


  export type ReviewSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    strengths?: boolean
    weaknesses?: boolean
    score?: boolean
    recommendation?: boolean
    createdAt?: boolean
    paperId?: boolean
    reviewerId?: boolean
    assignmentId?: boolean
    paper?: boolean | PaperDefaultArgs<ExtArgs>
    reviewer?: boolean | UserDefaultArgs<ExtArgs>
    assignment?: boolean | ReviewerAssignmentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["review"]>

  export type ReviewSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    strengths?: boolean
    weaknesses?: boolean
    score?: boolean
    recommendation?: boolean
    createdAt?: boolean
    paperId?: boolean
    reviewerId?: boolean
    assignmentId?: boolean
    paper?: boolean | PaperDefaultArgs<ExtArgs>
    reviewer?: boolean | UserDefaultArgs<ExtArgs>
    assignment?: boolean | ReviewerAssignmentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["review"]>

  export type ReviewSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    strengths?: boolean
    weaknesses?: boolean
    score?: boolean
    recommendation?: boolean
    createdAt?: boolean
    paperId?: boolean
    reviewerId?: boolean
    assignmentId?: boolean
    paper?: boolean | PaperDefaultArgs<ExtArgs>
    reviewer?: boolean | UserDefaultArgs<ExtArgs>
    assignment?: boolean | ReviewerAssignmentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["review"]>

  export type ReviewSelectScalar = {
    id?: boolean
    strengths?: boolean
    weaknesses?: boolean
    score?: boolean
    recommendation?: boolean
    createdAt?: boolean
    paperId?: boolean
    reviewerId?: boolean
    assignmentId?: boolean
  }

  export type ReviewOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "strengths" | "weaknesses" | "score" | "recommendation" | "createdAt" | "paperId" | "reviewerId" | "assignmentId", ExtArgs["result"]["review"]>
  export type ReviewInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    paper?: boolean | PaperDefaultArgs<ExtArgs>
    reviewer?: boolean | UserDefaultArgs<ExtArgs>
    assignment?: boolean | ReviewerAssignmentDefaultArgs<ExtArgs>
  }
  export type ReviewIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    paper?: boolean | PaperDefaultArgs<ExtArgs>
    reviewer?: boolean | UserDefaultArgs<ExtArgs>
    assignment?: boolean | ReviewerAssignmentDefaultArgs<ExtArgs>
  }
  export type ReviewIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    paper?: boolean | PaperDefaultArgs<ExtArgs>
    reviewer?: boolean | UserDefaultArgs<ExtArgs>
    assignment?: boolean | ReviewerAssignmentDefaultArgs<ExtArgs>
  }

  export type $ReviewPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Review"
    objects: {
      paper: Prisma.$PaperPayload<ExtArgs>
      reviewer: Prisma.$UserPayload<ExtArgs>
      assignment: Prisma.$ReviewerAssignmentPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      strengths: string
      weaknesses: string
      score: number
      recommendation: string
      createdAt: Date
      paperId: string
      reviewerId: string
      assignmentId: string
    }, ExtArgs["result"]["review"]>
    composites: {}
  }

  type ReviewGetPayload<S extends boolean | null | undefined | ReviewDefaultArgs> = $Result.GetResult<Prisma.$ReviewPayload, S>

  type ReviewCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ReviewFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ReviewCountAggregateInputType | true
    }

  export interface ReviewDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Review'], meta: { name: 'Review' } }
    /**
     * Find zero or one Review that matches the filter.
     * @param {ReviewFindUniqueArgs} args - Arguments to find a Review
     * @example
     * // Get one Review
     * const review = await prisma.review.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReviewFindUniqueArgs>(args: SelectSubset<T, ReviewFindUniqueArgs<ExtArgs>>): Prisma__ReviewClient<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Review that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ReviewFindUniqueOrThrowArgs} args - Arguments to find a Review
     * @example
     * // Get one Review
     * const review = await prisma.review.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReviewFindUniqueOrThrowArgs>(args: SelectSubset<T, ReviewFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ReviewClient<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Review that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewFindFirstArgs} args - Arguments to find a Review
     * @example
     * // Get one Review
     * const review = await prisma.review.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReviewFindFirstArgs>(args?: SelectSubset<T, ReviewFindFirstArgs<ExtArgs>>): Prisma__ReviewClient<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Review that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewFindFirstOrThrowArgs} args - Arguments to find a Review
     * @example
     * // Get one Review
     * const review = await prisma.review.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReviewFindFirstOrThrowArgs>(args?: SelectSubset<T, ReviewFindFirstOrThrowArgs<ExtArgs>>): Prisma__ReviewClient<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Reviews that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Reviews
     * const reviews = await prisma.review.findMany()
     * 
     * // Get first 10 Reviews
     * const reviews = await prisma.review.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const reviewWithIdOnly = await prisma.review.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ReviewFindManyArgs>(args?: SelectSubset<T, ReviewFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Review.
     * @param {ReviewCreateArgs} args - Arguments to create a Review.
     * @example
     * // Create one Review
     * const Review = await prisma.review.create({
     *   data: {
     *     // ... data to create a Review
     *   }
     * })
     * 
     */
    create<T extends ReviewCreateArgs>(args: SelectSubset<T, ReviewCreateArgs<ExtArgs>>): Prisma__ReviewClient<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Reviews.
     * @param {ReviewCreateManyArgs} args - Arguments to create many Reviews.
     * @example
     * // Create many Reviews
     * const review = await prisma.review.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ReviewCreateManyArgs>(args?: SelectSubset<T, ReviewCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Reviews and returns the data saved in the database.
     * @param {ReviewCreateManyAndReturnArgs} args - Arguments to create many Reviews.
     * @example
     * // Create many Reviews
     * const review = await prisma.review.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Reviews and only return the `id`
     * const reviewWithIdOnly = await prisma.review.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ReviewCreateManyAndReturnArgs>(args?: SelectSubset<T, ReviewCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Review.
     * @param {ReviewDeleteArgs} args - Arguments to delete one Review.
     * @example
     * // Delete one Review
     * const Review = await prisma.review.delete({
     *   where: {
     *     // ... filter to delete one Review
     *   }
     * })
     * 
     */
    delete<T extends ReviewDeleteArgs>(args: SelectSubset<T, ReviewDeleteArgs<ExtArgs>>): Prisma__ReviewClient<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Review.
     * @param {ReviewUpdateArgs} args - Arguments to update one Review.
     * @example
     * // Update one Review
     * const review = await prisma.review.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ReviewUpdateArgs>(args: SelectSubset<T, ReviewUpdateArgs<ExtArgs>>): Prisma__ReviewClient<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Reviews.
     * @param {ReviewDeleteManyArgs} args - Arguments to filter Reviews to delete.
     * @example
     * // Delete a few Reviews
     * const { count } = await prisma.review.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ReviewDeleteManyArgs>(args?: SelectSubset<T, ReviewDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Reviews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Reviews
     * const review = await prisma.review.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ReviewUpdateManyArgs>(args: SelectSubset<T, ReviewUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Reviews and returns the data updated in the database.
     * @param {ReviewUpdateManyAndReturnArgs} args - Arguments to update many Reviews.
     * @example
     * // Update many Reviews
     * const review = await prisma.review.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Reviews and only return the `id`
     * const reviewWithIdOnly = await prisma.review.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ReviewUpdateManyAndReturnArgs>(args: SelectSubset<T, ReviewUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Review.
     * @param {ReviewUpsertArgs} args - Arguments to update or create a Review.
     * @example
     * // Update or create a Review
     * const review = await prisma.review.upsert({
     *   create: {
     *     // ... data to create a Review
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Review we want to update
     *   }
     * })
     */
    upsert<T extends ReviewUpsertArgs>(args: SelectSubset<T, ReviewUpsertArgs<ExtArgs>>): Prisma__ReviewClient<$Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Reviews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewCountArgs} args - Arguments to filter Reviews to count.
     * @example
     * // Count the number of Reviews
     * const count = await prisma.review.count({
     *   where: {
     *     // ... the filter for the Reviews we want to count
     *   }
     * })
    **/
    count<T extends ReviewCountArgs>(
      args?: Subset<T, ReviewCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReviewCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Review.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ReviewAggregateArgs>(args: Subset<T, ReviewAggregateArgs>): Prisma.PrismaPromise<GetReviewAggregateType<T>>

    /**
     * Group by Review.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReviewGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ReviewGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReviewGroupByArgs['orderBy'] }
        : { orderBy?: ReviewGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ReviewGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReviewGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Review model
   */
  readonly fields: ReviewFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Review.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReviewClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    paper<T extends PaperDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PaperDefaultArgs<ExtArgs>>): Prisma__PaperClient<$Result.GetResult<Prisma.$PaperPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    reviewer<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    assignment<T extends ReviewerAssignmentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ReviewerAssignmentDefaultArgs<ExtArgs>>): Prisma__ReviewerAssignmentClient<$Result.GetResult<Prisma.$ReviewerAssignmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Review model
   */
  interface ReviewFieldRefs {
    readonly id: FieldRef<"Review", 'String'>
    readonly strengths: FieldRef<"Review", 'String'>
    readonly weaknesses: FieldRef<"Review", 'String'>
    readonly score: FieldRef<"Review", 'Int'>
    readonly recommendation: FieldRef<"Review", 'String'>
    readonly createdAt: FieldRef<"Review", 'DateTime'>
    readonly paperId: FieldRef<"Review", 'String'>
    readonly reviewerId: FieldRef<"Review", 'String'>
    readonly assignmentId: FieldRef<"Review", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Review findUnique
   */
  export type ReviewFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
    /**
     * Filter, which Review to fetch.
     */
    where: ReviewWhereUniqueInput
  }

  /**
   * Review findUniqueOrThrow
   */
  export type ReviewFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
    /**
     * Filter, which Review to fetch.
     */
    where: ReviewWhereUniqueInput
  }

  /**
   * Review findFirst
   */
  export type ReviewFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
    /**
     * Filter, which Review to fetch.
     */
    where?: ReviewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reviews to fetch.
     */
    orderBy?: ReviewOrderByWithRelationInput | ReviewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Reviews.
     */
    cursor?: ReviewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reviews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reviews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reviews.
     */
    distinct?: ReviewScalarFieldEnum | ReviewScalarFieldEnum[]
  }

  /**
   * Review findFirstOrThrow
   */
  export type ReviewFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
    /**
     * Filter, which Review to fetch.
     */
    where?: ReviewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reviews to fetch.
     */
    orderBy?: ReviewOrderByWithRelationInput | ReviewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Reviews.
     */
    cursor?: ReviewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reviews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reviews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reviews.
     */
    distinct?: ReviewScalarFieldEnum | ReviewScalarFieldEnum[]
  }

  /**
   * Review findMany
   */
  export type ReviewFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
    /**
     * Filter, which Reviews to fetch.
     */
    where?: ReviewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reviews to fetch.
     */
    orderBy?: ReviewOrderByWithRelationInput | ReviewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Reviews.
     */
    cursor?: ReviewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reviews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reviews.
     */
    skip?: number
    distinct?: ReviewScalarFieldEnum | ReviewScalarFieldEnum[]
  }

  /**
   * Review create
   */
  export type ReviewCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
    /**
     * The data needed to create a Review.
     */
    data: XOR<ReviewCreateInput, ReviewUncheckedCreateInput>
  }

  /**
   * Review createMany
   */
  export type ReviewCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Reviews.
     */
    data: ReviewCreateManyInput | ReviewCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Review createManyAndReturn
   */
  export type ReviewCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * The data used to create many Reviews.
     */
    data: ReviewCreateManyInput | ReviewCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Review update
   */
  export type ReviewUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
    /**
     * The data needed to update a Review.
     */
    data: XOR<ReviewUpdateInput, ReviewUncheckedUpdateInput>
    /**
     * Choose, which Review to update.
     */
    where: ReviewWhereUniqueInput
  }

  /**
   * Review updateMany
   */
  export type ReviewUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Reviews.
     */
    data: XOR<ReviewUpdateManyMutationInput, ReviewUncheckedUpdateManyInput>
    /**
     * Filter which Reviews to update
     */
    where?: ReviewWhereInput
    /**
     * Limit how many Reviews to update.
     */
    limit?: number
  }

  /**
   * Review updateManyAndReturn
   */
  export type ReviewUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * The data used to update Reviews.
     */
    data: XOR<ReviewUpdateManyMutationInput, ReviewUncheckedUpdateManyInput>
    /**
     * Filter which Reviews to update
     */
    where?: ReviewWhereInput
    /**
     * Limit how many Reviews to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Review upsert
   */
  export type ReviewUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
    /**
     * The filter to search for the Review to update in case it exists.
     */
    where: ReviewWhereUniqueInput
    /**
     * In case the Review found by the `where` argument doesn't exist, create a new Review with this data.
     */
    create: XOR<ReviewCreateInput, ReviewUncheckedCreateInput>
    /**
     * In case the Review was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReviewUpdateInput, ReviewUncheckedUpdateInput>
  }

  /**
   * Review delete
   */
  export type ReviewDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
    /**
     * Filter which Review to delete.
     */
    where: ReviewWhereUniqueInput
  }

  /**
   * Review deleteMany
   */
  export type ReviewDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Reviews to delete
     */
    where?: ReviewWhereInput
    /**
     * Limit how many Reviews to delete.
     */
    limit?: number
  }

  /**
   * Review without action
   */
  export type ReviewDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: ReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Review
     */
    omit?: ReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReviewInclude<ExtArgs> | null
  }


  /**
   * Model Comment
   */

  export type AggregateComment = {
    _count: CommentCountAggregateOutputType | null
    _min: CommentMinAggregateOutputType | null
    _max: CommentMaxAggregateOutputType | null
  }

  export type CommentMinAggregateOutputType = {
    id: string | null
    body: string | null
    createdAt: Date | null
    updatedAt: Date | null
    paperId: string | null
    authorId: string | null
    parentId: string | null
  }

  export type CommentMaxAggregateOutputType = {
    id: string | null
    body: string | null
    createdAt: Date | null
    updatedAt: Date | null
    paperId: string | null
    authorId: string | null
    parentId: string | null
  }

  export type CommentCountAggregateOutputType = {
    id: number
    body: number
    createdAt: number
    updatedAt: number
    paperId: number
    authorId: number
    parentId: number
    _all: number
  }


  export type CommentMinAggregateInputType = {
    id?: true
    body?: true
    createdAt?: true
    updatedAt?: true
    paperId?: true
    authorId?: true
    parentId?: true
  }

  export type CommentMaxAggregateInputType = {
    id?: true
    body?: true
    createdAt?: true
    updatedAt?: true
    paperId?: true
    authorId?: true
    parentId?: true
  }

  export type CommentCountAggregateInputType = {
    id?: true
    body?: true
    createdAt?: true
    updatedAt?: true
    paperId?: true
    authorId?: true
    parentId?: true
    _all?: true
  }

  export type CommentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Comment to aggregate.
     */
    where?: CommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Comments to fetch.
     */
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Comments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Comments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Comments
    **/
    _count?: true | CommentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CommentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CommentMaxAggregateInputType
  }

  export type GetCommentAggregateType<T extends CommentAggregateArgs> = {
        [P in keyof T & keyof AggregateComment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateComment[P]>
      : GetScalarType<T[P], AggregateComment[P]>
  }




  export type CommentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommentWhereInput
    orderBy?: CommentOrderByWithAggregationInput | CommentOrderByWithAggregationInput[]
    by: CommentScalarFieldEnum[] | CommentScalarFieldEnum
    having?: CommentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CommentCountAggregateInputType | true
    _min?: CommentMinAggregateInputType
    _max?: CommentMaxAggregateInputType
  }

  export type CommentGroupByOutputType = {
    id: string
    body: string
    createdAt: Date
    updatedAt: Date
    paperId: string
    authorId: string
    parentId: string | null
    _count: CommentCountAggregateOutputType | null
    _min: CommentMinAggregateOutputType | null
    _max: CommentMaxAggregateOutputType | null
  }

  type GetCommentGroupByPayload<T extends CommentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CommentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CommentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CommentGroupByOutputType[P]>
            : GetScalarType<T[P], CommentGroupByOutputType[P]>
        }
      >
    >


  export type CommentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    body?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    paperId?: boolean
    authorId?: boolean
    parentId?: boolean
    paper?: boolean | PaperDefaultArgs<ExtArgs>
    author?: boolean | UserDefaultArgs<ExtArgs>
    parent?: boolean | Comment$parentArgs<ExtArgs>
    replies?: boolean | Comment$repliesArgs<ExtArgs>
    _count?: boolean | CommentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["comment"]>

  export type CommentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    body?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    paperId?: boolean
    authorId?: boolean
    parentId?: boolean
    paper?: boolean | PaperDefaultArgs<ExtArgs>
    author?: boolean | UserDefaultArgs<ExtArgs>
    parent?: boolean | Comment$parentArgs<ExtArgs>
  }, ExtArgs["result"]["comment"]>

  export type CommentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    body?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    paperId?: boolean
    authorId?: boolean
    parentId?: boolean
    paper?: boolean | PaperDefaultArgs<ExtArgs>
    author?: boolean | UserDefaultArgs<ExtArgs>
    parent?: boolean | Comment$parentArgs<ExtArgs>
  }, ExtArgs["result"]["comment"]>

  export type CommentSelectScalar = {
    id?: boolean
    body?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    paperId?: boolean
    authorId?: boolean
    parentId?: boolean
  }

  export type CommentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "body" | "createdAt" | "updatedAt" | "paperId" | "authorId" | "parentId", ExtArgs["result"]["comment"]>
  export type CommentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    paper?: boolean | PaperDefaultArgs<ExtArgs>
    author?: boolean | UserDefaultArgs<ExtArgs>
    parent?: boolean | Comment$parentArgs<ExtArgs>
    replies?: boolean | Comment$repliesArgs<ExtArgs>
    _count?: boolean | CommentCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CommentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    paper?: boolean | PaperDefaultArgs<ExtArgs>
    author?: boolean | UserDefaultArgs<ExtArgs>
    parent?: boolean | Comment$parentArgs<ExtArgs>
  }
  export type CommentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    paper?: boolean | PaperDefaultArgs<ExtArgs>
    author?: boolean | UserDefaultArgs<ExtArgs>
    parent?: boolean | Comment$parentArgs<ExtArgs>
  }

  export type $CommentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Comment"
    objects: {
      paper: Prisma.$PaperPayload<ExtArgs>
      author: Prisma.$UserPayload<ExtArgs>
      parent: Prisma.$CommentPayload<ExtArgs> | null
      replies: Prisma.$CommentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      body: string
      createdAt: Date
      updatedAt: Date
      paperId: string
      authorId: string
      parentId: string | null
    }, ExtArgs["result"]["comment"]>
    composites: {}
  }

  type CommentGetPayload<S extends boolean | null | undefined | CommentDefaultArgs> = $Result.GetResult<Prisma.$CommentPayload, S>

  type CommentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CommentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CommentCountAggregateInputType | true
    }

  export interface CommentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Comment'], meta: { name: 'Comment' } }
    /**
     * Find zero or one Comment that matches the filter.
     * @param {CommentFindUniqueArgs} args - Arguments to find a Comment
     * @example
     * // Get one Comment
     * const comment = await prisma.comment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CommentFindUniqueArgs>(args: SelectSubset<T, CommentFindUniqueArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Comment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CommentFindUniqueOrThrowArgs} args - Arguments to find a Comment
     * @example
     * // Get one Comment
     * const comment = await prisma.comment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CommentFindUniqueOrThrowArgs>(args: SelectSubset<T, CommentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Comment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentFindFirstArgs} args - Arguments to find a Comment
     * @example
     * // Get one Comment
     * const comment = await prisma.comment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CommentFindFirstArgs>(args?: SelectSubset<T, CommentFindFirstArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Comment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentFindFirstOrThrowArgs} args - Arguments to find a Comment
     * @example
     * // Get one Comment
     * const comment = await prisma.comment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CommentFindFirstOrThrowArgs>(args?: SelectSubset<T, CommentFindFirstOrThrowArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Comments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Comments
     * const comments = await prisma.comment.findMany()
     * 
     * // Get first 10 Comments
     * const comments = await prisma.comment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const commentWithIdOnly = await prisma.comment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CommentFindManyArgs>(args?: SelectSubset<T, CommentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Comment.
     * @param {CommentCreateArgs} args - Arguments to create a Comment.
     * @example
     * // Create one Comment
     * const Comment = await prisma.comment.create({
     *   data: {
     *     // ... data to create a Comment
     *   }
     * })
     * 
     */
    create<T extends CommentCreateArgs>(args: SelectSubset<T, CommentCreateArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Comments.
     * @param {CommentCreateManyArgs} args - Arguments to create many Comments.
     * @example
     * // Create many Comments
     * const comment = await prisma.comment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CommentCreateManyArgs>(args?: SelectSubset<T, CommentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Comments and returns the data saved in the database.
     * @param {CommentCreateManyAndReturnArgs} args - Arguments to create many Comments.
     * @example
     * // Create many Comments
     * const comment = await prisma.comment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Comments and only return the `id`
     * const commentWithIdOnly = await prisma.comment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CommentCreateManyAndReturnArgs>(args?: SelectSubset<T, CommentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Comment.
     * @param {CommentDeleteArgs} args - Arguments to delete one Comment.
     * @example
     * // Delete one Comment
     * const Comment = await prisma.comment.delete({
     *   where: {
     *     // ... filter to delete one Comment
     *   }
     * })
     * 
     */
    delete<T extends CommentDeleteArgs>(args: SelectSubset<T, CommentDeleteArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Comment.
     * @param {CommentUpdateArgs} args - Arguments to update one Comment.
     * @example
     * // Update one Comment
     * const comment = await prisma.comment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CommentUpdateArgs>(args: SelectSubset<T, CommentUpdateArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Comments.
     * @param {CommentDeleteManyArgs} args - Arguments to filter Comments to delete.
     * @example
     * // Delete a few Comments
     * const { count } = await prisma.comment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CommentDeleteManyArgs>(args?: SelectSubset<T, CommentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Comments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Comments
     * const comment = await prisma.comment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CommentUpdateManyArgs>(args: SelectSubset<T, CommentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Comments and returns the data updated in the database.
     * @param {CommentUpdateManyAndReturnArgs} args - Arguments to update many Comments.
     * @example
     * // Update many Comments
     * const comment = await prisma.comment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Comments and only return the `id`
     * const commentWithIdOnly = await prisma.comment.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CommentUpdateManyAndReturnArgs>(args: SelectSubset<T, CommentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Comment.
     * @param {CommentUpsertArgs} args - Arguments to update or create a Comment.
     * @example
     * // Update or create a Comment
     * const comment = await prisma.comment.upsert({
     *   create: {
     *     // ... data to create a Comment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Comment we want to update
     *   }
     * })
     */
    upsert<T extends CommentUpsertArgs>(args: SelectSubset<T, CommentUpsertArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Comments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentCountArgs} args - Arguments to filter Comments to count.
     * @example
     * // Count the number of Comments
     * const count = await prisma.comment.count({
     *   where: {
     *     // ... the filter for the Comments we want to count
     *   }
     * })
    **/
    count<T extends CommentCountArgs>(
      args?: Subset<T, CommentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CommentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Comment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CommentAggregateArgs>(args: Subset<T, CommentAggregateArgs>): Prisma.PrismaPromise<GetCommentAggregateType<T>>

    /**
     * Group by Comment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CommentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CommentGroupByArgs['orderBy'] }
        : { orderBy?: CommentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CommentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCommentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Comment model
   */
  readonly fields: CommentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Comment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CommentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    paper<T extends PaperDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PaperDefaultArgs<ExtArgs>>): Prisma__PaperClient<$Result.GetResult<Prisma.$PaperPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    author<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    parent<T extends Comment$parentArgs<ExtArgs> = {}>(args?: Subset<T, Comment$parentArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    replies<T extends Comment$repliesArgs<ExtArgs> = {}>(args?: Subset<T, Comment$repliesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Comment model
   */
  interface CommentFieldRefs {
    readonly id: FieldRef<"Comment", 'String'>
    readonly body: FieldRef<"Comment", 'String'>
    readonly createdAt: FieldRef<"Comment", 'DateTime'>
    readonly updatedAt: FieldRef<"Comment", 'DateTime'>
    readonly paperId: FieldRef<"Comment", 'String'>
    readonly authorId: FieldRef<"Comment", 'String'>
    readonly parentId: FieldRef<"Comment", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Comment findUnique
   */
  export type CommentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * Filter, which Comment to fetch.
     */
    where: CommentWhereUniqueInput
  }

  /**
   * Comment findUniqueOrThrow
   */
  export type CommentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * Filter, which Comment to fetch.
     */
    where: CommentWhereUniqueInput
  }

  /**
   * Comment findFirst
   */
  export type CommentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * Filter, which Comment to fetch.
     */
    where?: CommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Comments to fetch.
     */
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Comments.
     */
    cursor?: CommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Comments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Comments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Comments.
     */
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * Comment findFirstOrThrow
   */
  export type CommentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * Filter, which Comment to fetch.
     */
    where?: CommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Comments to fetch.
     */
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Comments.
     */
    cursor?: CommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Comments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Comments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Comments.
     */
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * Comment findMany
   */
  export type CommentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * Filter, which Comments to fetch.
     */
    where?: CommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Comments to fetch.
     */
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Comments.
     */
    cursor?: CommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Comments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Comments.
     */
    skip?: number
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * Comment create
   */
  export type CommentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * The data needed to create a Comment.
     */
    data: XOR<CommentCreateInput, CommentUncheckedCreateInput>
  }

  /**
   * Comment createMany
   */
  export type CommentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Comments.
     */
    data: CommentCreateManyInput | CommentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Comment createManyAndReturn
   */
  export type CommentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * The data used to create many Comments.
     */
    data: CommentCreateManyInput | CommentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Comment update
   */
  export type CommentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * The data needed to update a Comment.
     */
    data: XOR<CommentUpdateInput, CommentUncheckedUpdateInput>
    /**
     * Choose, which Comment to update.
     */
    where: CommentWhereUniqueInput
  }

  /**
   * Comment updateMany
   */
  export type CommentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Comments.
     */
    data: XOR<CommentUpdateManyMutationInput, CommentUncheckedUpdateManyInput>
    /**
     * Filter which Comments to update
     */
    where?: CommentWhereInput
    /**
     * Limit how many Comments to update.
     */
    limit?: number
  }

  /**
   * Comment updateManyAndReturn
   */
  export type CommentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * The data used to update Comments.
     */
    data: XOR<CommentUpdateManyMutationInput, CommentUncheckedUpdateManyInput>
    /**
     * Filter which Comments to update
     */
    where?: CommentWhereInput
    /**
     * Limit how many Comments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Comment upsert
   */
  export type CommentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * The filter to search for the Comment to update in case it exists.
     */
    where: CommentWhereUniqueInput
    /**
     * In case the Comment found by the `where` argument doesn't exist, create a new Comment with this data.
     */
    create: XOR<CommentCreateInput, CommentUncheckedCreateInput>
    /**
     * In case the Comment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CommentUpdateInput, CommentUncheckedUpdateInput>
  }

  /**
   * Comment delete
   */
  export type CommentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * Filter which Comment to delete.
     */
    where: CommentWhereUniqueInput
  }

  /**
   * Comment deleteMany
   */
  export type CommentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Comments to delete
     */
    where?: CommentWhereInput
    /**
     * Limit how many Comments to delete.
     */
    limit?: number
  }

  /**
   * Comment.parent
   */
  export type Comment$parentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    where?: CommentWhereInput
  }

  /**
   * Comment.replies
   */
  export type Comment$repliesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    where?: CommentWhereInput
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    cursor?: CommentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * Comment without action
   */
  export type CommentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    password: 'password',
    role: 'role',
    isBanned: 'isBanned',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const PaperScalarFieldEnum: {
    id: 'id',
    title: 'title',
    abstract: 'abstract',
    domain: 'domain',
    keywords: 'keywords',
    status: 'status',
    rejectionReason: 'rejectionReason',
    aiSummary: 'aiSummary',
    embedding: 'embedding',
    reviewAISuggestion: 'reviewAISuggestion',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    approvedAt: 'approvedAt',
    submittedBy: 'submittedBy'
  };

  export type PaperScalarFieldEnum = (typeof PaperScalarFieldEnum)[keyof typeof PaperScalarFieldEnum]


  export const ReviewerAssignmentScalarFieldEnum: {
    id: 'id',
    status: 'status',
    assignedAt: 'assignedAt',
    paperId: 'paperId',
    reviewerId: 'reviewerId'
  };

  export type ReviewerAssignmentScalarFieldEnum = (typeof ReviewerAssignmentScalarFieldEnum)[keyof typeof ReviewerAssignmentScalarFieldEnum]


  export const ReviewScalarFieldEnum: {
    id: 'id',
    strengths: 'strengths',
    weaknesses: 'weaknesses',
    score: 'score',
    recommendation: 'recommendation',
    createdAt: 'createdAt',
    paperId: 'paperId',
    reviewerId: 'reviewerId',
    assignmentId: 'assignmentId'
  };

  export type ReviewScalarFieldEnum = (typeof ReviewScalarFieldEnum)[keyof typeof ReviewScalarFieldEnum]


  export const CommentScalarFieldEnum: {
    id: 'id',
    body: 'body',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    paperId: 'paperId',
    authorId: 'authorId',
    parentId: 'parentId'
  };

  export type CommentScalarFieldEnum = (typeof CommentScalarFieldEnum)[keyof typeof CommentScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Role'
   */
  export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>
    


  /**
   * Reference to a field of type 'Role[]'
   */
  export type ListEnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'PaperStatus'
   */
  export type EnumPaperStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaperStatus'>
    


  /**
   * Reference to a field of type 'PaperStatus[]'
   */
  export type ListEnumPaperStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaperStatus[]'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'AssignmentStatus'
   */
  export type EnumAssignmentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AssignmentStatus'>
    


  /**
   * Reference to a field of type 'AssignmentStatus[]'
   */
  export type ListEnumAssignmentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AssignmentStatus[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    isBanned?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    papers?: PaperListRelationFilter
    reviewerAssignments?: ReviewerAssignmentListRelationFilter
    reviews?: ReviewListRelationFilter
    comments?: CommentListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    isBanned?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    papers?: PaperOrderByRelationAggregateInput
    reviewerAssignments?: ReviewerAssignmentOrderByRelationAggregateInput
    reviews?: ReviewOrderByRelationAggregateInput
    comments?: CommentOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    isBanned?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    papers?: PaperListRelationFilter
    reviewerAssignments?: ReviewerAssignmentListRelationFilter
    reviews?: ReviewListRelationFilter
    comments?: CommentListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    isBanned?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    role?: EnumRoleWithAggregatesFilter<"User"> | $Enums.Role
    isBanned?: BoolWithAggregatesFilter<"User"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type PaperWhereInput = {
    AND?: PaperWhereInput | PaperWhereInput[]
    OR?: PaperWhereInput[]
    NOT?: PaperWhereInput | PaperWhereInput[]
    id?: StringFilter<"Paper"> | string
    title?: StringFilter<"Paper"> | string
    abstract?: StringFilter<"Paper"> | string
    domain?: StringFilter<"Paper"> | string
    keywords?: StringNullableListFilter<"Paper">
    status?: EnumPaperStatusFilter<"Paper"> | $Enums.PaperStatus
    rejectionReason?: StringNullableFilter<"Paper"> | string | null
    aiSummary?: StringNullableFilter<"Paper"> | string | null
    embedding?: FloatNullableListFilter<"Paper">
    reviewAISuggestion?: StringNullableFilter<"Paper"> | string | null
    createdAt?: DateTimeFilter<"Paper"> | Date | string
    updatedAt?: DateTimeFilter<"Paper"> | Date | string
    approvedAt?: DateTimeNullableFilter<"Paper"> | Date | string | null
    submittedBy?: StringFilter<"Paper"> | string
    author?: XOR<UserScalarRelationFilter, UserWhereInput>
    assignments?: ReviewerAssignmentListRelationFilter
    reviews?: ReviewListRelationFilter
    comments?: CommentListRelationFilter
  }

  export type PaperOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    abstract?: SortOrder
    domain?: SortOrder
    keywords?: SortOrder
    status?: SortOrder
    rejectionReason?: SortOrderInput | SortOrder
    aiSummary?: SortOrderInput | SortOrder
    embedding?: SortOrder
    reviewAISuggestion?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    approvedAt?: SortOrderInput | SortOrder
    submittedBy?: SortOrder
    author?: UserOrderByWithRelationInput
    assignments?: ReviewerAssignmentOrderByRelationAggregateInput
    reviews?: ReviewOrderByRelationAggregateInput
    comments?: CommentOrderByRelationAggregateInput
  }

  export type PaperWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PaperWhereInput | PaperWhereInput[]
    OR?: PaperWhereInput[]
    NOT?: PaperWhereInput | PaperWhereInput[]
    title?: StringFilter<"Paper"> | string
    abstract?: StringFilter<"Paper"> | string
    domain?: StringFilter<"Paper"> | string
    keywords?: StringNullableListFilter<"Paper">
    status?: EnumPaperStatusFilter<"Paper"> | $Enums.PaperStatus
    rejectionReason?: StringNullableFilter<"Paper"> | string | null
    aiSummary?: StringNullableFilter<"Paper"> | string | null
    embedding?: FloatNullableListFilter<"Paper">
    reviewAISuggestion?: StringNullableFilter<"Paper"> | string | null
    createdAt?: DateTimeFilter<"Paper"> | Date | string
    updatedAt?: DateTimeFilter<"Paper"> | Date | string
    approvedAt?: DateTimeNullableFilter<"Paper"> | Date | string | null
    submittedBy?: StringFilter<"Paper"> | string
    author?: XOR<UserScalarRelationFilter, UserWhereInput>
    assignments?: ReviewerAssignmentListRelationFilter
    reviews?: ReviewListRelationFilter
    comments?: CommentListRelationFilter
  }, "id">

  export type PaperOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    abstract?: SortOrder
    domain?: SortOrder
    keywords?: SortOrder
    status?: SortOrder
    rejectionReason?: SortOrderInput | SortOrder
    aiSummary?: SortOrderInput | SortOrder
    embedding?: SortOrder
    reviewAISuggestion?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    approvedAt?: SortOrderInput | SortOrder
    submittedBy?: SortOrder
    _count?: PaperCountOrderByAggregateInput
    _avg?: PaperAvgOrderByAggregateInput
    _max?: PaperMaxOrderByAggregateInput
    _min?: PaperMinOrderByAggregateInput
    _sum?: PaperSumOrderByAggregateInput
  }

  export type PaperScalarWhereWithAggregatesInput = {
    AND?: PaperScalarWhereWithAggregatesInput | PaperScalarWhereWithAggregatesInput[]
    OR?: PaperScalarWhereWithAggregatesInput[]
    NOT?: PaperScalarWhereWithAggregatesInput | PaperScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Paper"> | string
    title?: StringWithAggregatesFilter<"Paper"> | string
    abstract?: StringWithAggregatesFilter<"Paper"> | string
    domain?: StringWithAggregatesFilter<"Paper"> | string
    keywords?: StringNullableListFilter<"Paper">
    status?: EnumPaperStatusWithAggregatesFilter<"Paper"> | $Enums.PaperStatus
    rejectionReason?: StringNullableWithAggregatesFilter<"Paper"> | string | null
    aiSummary?: StringNullableWithAggregatesFilter<"Paper"> | string | null
    embedding?: FloatNullableListFilter<"Paper">
    reviewAISuggestion?: StringNullableWithAggregatesFilter<"Paper"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Paper"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Paper"> | Date | string
    approvedAt?: DateTimeNullableWithAggregatesFilter<"Paper"> | Date | string | null
    submittedBy?: StringWithAggregatesFilter<"Paper"> | string
  }

  export type ReviewerAssignmentWhereInput = {
    AND?: ReviewerAssignmentWhereInput | ReviewerAssignmentWhereInput[]
    OR?: ReviewerAssignmentWhereInput[]
    NOT?: ReviewerAssignmentWhereInput | ReviewerAssignmentWhereInput[]
    id?: StringFilter<"ReviewerAssignment"> | string
    status?: EnumAssignmentStatusFilter<"ReviewerAssignment"> | $Enums.AssignmentStatus
    assignedAt?: DateTimeFilter<"ReviewerAssignment"> | Date | string
    paperId?: StringFilter<"ReviewerAssignment"> | string
    reviewerId?: StringFilter<"ReviewerAssignment"> | string
    paper?: XOR<PaperScalarRelationFilter, PaperWhereInput>
    reviewer?: XOR<UserScalarRelationFilter, UserWhereInput>
    review?: XOR<ReviewNullableScalarRelationFilter, ReviewWhereInput> | null
  }

  export type ReviewerAssignmentOrderByWithRelationInput = {
    id?: SortOrder
    status?: SortOrder
    assignedAt?: SortOrder
    paperId?: SortOrder
    reviewerId?: SortOrder
    paper?: PaperOrderByWithRelationInput
    reviewer?: UserOrderByWithRelationInput
    review?: ReviewOrderByWithRelationInput
  }

  export type ReviewerAssignmentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    paperId_reviewerId?: ReviewerAssignmentPaperIdReviewerIdCompoundUniqueInput
    AND?: ReviewerAssignmentWhereInput | ReviewerAssignmentWhereInput[]
    OR?: ReviewerAssignmentWhereInput[]
    NOT?: ReviewerAssignmentWhereInput | ReviewerAssignmentWhereInput[]
    status?: EnumAssignmentStatusFilter<"ReviewerAssignment"> | $Enums.AssignmentStatus
    assignedAt?: DateTimeFilter<"ReviewerAssignment"> | Date | string
    paperId?: StringFilter<"ReviewerAssignment"> | string
    reviewerId?: StringFilter<"ReviewerAssignment"> | string
    paper?: XOR<PaperScalarRelationFilter, PaperWhereInput>
    reviewer?: XOR<UserScalarRelationFilter, UserWhereInput>
    review?: XOR<ReviewNullableScalarRelationFilter, ReviewWhereInput> | null
  }, "id" | "paperId_reviewerId">

  export type ReviewerAssignmentOrderByWithAggregationInput = {
    id?: SortOrder
    status?: SortOrder
    assignedAt?: SortOrder
    paperId?: SortOrder
    reviewerId?: SortOrder
    _count?: ReviewerAssignmentCountOrderByAggregateInput
    _max?: ReviewerAssignmentMaxOrderByAggregateInput
    _min?: ReviewerAssignmentMinOrderByAggregateInput
  }

  export type ReviewerAssignmentScalarWhereWithAggregatesInput = {
    AND?: ReviewerAssignmentScalarWhereWithAggregatesInput | ReviewerAssignmentScalarWhereWithAggregatesInput[]
    OR?: ReviewerAssignmentScalarWhereWithAggregatesInput[]
    NOT?: ReviewerAssignmentScalarWhereWithAggregatesInput | ReviewerAssignmentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ReviewerAssignment"> | string
    status?: EnumAssignmentStatusWithAggregatesFilter<"ReviewerAssignment"> | $Enums.AssignmentStatus
    assignedAt?: DateTimeWithAggregatesFilter<"ReviewerAssignment"> | Date | string
    paperId?: StringWithAggregatesFilter<"ReviewerAssignment"> | string
    reviewerId?: StringWithAggregatesFilter<"ReviewerAssignment"> | string
  }

  export type ReviewWhereInput = {
    AND?: ReviewWhereInput | ReviewWhereInput[]
    OR?: ReviewWhereInput[]
    NOT?: ReviewWhereInput | ReviewWhereInput[]
    id?: StringFilter<"Review"> | string
    strengths?: StringFilter<"Review"> | string
    weaknesses?: StringFilter<"Review"> | string
    score?: IntFilter<"Review"> | number
    recommendation?: StringFilter<"Review"> | string
    createdAt?: DateTimeFilter<"Review"> | Date | string
    paperId?: StringFilter<"Review"> | string
    reviewerId?: StringFilter<"Review"> | string
    assignmentId?: StringFilter<"Review"> | string
    paper?: XOR<PaperScalarRelationFilter, PaperWhereInput>
    reviewer?: XOR<UserScalarRelationFilter, UserWhereInput>
    assignment?: XOR<ReviewerAssignmentScalarRelationFilter, ReviewerAssignmentWhereInput>
  }

  export type ReviewOrderByWithRelationInput = {
    id?: SortOrder
    strengths?: SortOrder
    weaknesses?: SortOrder
    score?: SortOrder
    recommendation?: SortOrder
    createdAt?: SortOrder
    paperId?: SortOrder
    reviewerId?: SortOrder
    assignmentId?: SortOrder
    paper?: PaperOrderByWithRelationInput
    reviewer?: UserOrderByWithRelationInput
    assignment?: ReviewerAssignmentOrderByWithRelationInput
  }

  export type ReviewWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    assignmentId?: string
    paperId_reviewerId?: ReviewPaperIdReviewerIdCompoundUniqueInput
    AND?: ReviewWhereInput | ReviewWhereInput[]
    OR?: ReviewWhereInput[]
    NOT?: ReviewWhereInput | ReviewWhereInput[]
    strengths?: StringFilter<"Review"> | string
    weaknesses?: StringFilter<"Review"> | string
    score?: IntFilter<"Review"> | number
    recommendation?: StringFilter<"Review"> | string
    createdAt?: DateTimeFilter<"Review"> | Date | string
    paperId?: StringFilter<"Review"> | string
    reviewerId?: StringFilter<"Review"> | string
    paper?: XOR<PaperScalarRelationFilter, PaperWhereInput>
    reviewer?: XOR<UserScalarRelationFilter, UserWhereInput>
    assignment?: XOR<ReviewerAssignmentScalarRelationFilter, ReviewerAssignmentWhereInput>
  }, "id" | "assignmentId" | "paperId_reviewerId">

  export type ReviewOrderByWithAggregationInput = {
    id?: SortOrder
    strengths?: SortOrder
    weaknesses?: SortOrder
    score?: SortOrder
    recommendation?: SortOrder
    createdAt?: SortOrder
    paperId?: SortOrder
    reviewerId?: SortOrder
    assignmentId?: SortOrder
    _count?: ReviewCountOrderByAggregateInput
    _avg?: ReviewAvgOrderByAggregateInput
    _max?: ReviewMaxOrderByAggregateInput
    _min?: ReviewMinOrderByAggregateInput
    _sum?: ReviewSumOrderByAggregateInput
  }

  export type ReviewScalarWhereWithAggregatesInput = {
    AND?: ReviewScalarWhereWithAggregatesInput | ReviewScalarWhereWithAggregatesInput[]
    OR?: ReviewScalarWhereWithAggregatesInput[]
    NOT?: ReviewScalarWhereWithAggregatesInput | ReviewScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Review"> | string
    strengths?: StringWithAggregatesFilter<"Review"> | string
    weaknesses?: StringWithAggregatesFilter<"Review"> | string
    score?: IntWithAggregatesFilter<"Review"> | number
    recommendation?: StringWithAggregatesFilter<"Review"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Review"> | Date | string
    paperId?: StringWithAggregatesFilter<"Review"> | string
    reviewerId?: StringWithAggregatesFilter<"Review"> | string
    assignmentId?: StringWithAggregatesFilter<"Review"> | string
  }

  export type CommentWhereInput = {
    AND?: CommentWhereInput | CommentWhereInput[]
    OR?: CommentWhereInput[]
    NOT?: CommentWhereInput | CommentWhereInput[]
    id?: StringFilter<"Comment"> | string
    body?: StringFilter<"Comment"> | string
    createdAt?: DateTimeFilter<"Comment"> | Date | string
    updatedAt?: DateTimeFilter<"Comment"> | Date | string
    paperId?: StringFilter<"Comment"> | string
    authorId?: StringFilter<"Comment"> | string
    parentId?: StringNullableFilter<"Comment"> | string | null
    paper?: XOR<PaperScalarRelationFilter, PaperWhereInput>
    author?: XOR<UserScalarRelationFilter, UserWhereInput>
    parent?: XOR<CommentNullableScalarRelationFilter, CommentWhereInput> | null
    replies?: CommentListRelationFilter
  }

  export type CommentOrderByWithRelationInput = {
    id?: SortOrder
    body?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    paperId?: SortOrder
    authorId?: SortOrder
    parentId?: SortOrderInput | SortOrder
    paper?: PaperOrderByWithRelationInput
    author?: UserOrderByWithRelationInput
    parent?: CommentOrderByWithRelationInput
    replies?: CommentOrderByRelationAggregateInput
  }

  export type CommentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CommentWhereInput | CommentWhereInput[]
    OR?: CommentWhereInput[]
    NOT?: CommentWhereInput | CommentWhereInput[]
    body?: StringFilter<"Comment"> | string
    createdAt?: DateTimeFilter<"Comment"> | Date | string
    updatedAt?: DateTimeFilter<"Comment"> | Date | string
    paperId?: StringFilter<"Comment"> | string
    authorId?: StringFilter<"Comment"> | string
    parentId?: StringNullableFilter<"Comment"> | string | null
    paper?: XOR<PaperScalarRelationFilter, PaperWhereInput>
    author?: XOR<UserScalarRelationFilter, UserWhereInput>
    parent?: XOR<CommentNullableScalarRelationFilter, CommentWhereInput> | null
    replies?: CommentListRelationFilter
  }, "id">

  export type CommentOrderByWithAggregationInput = {
    id?: SortOrder
    body?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    paperId?: SortOrder
    authorId?: SortOrder
    parentId?: SortOrderInput | SortOrder
    _count?: CommentCountOrderByAggregateInput
    _max?: CommentMaxOrderByAggregateInput
    _min?: CommentMinOrderByAggregateInput
  }

  export type CommentScalarWhereWithAggregatesInput = {
    AND?: CommentScalarWhereWithAggregatesInput | CommentScalarWhereWithAggregatesInput[]
    OR?: CommentScalarWhereWithAggregatesInput[]
    NOT?: CommentScalarWhereWithAggregatesInput | CommentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Comment"> | string
    body?: StringWithAggregatesFilter<"Comment"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Comment"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Comment"> | Date | string
    paperId?: StringWithAggregatesFilter<"Comment"> | string
    authorId?: StringWithAggregatesFilter<"Comment"> | string
    parentId?: StringNullableWithAggregatesFilter<"Comment"> | string | null
  }

  export type UserCreateInput = {
    id?: string
    name: string
    email: string
    password: string
    role?: $Enums.Role
    isBanned?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    papers?: PaperCreateNestedManyWithoutAuthorInput
    reviewerAssignments?: ReviewerAssignmentCreateNestedManyWithoutReviewerInput
    reviews?: ReviewCreateNestedManyWithoutReviewerInput
    comments?: CommentCreateNestedManyWithoutAuthorInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    name: string
    email: string
    password: string
    role?: $Enums.Role
    isBanned?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    papers?: PaperUncheckedCreateNestedManyWithoutAuthorInput
    reviewerAssignments?: ReviewerAssignmentUncheckedCreateNestedManyWithoutReviewerInput
    reviews?: ReviewUncheckedCreateNestedManyWithoutReviewerInput
    comments?: CommentUncheckedCreateNestedManyWithoutAuthorInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isBanned?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    papers?: PaperUpdateManyWithoutAuthorNestedInput
    reviewerAssignments?: ReviewerAssignmentUpdateManyWithoutReviewerNestedInput
    reviews?: ReviewUpdateManyWithoutReviewerNestedInput
    comments?: CommentUpdateManyWithoutAuthorNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isBanned?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    papers?: PaperUncheckedUpdateManyWithoutAuthorNestedInput
    reviewerAssignments?: ReviewerAssignmentUncheckedUpdateManyWithoutReviewerNestedInput
    reviews?: ReviewUncheckedUpdateManyWithoutReviewerNestedInput
    comments?: CommentUncheckedUpdateManyWithoutAuthorNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    name: string
    email: string
    password: string
    role?: $Enums.Role
    isBanned?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isBanned?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isBanned?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaperCreateInput = {
    id?: string
    title: string
    abstract: string
    domain: string
    keywords?: PaperCreatekeywordsInput | string[]
    status?: $Enums.PaperStatus
    rejectionReason?: string | null
    aiSummary?: string | null
    embedding?: PaperCreateembeddingInput | number[]
    reviewAISuggestion?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    approvedAt?: Date | string | null
    author: UserCreateNestedOneWithoutPapersInput
    assignments?: ReviewerAssignmentCreateNestedManyWithoutPaperInput
    reviews?: ReviewCreateNestedManyWithoutPaperInput
    comments?: CommentCreateNestedManyWithoutPaperInput
  }

  export type PaperUncheckedCreateInput = {
    id?: string
    title: string
    abstract: string
    domain: string
    keywords?: PaperCreatekeywordsInput | string[]
    status?: $Enums.PaperStatus
    rejectionReason?: string | null
    aiSummary?: string | null
    embedding?: PaperCreateembeddingInput | number[]
    reviewAISuggestion?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    approvedAt?: Date | string | null
    submittedBy: string
    assignments?: ReviewerAssignmentUncheckedCreateNestedManyWithoutPaperInput
    reviews?: ReviewUncheckedCreateNestedManyWithoutPaperInput
    comments?: CommentUncheckedCreateNestedManyWithoutPaperInput
  }

  export type PaperUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    abstract?: StringFieldUpdateOperationsInput | string
    domain?: StringFieldUpdateOperationsInput | string
    keywords?: PaperUpdatekeywordsInput | string[]
    status?: EnumPaperStatusFieldUpdateOperationsInput | $Enums.PaperStatus
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    aiSummary?: NullableStringFieldUpdateOperationsInput | string | null
    embedding?: PaperUpdateembeddingInput | number[]
    reviewAISuggestion?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    author?: UserUpdateOneRequiredWithoutPapersNestedInput
    assignments?: ReviewerAssignmentUpdateManyWithoutPaperNestedInput
    reviews?: ReviewUpdateManyWithoutPaperNestedInput
    comments?: CommentUpdateManyWithoutPaperNestedInput
  }

  export type PaperUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    abstract?: StringFieldUpdateOperationsInput | string
    domain?: StringFieldUpdateOperationsInput | string
    keywords?: PaperUpdatekeywordsInput | string[]
    status?: EnumPaperStatusFieldUpdateOperationsInput | $Enums.PaperStatus
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    aiSummary?: NullableStringFieldUpdateOperationsInput | string | null
    embedding?: PaperUpdateembeddingInput | number[]
    reviewAISuggestion?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    submittedBy?: StringFieldUpdateOperationsInput | string
    assignments?: ReviewerAssignmentUncheckedUpdateManyWithoutPaperNestedInput
    reviews?: ReviewUncheckedUpdateManyWithoutPaperNestedInput
    comments?: CommentUncheckedUpdateManyWithoutPaperNestedInput
  }

  export type PaperCreateManyInput = {
    id?: string
    title: string
    abstract: string
    domain: string
    keywords?: PaperCreatekeywordsInput | string[]
    status?: $Enums.PaperStatus
    rejectionReason?: string | null
    aiSummary?: string | null
    embedding?: PaperCreateembeddingInput | number[]
    reviewAISuggestion?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    approvedAt?: Date | string | null
    submittedBy: string
  }

  export type PaperUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    abstract?: StringFieldUpdateOperationsInput | string
    domain?: StringFieldUpdateOperationsInput | string
    keywords?: PaperUpdatekeywordsInput | string[]
    status?: EnumPaperStatusFieldUpdateOperationsInput | $Enums.PaperStatus
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    aiSummary?: NullableStringFieldUpdateOperationsInput | string | null
    embedding?: PaperUpdateembeddingInput | number[]
    reviewAISuggestion?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PaperUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    abstract?: StringFieldUpdateOperationsInput | string
    domain?: StringFieldUpdateOperationsInput | string
    keywords?: PaperUpdatekeywordsInput | string[]
    status?: EnumPaperStatusFieldUpdateOperationsInput | $Enums.PaperStatus
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    aiSummary?: NullableStringFieldUpdateOperationsInput | string | null
    embedding?: PaperUpdateembeddingInput | number[]
    reviewAISuggestion?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    submittedBy?: StringFieldUpdateOperationsInput | string
  }

  export type ReviewerAssignmentCreateInput = {
    id?: string
    status?: $Enums.AssignmentStatus
    assignedAt?: Date | string
    paper: PaperCreateNestedOneWithoutAssignmentsInput
    reviewer: UserCreateNestedOneWithoutReviewerAssignmentsInput
    review?: ReviewCreateNestedOneWithoutAssignmentInput
  }

  export type ReviewerAssignmentUncheckedCreateInput = {
    id?: string
    status?: $Enums.AssignmentStatus
    assignedAt?: Date | string
    paperId: string
    reviewerId: string
    review?: ReviewUncheckedCreateNestedOneWithoutAssignmentInput
  }

  export type ReviewerAssignmentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumAssignmentStatusFieldUpdateOperationsInput | $Enums.AssignmentStatus
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paper?: PaperUpdateOneRequiredWithoutAssignmentsNestedInput
    reviewer?: UserUpdateOneRequiredWithoutReviewerAssignmentsNestedInput
    review?: ReviewUpdateOneWithoutAssignmentNestedInput
  }

  export type ReviewerAssignmentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumAssignmentStatusFieldUpdateOperationsInput | $Enums.AssignmentStatus
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paperId?: StringFieldUpdateOperationsInput | string
    reviewerId?: StringFieldUpdateOperationsInput | string
    review?: ReviewUncheckedUpdateOneWithoutAssignmentNestedInput
  }

  export type ReviewerAssignmentCreateManyInput = {
    id?: string
    status?: $Enums.AssignmentStatus
    assignedAt?: Date | string
    paperId: string
    reviewerId: string
  }

  export type ReviewerAssignmentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumAssignmentStatusFieldUpdateOperationsInput | $Enums.AssignmentStatus
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReviewerAssignmentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumAssignmentStatusFieldUpdateOperationsInput | $Enums.AssignmentStatus
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paperId?: StringFieldUpdateOperationsInput | string
    reviewerId?: StringFieldUpdateOperationsInput | string
  }

  export type ReviewCreateInput = {
    id?: string
    strengths: string
    weaknesses: string
    score: number
    recommendation: string
    createdAt?: Date | string
    paper: PaperCreateNestedOneWithoutReviewsInput
    reviewer: UserCreateNestedOneWithoutReviewsInput
    assignment: ReviewerAssignmentCreateNestedOneWithoutReviewInput
  }

  export type ReviewUncheckedCreateInput = {
    id?: string
    strengths: string
    weaknesses: string
    score: number
    recommendation: string
    createdAt?: Date | string
    paperId: string
    reviewerId: string
    assignmentId: string
  }

  export type ReviewUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    strengths?: StringFieldUpdateOperationsInput | string
    weaknesses?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    recommendation?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paper?: PaperUpdateOneRequiredWithoutReviewsNestedInput
    reviewer?: UserUpdateOneRequiredWithoutReviewsNestedInput
    assignment?: ReviewerAssignmentUpdateOneRequiredWithoutReviewNestedInput
  }

  export type ReviewUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    strengths?: StringFieldUpdateOperationsInput | string
    weaknesses?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    recommendation?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paperId?: StringFieldUpdateOperationsInput | string
    reviewerId?: StringFieldUpdateOperationsInput | string
    assignmentId?: StringFieldUpdateOperationsInput | string
  }

  export type ReviewCreateManyInput = {
    id?: string
    strengths: string
    weaknesses: string
    score: number
    recommendation: string
    createdAt?: Date | string
    paperId: string
    reviewerId: string
    assignmentId: string
  }

  export type ReviewUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    strengths?: StringFieldUpdateOperationsInput | string
    weaknesses?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    recommendation?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReviewUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    strengths?: StringFieldUpdateOperationsInput | string
    weaknesses?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    recommendation?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paperId?: StringFieldUpdateOperationsInput | string
    reviewerId?: StringFieldUpdateOperationsInput | string
    assignmentId?: StringFieldUpdateOperationsInput | string
  }

  export type CommentCreateInput = {
    id?: string
    body: string
    createdAt?: Date | string
    updatedAt?: Date | string
    paper: PaperCreateNestedOneWithoutCommentsInput
    author: UserCreateNestedOneWithoutCommentsInput
    parent?: CommentCreateNestedOneWithoutRepliesInput
    replies?: CommentCreateNestedManyWithoutParentInput
  }

  export type CommentUncheckedCreateInput = {
    id?: string
    body: string
    createdAt?: Date | string
    updatedAt?: Date | string
    paperId: string
    authorId: string
    parentId?: string | null
    replies?: CommentUncheckedCreateNestedManyWithoutParentInput
  }

  export type CommentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paper?: PaperUpdateOneRequiredWithoutCommentsNestedInput
    author?: UserUpdateOneRequiredWithoutCommentsNestedInput
    parent?: CommentUpdateOneWithoutRepliesNestedInput
    replies?: CommentUpdateManyWithoutParentNestedInput
  }

  export type CommentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paperId?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    replies?: CommentUncheckedUpdateManyWithoutParentNestedInput
  }

  export type CommentCreateManyInput = {
    id?: string
    body: string
    createdAt?: Date | string
    updatedAt?: Date | string
    paperId: string
    authorId: string
    parentId?: string | null
  }

  export type CommentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paperId?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type PaperListRelationFilter = {
    every?: PaperWhereInput
    some?: PaperWhereInput
    none?: PaperWhereInput
  }

  export type ReviewerAssignmentListRelationFilter = {
    every?: ReviewerAssignmentWhereInput
    some?: ReviewerAssignmentWhereInput
    none?: ReviewerAssignmentWhereInput
  }

  export type ReviewListRelationFilter = {
    every?: ReviewWhereInput
    some?: ReviewWhereInput
    none?: ReviewWhereInput
  }

  export type CommentListRelationFilter = {
    every?: CommentWhereInput
    some?: CommentWhereInput
    none?: CommentWhereInput
  }

  export type PaperOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ReviewerAssignmentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ReviewOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CommentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    isBanned?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    isBanned?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    isBanned?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type EnumPaperStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PaperStatus | EnumPaperStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaperStatus[] | ListEnumPaperStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaperStatus[] | ListEnumPaperStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPaperStatusFilter<$PrismaModel> | $Enums.PaperStatus
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type FloatNullableListFilter<$PrismaModel = never> = {
    equals?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    has?: number | FloatFieldRefInput<$PrismaModel> | null
    hasEvery?: number[] | ListFloatFieldRefInput<$PrismaModel>
    hasSome?: number[] | ListFloatFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type PaperCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    abstract?: SortOrder
    domain?: SortOrder
    keywords?: SortOrder
    status?: SortOrder
    rejectionReason?: SortOrder
    aiSummary?: SortOrder
    embedding?: SortOrder
    reviewAISuggestion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    approvedAt?: SortOrder
    submittedBy?: SortOrder
  }

  export type PaperAvgOrderByAggregateInput = {
    embedding?: SortOrder
  }

  export type PaperMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    abstract?: SortOrder
    domain?: SortOrder
    status?: SortOrder
    rejectionReason?: SortOrder
    aiSummary?: SortOrder
    reviewAISuggestion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    approvedAt?: SortOrder
    submittedBy?: SortOrder
  }

  export type PaperMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    abstract?: SortOrder
    domain?: SortOrder
    status?: SortOrder
    rejectionReason?: SortOrder
    aiSummary?: SortOrder
    reviewAISuggestion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    approvedAt?: SortOrder
    submittedBy?: SortOrder
  }

  export type PaperSumOrderByAggregateInput = {
    embedding?: SortOrder
  }

  export type EnumPaperStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaperStatus | EnumPaperStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaperStatus[] | ListEnumPaperStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaperStatus[] | ListEnumPaperStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPaperStatusWithAggregatesFilter<$PrismaModel> | $Enums.PaperStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaperStatusFilter<$PrismaModel>
    _max?: NestedEnumPaperStatusFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type EnumAssignmentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AssignmentStatus | EnumAssignmentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AssignmentStatus[] | ListEnumAssignmentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AssignmentStatus[] | ListEnumAssignmentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAssignmentStatusFilter<$PrismaModel> | $Enums.AssignmentStatus
  }

  export type PaperScalarRelationFilter = {
    is?: PaperWhereInput
    isNot?: PaperWhereInput
  }

  export type ReviewNullableScalarRelationFilter = {
    is?: ReviewWhereInput | null
    isNot?: ReviewWhereInput | null
  }

  export type ReviewerAssignmentPaperIdReviewerIdCompoundUniqueInput = {
    paperId: string
    reviewerId: string
  }

  export type ReviewerAssignmentCountOrderByAggregateInput = {
    id?: SortOrder
    status?: SortOrder
    assignedAt?: SortOrder
    paperId?: SortOrder
    reviewerId?: SortOrder
  }

  export type ReviewerAssignmentMaxOrderByAggregateInput = {
    id?: SortOrder
    status?: SortOrder
    assignedAt?: SortOrder
    paperId?: SortOrder
    reviewerId?: SortOrder
  }

  export type ReviewerAssignmentMinOrderByAggregateInput = {
    id?: SortOrder
    status?: SortOrder
    assignedAt?: SortOrder
    paperId?: SortOrder
    reviewerId?: SortOrder
  }

  export type EnumAssignmentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AssignmentStatus | EnumAssignmentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AssignmentStatus[] | ListEnumAssignmentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AssignmentStatus[] | ListEnumAssignmentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAssignmentStatusWithAggregatesFilter<$PrismaModel> | $Enums.AssignmentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAssignmentStatusFilter<$PrismaModel>
    _max?: NestedEnumAssignmentStatusFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type ReviewerAssignmentScalarRelationFilter = {
    is?: ReviewerAssignmentWhereInput
    isNot?: ReviewerAssignmentWhereInput
  }

  export type ReviewPaperIdReviewerIdCompoundUniqueInput = {
    paperId: string
    reviewerId: string
  }

  export type ReviewCountOrderByAggregateInput = {
    id?: SortOrder
    strengths?: SortOrder
    weaknesses?: SortOrder
    score?: SortOrder
    recommendation?: SortOrder
    createdAt?: SortOrder
    paperId?: SortOrder
    reviewerId?: SortOrder
    assignmentId?: SortOrder
  }

  export type ReviewAvgOrderByAggregateInput = {
    score?: SortOrder
  }

  export type ReviewMaxOrderByAggregateInput = {
    id?: SortOrder
    strengths?: SortOrder
    weaknesses?: SortOrder
    score?: SortOrder
    recommendation?: SortOrder
    createdAt?: SortOrder
    paperId?: SortOrder
    reviewerId?: SortOrder
    assignmentId?: SortOrder
  }

  export type ReviewMinOrderByAggregateInput = {
    id?: SortOrder
    strengths?: SortOrder
    weaknesses?: SortOrder
    score?: SortOrder
    recommendation?: SortOrder
    createdAt?: SortOrder
    paperId?: SortOrder
    reviewerId?: SortOrder
    assignmentId?: SortOrder
  }

  export type ReviewSumOrderByAggregateInput = {
    score?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type CommentNullableScalarRelationFilter = {
    is?: CommentWhereInput | null
    isNot?: CommentWhereInput | null
  }

  export type CommentCountOrderByAggregateInput = {
    id?: SortOrder
    body?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    paperId?: SortOrder
    authorId?: SortOrder
    parentId?: SortOrder
  }

  export type CommentMaxOrderByAggregateInput = {
    id?: SortOrder
    body?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    paperId?: SortOrder
    authorId?: SortOrder
    parentId?: SortOrder
  }

  export type CommentMinOrderByAggregateInput = {
    id?: SortOrder
    body?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    paperId?: SortOrder
    authorId?: SortOrder
    parentId?: SortOrder
  }

  export type PaperCreateNestedManyWithoutAuthorInput = {
    create?: XOR<PaperCreateWithoutAuthorInput, PaperUncheckedCreateWithoutAuthorInput> | PaperCreateWithoutAuthorInput[] | PaperUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: PaperCreateOrConnectWithoutAuthorInput | PaperCreateOrConnectWithoutAuthorInput[]
    createMany?: PaperCreateManyAuthorInputEnvelope
    connect?: PaperWhereUniqueInput | PaperWhereUniqueInput[]
  }

  export type ReviewerAssignmentCreateNestedManyWithoutReviewerInput = {
    create?: XOR<ReviewerAssignmentCreateWithoutReviewerInput, ReviewerAssignmentUncheckedCreateWithoutReviewerInput> | ReviewerAssignmentCreateWithoutReviewerInput[] | ReviewerAssignmentUncheckedCreateWithoutReviewerInput[]
    connectOrCreate?: ReviewerAssignmentCreateOrConnectWithoutReviewerInput | ReviewerAssignmentCreateOrConnectWithoutReviewerInput[]
    createMany?: ReviewerAssignmentCreateManyReviewerInputEnvelope
    connect?: ReviewerAssignmentWhereUniqueInput | ReviewerAssignmentWhereUniqueInput[]
  }

  export type ReviewCreateNestedManyWithoutReviewerInput = {
    create?: XOR<ReviewCreateWithoutReviewerInput, ReviewUncheckedCreateWithoutReviewerInput> | ReviewCreateWithoutReviewerInput[] | ReviewUncheckedCreateWithoutReviewerInput[]
    connectOrCreate?: ReviewCreateOrConnectWithoutReviewerInput | ReviewCreateOrConnectWithoutReviewerInput[]
    createMany?: ReviewCreateManyReviewerInputEnvelope
    connect?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
  }

  export type CommentCreateNestedManyWithoutAuthorInput = {
    create?: XOR<CommentCreateWithoutAuthorInput, CommentUncheckedCreateWithoutAuthorInput> | CommentCreateWithoutAuthorInput[] | CommentUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutAuthorInput | CommentCreateOrConnectWithoutAuthorInput[]
    createMany?: CommentCreateManyAuthorInputEnvelope
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
  }

  export type PaperUncheckedCreateNestedManyWithoutAuthorInput = {
    create?: XOR<PaperCreateWithoutAuthorInput, PaperUncheckedCreateWithoutAuthorInput> | PaperCreateWithoutAuthorInput[] | PaperUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: PaperCreateOrConnectWithoutAuthorInput | PaperCreateOrConnectWithoutAuthorInput[]
    createMany?: PaperCreateManyAuthorInputEnvelope
    connect?: PaperWhereUniqueInput | PaperWhereUniqueInput[]
  }

  export type ReviewerAssignmentUncheckedCreateNestedManyWithoutReviewerInput = {
    create?: XOR<ReviewerAssignmentCreateWithoutReviewerInput, ReviewerAssignmentUncheckedCreateWithoutReviewerInput> | ReviewerAssignmentCreateWithoutReviewerInput[] | ReviewerAssignmentUncheckedCreateWithoutReviewerInput[]
    connectOrCreate?: ReviewerAssignmentCreateOrConnectWithoutReviewerInput | ReviewerAssignmentCreateOrConnectWithoutReviewerInput[]
    createMany?: ReviewerAssignmentCreateManyReviewerInputEnvelope
    connect?: ReviewerAssignmentWhereUniqueInput | ReviewerAssignmentWhereUniqueInput[]
  }

  export type ReviewUncheckedCreateNestedManyWithoutReviewerInput = {
    create?: XOR<ReviewCreateWithoutReviewerInput, ReviewUncheckedCreateWithoutReviewerInput> | ReviewCreateWithoutReviewerInput[] | ReviewUncheckedCreateWithoutReviewerInput[]
    connectOrCreate?: ReviewCreateOrConnectWithoutReviewerInput | ReviewCreateOrConnectWithoutReviewerInput[]
    createMany?: ReviewCreateManyReviewerInputEnvelope
    connect?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
  }

  export type CommentUncheckedCreateNestedManyWithoutAuthorInput = {
    create?: XOR<CommentCreateWithoutAuthorInput, CommentUncheckedCreateWithoutAuthorInput> | CommentCreateWithoutAuthorInput[] | CommentUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutAuthorInput | CommentCreateOrConnectWithoutAuthorInput[]
    createMany?: CommentCreateManyAuthorInputEnvelope
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type PaperUpdateManyWithoutAuthorNestedInput = {
    create?: XOR<PaperCreateWithoutAuthorInput, PaperUncheckedCreateWithoutAuthorInput> | PaperCreateWithoutAuthorInput[] | PaperUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: PaperCreateOrConnectWithoutAuthorInput | PaperCreateOrConnectWithoutAuthorInput[]
    upsert?: PaperUpsertWithWhereUniqueWithoutAuthorInput | PaperUpsertWithWhereUniqueWithoutAuthorInput[]
    createMany?: PaperCreateManyAuthorInputEnvelope
    set?: PaperWhereUniqueInput | PaperWhereUniqueInput[]
    disconnect?: PaperWhereUniqueInput | PaperWhereUniqueInput[]
    delete?: PaperWhereUniqueInput | PaperWhereUniqueInput[]
    connect?: PaperWhereUniqueInput | PaperWhereUniqueInput[]
    update?: PaperUpdateWithWhereUniqueWithoutAuthorInput | PaperUpdateWithWhereUniqueWithoutAuthorInput[]
    updateMany?: PaperUpdateManyWithWhereWithoutAuthorInput | PaperUpdateManyWithWhereWithoutAuthorInput[]
    deleteMany?: PaperScalarWhereInput | PaperScalarWhereInput[]
  }

  export type ReviewerAssignmentUpdateManyWithoutReviewerNestedInput = {
    create?: XOR<ReviewerAssignmentCreateWithoutReviewerInput, ReviewerAssignmentUncheckedCreateWithoutReviewerInput> | ReviewerAssignmentCreateWithoutReviewerInput[] | ReviewerAssignmentUncheckedCreateWithoutReviewerInput[]
    connectOrCreate?: ReviewerAssignmentCreateOrConnectWithoutReviewerInput | ReviewerAssignmentCreateOrConnectWithoutReviewerInput[]
    upsert?: ReviewerAssignmentUpsertWithWhereUniqueWithoutReviewerInput | ReviewerAssignmentUpsertWithWhereUniqueWithoutReviewerInput[]
    createMany?: ReviewerAssignmentCreateManyReviewerInputEnvelope
    set?: ReviewerAssignmentWhereUniqueInput | ReviewerAssignmentWhereUniqueInput[]
    disconnect?: ReviewerAssignmentWhereUniqueInput | ReviewerAssignmentWhereUniqueInput[]
    delete?: ReviewerAssignmentWhereUniqueInput | ReviewerAssignmentWhereUniqueInput[]
    connect?: ReviewerAssignmentWhereUniqueInput | ReviewerAssignmentWhereUniqueInput[]
    update?: ReviewerAssignmentUpdateWithWhereUniqueWithoutReviewerInput | ReviewerAssignmentUpdateWithWhereUniqueWithoutReviewerInput[]
    updateMany?: ReviewerAssignmentUpdateManyWithWhereWithoutReviewerInput | ReviewerAssignmentUpdateManyWithWhereWithoutReviewerInput[]
    deleteMany?: ReviewerAssignmentScalarWhereInput | ReviewerAssignmentScalarWhereInput[]
  }

  export type ReviewUpdateManyWithoutReviewerNestedInput = {
    create?: XOR<ReviewCreateWithoutReviewerInput, ReviewUncheckedCreateWithoutReviewerInput> | ReviewCreateWithoutReviewerInput[] | ReviewUncheckedCreateWithoutReviewerInput[]
    connectOrCreate?: ReviewCreateOrConnectWithoutReviewerInput | ReviewCreateOrConnectWithoutReviewerInput[]
    upsert?: ReviewUpsertWithWhereUniqueWithoutReviewerInput | ReviewUpsertWithWhereUniqueWithoutReviewerInput[]
    createMany?: ReviewCreateManyReviewerInputEnvelope
    set?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    disconnect?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    delete?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    connect?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    update?: ReviewUpdateWithWhereUniqueWithoutReviewerInput | ReviewUpdateWithWhereUniqueWithoutReviewerInput[]
    updateMany?: ReviewUpdateManyWithWhereWithoutReviewerInput | ReviewUpdateManyWithWhereWithoutReviewerInput[]
    deleteMany?: ReviewScalarWhereInput | ReviewScalarWhereInput[]
  }

  export type CommentUpdateManyWithoutAuthorNestedInput = {
    create?: XOR<CommentCreateWithoutAuthorInput, CommentUncheckedCreateWithoutAuthorInput> | CommentCreateWithoutAuthorInput[] | CommentUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutAuthorInput | CommentCreateOrConnectWithoutAuthorInput[]
    upsert?: CommentUpsertWithWhereUniqueWithoutAuthorInput | CommentUpsertWithWhereUniqueWithoutAuthorInput[]
    createMany?: CommentCreateManyAuthorInputEnvelope
    set?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    disconnect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    delete?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    update?: CommentUpdateWithWhereUniqueWithoutAuthorInput | CommentUpdateWithWhereUniqueWithoutAuthorInput[]
    updateMany?: CommentUpdateManyWithWhereWithoutAuthorInput | CommentUpdateManyWithWhereWithoutAuthorInput[]
    deleteMany?: CommentScalarWhereInput | CommentScalarWhereInput[]
  }

  export type PaperUncheckedUpdateManyWithoutAuthorNestedInput = {
    create?: XOR<PaperCreateWithoutAuthorInput, PaperUncheckedCreateWithoutAuthorInput> | PaperCreateWithoutAuthorInput[] | PaperUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: PaperCreateOrConnectWithoutAuthorInput | PaperCreateOrConnectWithoutAuthorInput[]
    upsert?: PaperUpsertWithWhereUniqueWithoutAuthorInput | PaperUpsertWithWhereUniqueWithoutAuthorInput[]
    createMany?: PaperCreateManyAuthorInputEnvelope
    set?: PaperWhereUniqueInput | PaperWhereUniqueInput[]
    disconnect?: PaperWhereUniqueInput | PaperWhereUniqueInput[]
    delete?: PaperWhereUniqueInput | PaperWhereUniqueInput[]
    connect?: PaperWhereUniqueInput | PaperWhereUniqueInput[]
    update?: PaperUpdateWithWhereUniqueWithoutAuthorInput | PaperUpdateWithWhereUniqueWithoutAuthorInput[]
    updateMany?: PaperUpdateManyWithWhereWithoutAuthorInput | PaperUpdateManyWithWhereWithoutAuthorInput[]
    deleteMany?: PaperScalarWhereInput | PaperScalarWhereInput[]
  }

  export type ReviewerAssignmentUncheckedUpdateManyWithoutReviewerNestedInput = {
    create?: XOR<ReviewerAssignmentCreateWithoutReviewerInput, ReviewerAssignmentUncheckedCreateWithoutReviewerInput> | ReviewerAssignmentCreateWithoutReviewerInput[] | ReviewerAssignmentUncheckedCreateWithoutReviewerInput[]
    connectOrCreate?: ReviewerAssignmentCreateOrConnectWithoutReviewerInput | ReviewerAssignmentCreateOrConnectWithoutReviewerInput[]
    upsert?: ReviewerAssignmentUpsertWithWhereUniqueWithoutReviewerInput | ReviewerAssignmentUpsertWithWhereUniqueWithoutReviewerInput[]
    createMany?: ReviewerAssignmentCreateManyReviewerInputEnvelope
    set?: ReviewerAssignmentWhereUniqueInput | ReviewerAssignmentWhereUniqueInput[]
    disconnect?: ReviewerAssignmentWhereUniqueInput | ReviewerAssignmentWhereUniqueInput[]
    delete?: ReviewerAssignmentWhereUniqueInput | ReviewerAssignmentWhereUniqueInput[]
    connect?: ReviewerAssignmentWhereUniqueInput | ReviewerAssignmentWhereUniqueInput[]
    update?: ReviewerAssignmentUpdateWithWhereUniqueWithoutReviewerInput | ReviewerAssignmentUpdateWithWhereUniqueWithoutReviewerInput[]
    updateMany?: ReviewerAssignmentUpdateManyWithWhereWithoutReviewerInput | ReviewerAssignmentUpdateManyWithWhereWithoutReviewerInput[]
    deleteMany?: ReviewerAssignmentScalarWhereInput | ReviewerAssignmentScalarWhereInput[]
  }

  export type ReviewUncheckedUpdateManyWithoutReviewerNestedInput = {
    create?: XOR<ReviewCreateWithoutReviewerInput, ReviewUncheckedCreateWithoutReviewerInput> | ReviewCreateWithoutReviewerInput[] | ReviewUncheckedCreateWithoutReviewerInput[]
    connectOrCreate?: ReviewCreateOrConnectWithoutReviewerInput | ReviewCreateOrConnectWithoutReviewerInput[]
    upsert?: ReviewUpsertWithWhereUniqueWithoutReviewerInput | ReviewUpsertWithWhereUniqueWithoutReviewerInput[]
    createMany?: ReviewCreateManyReviewerInputEnvelope
    set?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    disconnect?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    delete?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    connect?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    update?: ReviewUpdateWithWhereUniqueWithoutReviewerInput | ReviewUpdateWithWhereUniqueWithoutReviewerInput[]
    updateMany?: ReviewUpdateManyWithWhereWithoutReviewerInput | ReviewUpdateManyWithWhereWithoutReviewerInput[]
    deleteMany?: ReviewScalarWhereInput | ReviewScalarWhereInput[]
  }

  export type CommentUncheckedUpdateManyWithoutAuthorNestedInput = {
    create?: XOR<CommentCreateWithoutAuthorInput, CommentUncheckedCreateWithoutAuthorInput> | CommentCreateWithoutAuthorInput[] | CommentUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutAuthorInput | CommentCreateOrConnectWithoutAuthorInput[]
    upsert?: CommentUpsertWithWhereUniqueWithoutAuthorInput | CommentUpsertWithWhereUniqueWithoutAuthorInput[]
    createMany?: CommentCreateManyAuthorInputEnvelope
    set?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    disconnect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    delete?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    update?: CommentUpdateWithWhereUniqueWithoutAuthorInput | CommentUpdateWithWhereUniqueWithoutAuthorInput[]
    updateMany?: CommentUpdateManyWithWhereWithoutAuthorInput | CommentUpdateManyWithWhereWithoutAuthorInput[]
    deleteMany?: CommentScalarWhereInput | CommentScalarWhereInput[]
  }

  export type PaperCreatekeywordsInput = {
    set: string[]
  }

  export type PaperCreateembeddingInput = {
    set: number[]
  }

  export type UserCreateNestedOneWithoutPapersInput = {
    create?: XOR<UserCreateWithoutPapersInput, UserUncheckedCreateWithoutPapersInput>
    connectOrCreate?: UserCreateOrConnectWithoutPapersInput
    connect?: UserWhereUniqueInput
  }

  export type ReviewerAssignmentCreateNestedManyWithoutPaperInput = {
    create?: XOR<ReviewerAssignmentCreateWithoutPaperInput, ReviewerAssignmentUncheckedCreateWithoutPaperInput> | ReviewerAssignmentCreateWithoutPaperInput[] | ReviewerAssignmentUncheckedCreateWithoutPaperInput[]
    connectOrCreate?: ReviewerAssignmentCreateOrConnectWithoutPaperInput | ReviewerAssignmentCreateOrConnectWithoutPaperInput[]
    createMany?: ReviewerAssignmentCreateManyPaperInputEnvelope
    connect?: ReviewerAssignmentWhereUniqueInput | ReviewerAssignmentWhereUniqueInput[]
  }

  export type ReviewCreateNestedManyWithoutPaperInput = {
    create?: XOR<ReviewCreateWithoutPaperInput, ReviewUncheckedCreateWithoutPaperInput> | ReviewCreateWithoutPaperInput[] | ReviewUncheckedCreateWithoutPaperInput[]
    connectOrCreate?: ReviewCreateOrConnectWithoutPaperInput | ReviewCreateOrConnectWithoutPaperInput[]
    createMany?: ReviewCreateManyPaperInputEnvelope
    connect?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
  }

  export type CommentCreateNestedManyWithoutPaperInput = {
    create?: XOR<CommentCreateWithoutPaperInput, CommentUncheckedCreateWithoutPaperInput> | CommentCreateWithoutPaperInput[] | CommentUncheckedCreateWithoutPaperInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutPaperInput | CommentCreateOrConnectWithoutPaperInput[]
    createMany?: CommentCreateManyPaperInputEnvelope
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
  }

  export type ReviewerAssignmentUncheckedCreateNestedManyWithoutPaperInput = {
    create?: XOR<ReviewerAssignmentCreateWithoutPaperInput, ReviewerAssignmentUncheckedCreateWithoutPaperInput> | ReviewerAssignmentCreateWithoutPaperInput[] | ReviewerAssignmentUncheckedCreateWithoutPaperInput[]
    connectOrCreate?: ReviewerAssignmentCreateOrConnectWithoutPaperInput | ReviewerAssignmentCreateOrConnectWithoutPaperInput[]
    createMany?: ReviewerAssignmentCreateManyPaperInputEnvelope
    connect?: ReviewerAssignmentWhereUniqueInput | ReviewerAssignmentWhereUniqueInput[]
  }

  export type ReviewUncheckedCreateNestedManyWithoutPaperInput = {
    create?: XOR<ReviewCreateWithoutPaperInput, ReviewUncheckedCreateWithoutPaperInput> | ReviewCreateWithoutPaperInput[] | ReviewUncheckedCreateWithoutPaperInput[]
    connectOrCreate?: ReviewCreateOrConnectWithoutPaperInput | ReviewCreateOrConnectWithoutPaperInput[]
    createMany?: ReviewCreateManyPaperInputEnvelope
    connect?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
  }

  export type CommentUncheckedCreateNestedManyWithoutPaperInput = {
    create?: XOR<CommentCreateWithoutPaperInput, CommentUncheckedCreateWithoutPaperInput> | CommentCreateWithoutPaperInput[] | CommentUncheckedCreateWithoutPaperInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutPaperInput | CommentCreateOrConnectWithoutPaperInput[]
    createMany?: CommentCreateManyPaperInputEnvelope
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
  }

  export type PaperUpdatekeywordsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type EnumPaperStatusFieldUpdateOperationsInput = {
    set?: $Enums.PaperStatus
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type PaperUpdateembeddingInput = {
    set?: number[]
    push?: number | number[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type UserUpdateOneRequiredWithoutPapersNestedInput = {
    create?: XOR<UserCreateWithoutPapersInput, UserUncheckedCreateWithoutPapersInput>
    connectOrCreate?: UserCreateOrConnectWithoutPapersInput
    upsert?: UserUpsertWithoutPapersInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPapersInput, UserUpdateWithoutPapersInput>, UserUncheckedUpdateWithoutPapersInput>
  }

  export type ReviewerAssignmentUpdateManyWithoutPaperNestedInput = {
    create?: XOR<ReviewerAssignmentCreateWithoutPaperInput, ReviewerAssignmentUncheckedCreateWithoutPaperInput> | ReviewerAssignmentCreateWithoutPaperInput[] | ReviewerAssignmentUncheckedCreateWithoutPaperInput[]
    connectOrCreate?: ReviewerAssignmentCreateOrConnectWithoutPaperInput | ReviewerAssignmentCreateOrConnectWithoutPaperInput[]
    upsert?: ReviewerAssignmentUpsertWithWhereUniqueWithoutPaperInput | ReviewerAssignmentUpsertWithWhereUniqueWithoutPaperInput[]
    createMany?: ReviewerAssignmentCreateManyPaperInputEnvelope
    set?: ReviewerAssignmentWhereUniqueInput | ReviewerAssignmentWhereUniqueInput[]
    disconnect?: ReviewerAssignmentWhereUniqueInput | ReviewerAssignmentWhereUniqueInput[]
    delete?: ReviewerAssignmentWhereUniqueInput | ReviewerAssignmentWhereUniqueInput[]
    connect?: ReviewerAssignmentWhereUniqueInput | ReviewerAssignmentWhereUniqueInput[]
    update?: ReviewerAssignmentUpdateWithWhereUniqueWithoutPaperInput | ReviewerAssignmentUpdateWithWhereUniqueWithoutPaperInput[]
    updateMany?: ReviewerAssignmentUpdateManyWithWhereWithoutPaperInput | ReviewerAssignmentUpdateManyWithWhereWithoutPaperInput[]
    deleteMany?: ReviewerAssignmentScalarWhereInput | ReviewerAssignmentScalarWhereInput[]
  }

  export type ReviewUpdateManyWithoutPaperNestedInput = {
    create?: XOR<ReviewCreateWithoutPaperInput, ReviewUncheckedCreateWithoutPaperInput> | ReviewCreateWithoutPaperInput[] | ReviewUncheckedCreateWithoutPaperInput[]
    connectOrCreate?: ReviewCreateOrConnectWithoutPaperInput | ReviewCreateOrConnectWithoutPaperInput[]
    upsert?: ReviewUpsertWithWhereUniqueWithoutPaperInput | ReviewUpsertWithWhereUniqueWithoutPaperInput[]
    createMany?: ReviewCreateManyPaperInputEnvelope
    set?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    disconnect?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    delete?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    connect?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    update?: ReviewUpdateWithWhereUniqueWithoutPaperInput | ReviewUpdateWithWhereUniqueWithoutPaperInput[]
    updateMany?: ReviewUpdateManyWithWhereWithoutPaperInput | ReviewUpdateManyWithWhereWithoutPaperInput[]
    deleteMany?: ReviewScalarWhereInput | ReviewScalarWhereInput[]
  }

  export type CommentUpdateManyWithoutPaperNestedInput = {
    create?: XOR<CommentCreateWithoutPaperInput, CommentUncheckedCreateWithoutPaperInput> | CommentCreateWithoutPaperInput[] | CommentUncheckedCreateWithoutPaperInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutPaperInput | CommentCreateOrConnectWithoutPaperInput[]
    upsert?: CommentUpsertWithWhereUniqueWithoutPaperInput | CommentUpsertWithWhereUniqueWithoutPaperInput[]
    createMany?: CommentCreateManyPaperInputEnvelope
    set?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    disconnect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    delete?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    update?: CommentUpdateWithWhereUniqueWithoutPaperInput | CommentUpdateWithWhereUniqueWithoutPaperInput[]
    updateMany?: CommentUpdateManyWithWhereWithoutPaperInput | CommentUpdateManyWithWhereWithoutPaperInput[]
    deleteMany?: CommentScalarWhereInput | CommentScalarWhereInput[]
  }

  export type ReviewerAssignmentUncheckedUpdateManyWithoutPaperNestedInput = {
    create?: XOR<ReviewerAssignmentCreateWithoutPaperInput, ReviewerAssignmentUncheckedCreateWithoutPaperInput> | ReviewerAssignmentCreateWithoutPaperInput[] | ReviewerAssignmentUncheckedCreateWithoutPaperInput[]
    connectOrCreate?: ReviewerAssignmentCreateOrConnectWithoutPaperInput | ReviewerAssignmentCreateOrConnectWithoutPaperInput[]
    upsert?: ReviewerAssignmentUpsertWithWhereUniqueWithoutPaperInput | ReviewerAssignmentUpsertWithWhereUniqueWithoutPaperInput[]
    createMany?: ReviewerAssignmentCreateManyPaperInputEnvelope
    set?: ReviewerAssignmentWhereUniqueInput | ReviewerAssignmentWhereUniqueInput[]
    disconnect?: ReviewerAssignmentWhereUniqueInput | ReviewerAssignmentWhereUniqueInput[]
    delete?: ReviewerAssignmentWhereUniqueInput | ReviewerAssignmentWhereUniqueInput[]
    connect?: ReviewerAssignmentWhereUniqueInput | ReviewerAssignmentWhereUniqueInput[]
    update?: ReviewerAssignmentUpdateWithWhereUniqueWithoutPaperInput | ReviewerAssignmentUpdateWithWhereUniqueWithoutPaperInput[]
    updateMany?: ReviewerAssignmentUpdateManyWithWhereWithoutPaperInput | ReviewerAssignmentUpdateManyWithWhereWithoutPaperInput[]
    deleteMany?: ReviewerAssignmentScalarWhereInput | ReviewerAssignmentScalarWhereInput[]
  }

  export type ReviewUncheckedUpdateManyWithoutPaperNestedInput = {
    create?: XOR<ReviewCreateWithoutPaperInput, ReviewUncheckedCreateWithoutPaperInput> | ReviewCreateWithoutPaperInput[] | ReviewUncheckedCreateWithoutPaperInput[]
    connectOrCreate?: ReviewCreateOrConnectWithoutPaperInput | ReviewCreateOrConnectWithoutPaperInput[]
    upsert?: ReviewUpsertWithWhereUniqueWithoutPaperInput | ReviewUpsertWithWhereUniqueWithoutPaperInput[]
    createMany?: ReviewCreateManyPaperInputEnvelope
    set?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    disconnect?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    delete?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    connect?: ReviewWhereUniqueInput | ReviewWhereUniqueInput[]
    update?: ReviewUpdateWithWhereUniqueWithoutPaperInput | ReviewUpdateWithWhereUniqueWithoutPaperInput[]
    updateMany?: ReviewUpdateManyWithWhereWithoutPaperInput | ReviewUpdateManyWithWhereWithoutPaperInput[]
    deleteMany?: ReviewScalarWhereInput | ReviewScalarWhereInput[]
  }

  export type CommentUncheckedUpdateManyWithoutPaperNestedInput = {
    create?: XOR<CommentCreateWithoutPaperInput, CommentUncheckedCreateWithoutPaperInput> | CommentCreateWithoutPaperInput[] | CommentUncheckedCreateWithoutPaperInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutPaperInput | CommentCreateOrConnectWithoutPaperInput[]
    upsert?: CommentUpsertWithWhereUniqueWithoutPaperInput | CommentUpsertWithWhereUniqueWithoutPaperInput[]
    createMany?: CommentCreateManyPaperInputEnvelope
    set?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    disconnect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    delete?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    update?: CommentUpdateWithWhereUniqueWithoutPaperInput | CommentUpdateWithWhereUniqueWithoutPaperInput[]
    updateMany?: CommentUpdateManyWithWhereWithoutPaperInput | CommentUpdateManyWithWhereWithoutPaperInput[]
    deleteMany?: CommentScalarWhereInput | CommentScalarWhereInput[]
  }

  export type PaperCreateNestedOneWithoutAssignmentsInput = {
    create?: XOR<PaperCreateWithoutAssignmentsInput, PaperUncheckedCreateWithoutAssignmentsInput>
    connectOrCreate?: PaperCreateOrConnectWithoutAssignmentsInput
    connect?: PaperWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutReviewerAssignmentsInput = {
    create?: XOR<UserCreateWithoutReviewerAssignmentsInput, UserUncheckedCreateWithoutReviewerAssignmentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutReviewerAssignmentsInput
    connect?: UserWhereUniqueInput
  }

  export type ReviewCreateNestedOneWithoutAssignmentInput = {
    create?: XOR<ReviewCreateWithoutAssignmentInput, ReviewUncheckedCreateWithoutAssignmentInput>
    connectOrCreate?: ReviewCreateOrConnectWithoutAssignmentInput
    connect?: ReviewWhereUniqueInput
  }

  export type ReviewUncheckedCreateNestedOneWithoutAssignmentInput = {
    create?: XOR<ReviewCreateWithoutAssignmentInput, ReviewUncheckedCreateWithoutAssignmentInput>
    connectOrCreate?: ReviewCreateOrConnectWithoutAssignmentInput
    connect?: ReviewWhereUniqueInput
  }

  export type EnumAssignmentStatusFieldUpdateOperationsInput = {
    set?: $Enums.AssignmentStatus
  }

  export type PaperUpdateOneRequiredWithoutAssignmentsNestedInput = {
    create?: XOR<PaperCreateWithoutAssignmentsInput, PaperUncheckedCreateWithoutAssignmentsInput>
    connectOrCreate?: PaperCreateOrConnectWithoutAssignmentsInput
    upsert?: PaperUpsertWithoutAssignmentsInput
    connect?: PaperWhereUniqueInput
    update?: XOR<XOR<PaperUpdateToOneWithWhereWithoutAssignmentsInput, PaperUpdateWithoutAssignmentsInput>, PaperUncheckedUpdateWithoutAssignmentsInput>
  }

  export type UserUpdateOneRequiredWithoutReviewerAssignmentsNestedInput = {
    create?: XOR<UserCreateWithoutReviewerAssignmentsInput, UserUncheckedCreateWithoutReviewerAssignmentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutReviewerAssignmentsInput
    upsert?: UserUpsertWithoutReviewerAssignmentsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutReviewerAssignmentsInput, UserUpdateWithoutReviewerAssignmentsInput>, UserUncheckedUpdateWithoutReviewerAssignmentsInput>
  }

  export type ReviewUpdateOneWithoutAssignmentNestedInput = {
    create?: XOR<ReviewCreateWithoutAssignmentInput, ReviewUncheckedCreateWithoutAssignmentInput>
    connectOrCreate?: ReviewCreateOrConnectWithoutAssignmentInput
    upsert?: ReviewUpsertWithoutAssignmentInput
    disconnect?: ReviewWhereInput | boolean
    delete?: ReviewWhereInput | boolean
    connect?: ReviewWhereUniqueInput
    update?: XOR<XOR<ReviewUpdateToOneWithWhereWithoutAssignmentInput, ReviewUpdateWithoutAssignmentInput>, ReviewUncheckedUpdateWithoutAssignmentInput>
  }

  export type ReviewUncheckedUpdateOneWithoutAssignmentNestedInput = {
    create?: XOR<ReviewCreateWithoutAssignmentInput, ReviewUncheckedCreateWithoutAssignmentInput>
    connectOrCreate?: ReviewCreateOrConnectWithoutAssignmentInput
    upsert?: ReviewUpsertWithoutAssignmentInput
    disconnect?: ReviewWhereInput | boolean
    delete?: ReviewWhereInput | boolean
    connect?: ReviewWhereUniqueInput
    update?: XOR<XOR<ReviewUpdateToOneWithWhereWithoutAssignmentInput, ReviewUpdateWithoutAssignmentInput>, ReviewUncheckedUpdateWithoutAssignmentInput>
  }

  export type PaperCreateNestedOneWithoutReviewsInput = {
    create?: XOR<PaperCreateWithoutReviewsInput, PaperUncheckedCreateWithoutReviewsInput>
    connectOrCreate?: PaperCreateOrConnectWithoutReviewsInput
    connect?: PaperWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutReviewsInput = {
    create?: XOR<UserCreateWithoutReviewsInput, UserUncheckedCreateWithoutReviewsInput>
    connectOrCreate?: UserCreateOrConnectWithoutReviewsInput
    connect?: UserWhereUniqueInput
  }

  export type ReviewerAssignmentCreateNestedOneWithoutReviewInput = {
    create?: XOR<ReviewerAssignmentCreateWithoutReviewInput, ReviewerAssignmentUncheckedCreateWithoutReviewInput>
    connectOrCreate?: ReviewerAssignmentCreateOrConnectWithoutReviewInput
    connect?: ReviewerAssignmentWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type PaperUpdateOneRequiredWithoutReviewsNestedInput = {
    create?: XOR<PaperCreateWithoutReviewsInput, PaperUncheckedCreateWithoutReviewsInput>
    connectOrCreate?: PaperCreateOrConnectWithoutReviewsInput
    upsert?: PaperUpsertWithoutReviewsInput
    connect?: PaperWhereUniqueInput
    update?: XOR<XOR<PaperUpdateToOneWithWhereWithoutReviewsInput, PaperUpdateWithoutReviewsInput>, PaperUncheckedUpdateWithoutReviewsInput>
  }

  export type UserUpdateOneRequiredWithoutReviewsNestedInput = {
    create?: XOR<UserCreateWithoutReviewsInput, UserUncheckedCreateWithoutReviewsInput>
    connectOrCreate?: UserCreateOrConnectWithoutReviewsInput
    upsert?: UserUpsertWithoutReviewsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutReviewsInput, UserUpdateWithoutReviewsInput>, UserUncheckedUpdateWithoutReviewsInput>
  }

  export type ReviewerAssignmentUpdateOneRequiredWithoutReviewNestedInput = {
    create?: XOR<ReviewerAssignmentCreateWithoutReviewInput, ReviewerAssignmentUncheckedCreateWithoutReviewInput>
    connectOrCreate?: ReviewerAssignmentCreateOrConnectWithoutReviewInput
    upsert?: ReviewerAssignmentUpsertWithoutReviewInput
    connect?: ReviewerAssignmentWhereUniqueInput
    update?: XOR<XOR<ReviewerAssignmentUpdateToOneWithWhereWithoutReviewInput, ReviewerAssignmentUpdateWithoutReviewInput>, ReviewerAssignmentUncheckedUpdateWithoutReviewInput>
  }

  export type PaperCreateNestedOneWithoutCommentsInput = {
    create?: XOR<PaperCreateWithoutCommentsInput, PaperUncheckedCreateWithoutCommentsInput>
    connectOrCreate?: PaperCreateOrConnectWithoutCommentsInput
    connect?: PaperWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutCommentsInput = {
    create?: XOR<UserCreateWithoutCommentsInput, UserUncheckedCreateWithoutCommentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCommentsInput
    connect?: UserWhereUniqueInput
  }

  export type CommentCreateNestedOneWithoutRepliesInput = {
    create?: XOR<CommentCreateWithoutRepliesInput, CommentUncheckedCreateWithoutRepliesInput>
    connectOrCreate?: CommentCreateOrConnectWithoutRepliesInput
    connect?: CommentWhereUniqueInput
  }

  export type CommentCreateNestedManyWithoutParentInput = {
    create?: XOR<CommentCreateWithoutParentInput, CommentUncheckedCreateWithoutParentInput> | CommentCreateWithoutParentInput[] | CommentUncheckedCreateWithoutParentInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutParentInput | CommentCreateOrConnectWithoutParentInput[]
    createMany?: CommentCreateManyParentInputEnvelope
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
  }

  export type CommentUncheckedCreateNestedManyWithoutParentInput = {
    create?: XOR<CommentCreateWithoutParentInput, CommentUncheckedCreateWithoutParentInput> | CommentCreateWithoutParentInput[] | CommentUncheckedCreateWithoutParentInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutParentInput | CommentCreateOrConnectWithoutParentInput[]
    createMany?: CommentCreateManyParentInputEnvelope
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
  }

  export type PaperUpdateOneRequiredWithoutCommentsNestedInput = {
    create?: XOR<PaperCreateWithoutCommentsInput, PaperUncheckedCreateWithoutCommentsInput>
    connectOrCreate?: PaperCreateOrConnectWithoutCommentsInput
    upsert?: PaperUpsertWithoutCommentsInput
    connect?: PaperWhereUniqueInput
    update?: XOR<XOR<PaperUpdateToOneWithWhereWithoutCommentsInput, PaperUpdateWithoutCommentsInput>, PaperUncheckedUpdateWithoutCommentsInput>
  }

  export type UserUpdateOneRequiredWithoutCommentsNestedInput = {
    create?: XOR<UserCreateWithoutCommentsInput, UserUncheckedCreateWithoutCommentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCommentsInput
    upsert?: UserUpsertWithoutCommentsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCommentsInput, UserUpdateWithoutCommentsInput>, UserUncheckedUpdateWithoutCommentsInput>
  }

  export type CommentUpdateOneWithoutRepliesNestedInput = {
    create?: XOR<CommentCreateWithoutRepliesInput, CommentUncheckedCreateWithoutRepliesInput>
    connectOrCreate?: CommentCreateOrConnectWithoutRepliesInput
    upsert?: CommentUpsertWithoutRepliesInput
    disconnect?: CommentWhereInput | boolean
    delete?: CommentWhereInput | boolean
    connect?: CommentWhereUniqueInput
    update?: XOR<XOR<CommentUpdateToOneWithWhereWithoutRepliesInput, CommentUpdateWithoutRepliesInput>, CommentUncheckedUpdateWithoutRepliesInput>
  }

  export type CommentUpdateManyWithoutParentNestedInput = {
    create?: XOR<CommentCreateWithoutParentInput, CommentUncheckedCreateWithoutParentInput> | CommentCreateWithoutParentInput[] | CommentUncheckedCreateWithoutParentInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutParentInput | CommentCreateOrConnectWithoutParentInput[]
    upsert?: CommentUpsertWithWhereUniqueWithoutParentInput | CommentUpsertWithWhereUniqueWithoutParentInput[]
    createMany?: CommentCreateManyParentInputEnvelope
    set?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    disconnect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    delete?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    update?: CommentUpdateWithWhereUniqueWithoutParentInput | CommentUpdateWithWhereUniqueWithoutParentInput[]
    updateMany?: CommentUpdateManyWithWhereWithoutParentInput | CommentUpdateManyWithWhereWithoutParentInput[]
    deleteMany?: CommentScalarWhereInput | CommentScalarWhereInput[]
  }

  export type CommentUncheckedUpdateManyWithoutParentNestedInput = {
    create?: XOR<CommentCreateWithoutParentInput, CommentUncheckedCreateWithoutParentInput> | CommentCreateWithoutParentInput[] | CommentUncheckedCreateWithoutParentInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutParentInput | CommentCreateOrConnectWithoutParentInput[]
    upsert?: CommentUpsertWithWhereUniqueWithoutParentInput | CommentUpsertWithWhereUniqueWithoutParentInput[]
    createMany?: CommentCreateManyParentInputEnvelope
    set?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    disconnect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    delete?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    update?: CommentUpdateWithWhereUniqueWithoutParentInput | CommentUpdateWithWhereUniqueWithoutParentInput[]
    updateMany?: CommentUpdateManyWithWhereWithoutParentInput | CommentUpdateManyWithWhereWithoutParentInput[]
    deleteMany?: CommentScalarWhereInput | CommentScalarWhereInput[]
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedEnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumPaperStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PaperStatus | EnumPaperStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaperStatus[] | ListEnumPaperStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaperStatus[] | ListEnumPaperStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPaperStatusFilter<$PrismaModel> | $Enums.PaperStatus
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumPaperStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaperStatus | EnumPaperStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaperStatus[] | ListEnumPaperStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaperStatus[] | ListEnumPaperStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPaperStatusWithAggregatesFilter<$PrismaModel> | $Enums.PaperStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaperStatusFilter<$PrismaModel>
    _max?: NestedEnumPaperStatusFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumAssignmentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AssignmentStatus | EnumAssignmentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AssignmentStatus[] | ListEnumAssignmentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AssignmentStatus[] | ListEnumAssignmentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAssignmentStatusFilter<$PrismaModel> | $Enums.AssignmentStatus
  }

  export type NestedEnumAssignmentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AssignmentStatus | EnumAssignmentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AssignmentStatus[] | ListEnumAssignmentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AssignmentStatus[] | ListEnumAssignmentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAssignmentStatusWithAggregatesFilter<$PrismaModel> | $Enums.AssignmentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAssignmentStatusFilter<$PrismaModel>
    _max?: NestedEnumAssignmentStatusFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type PaperCreateWithoutAuthorInput = {
    id?: string
    title: string
    abstract: string
    domain: string
    keywords?: PaperCreatekeywordsInput | string[]
    status?: $Enums.PaperStatus
    rejectionReason?: string | null
    aiSummary?: string | null
    embedding?: PaperCreateembeddingInput | number[]
    reviewAISuggestion?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    approvedAt?: Date | string | null
    assignments?: ReviewerAssignmentCreateNestedManyWithoutPaperInput
    reviews?: ReviewCreateNestedManyWithoutPaperInput
    comments?: CommentCreateNestedManyWithoutPaperInput
  }

  export type PaperUncheckedCreateWithoutAuthorInput = {
    id?: string
    title: string
    abstract: string
    domain: string
    keywords?: PaperCreatekeywordsInput | string[]
    status?: $Enums.PaperStatus
    rejectionReason?: string | null
    aiSummary?: string | null
    embedding?: PaperCreateembeddingInput | number[]
    reviewAISuggestion?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    approvedAt?: Date | string | null
    assignments?: ReviewerAssignmentUncheckedCreateNestedManyWithoutPaperInput
    reviews?: ReviewUncheckedCreateNestedManyWithoutPaperInput
    comments?: CommentUncheckedCreateNestedManyWithoutPaperInput
  }

  export type PaperCreateOrConnectWithoutAuthorInput = {
    where: PaperWhereUniqueInput
    create: XOR<PaperCreateWithoutAuthorInput, PaperUncheckedCreateWithoutAuthorInput>
  }

  export type PaperCreateManyAuthorInputEnvelope = {
    data: PaperCreateManyAuthorInput | PaperCreateManyAuthorInput[]
    skipDuplicates?: boolean
  }

  export type ReviewerAssignmentCreateWithoutReviewerInput = {
    id?: string
    status?: $Enums.AssignmentStatus
    assignedAt?: Date | string
    paper: PaperCreateNestedOneWithoutAssignmentsInput
    review?: ReviewCreateNestedOneWithoutAssignmentInput
  }

  export type ReviewerAssignmentUncheckedCreateWithoutReviewerInput = {
    id?: string
    status?: $Enums.AssignmentStatus
    assignedAt?: Date | string
    paperId: string
    review?: ReviewUncheckedCreateNestedOneWithoutAssignmentInput
  }

  export type ReviewerAssignmentCreateOrConnectWithoutReviewerInput = {
    where: ReviewerAssignmentWhereUniqueInput
    create: XOR<ReviewerAssignmentCreateWithoutReviewerInput, ReviewerAssignmentUncheckedCreateWithoutReviewerInput>
  }

  export type ReviewerAssignmentCreateManyReviewerInputEnvelope = {
    data: ReviewerAssignmentCreateManyReviewerInput | ReviewerAssignmentCreateManyReviewerInput[]
    skipDuplicates?: boolean
  }

  export type ReviewCreateWithoutReviewerInput = {
    id?: string
    strengths: string
    weaknesses: string
    score: number
    recommendation: string
    createdAt?: Date | string
    paper: PaperCreateNestedOneWithoutReviewsInput
    assignment: ReviewerAssignmentCreateNestedOneWithoutReviewInput
  }

  export type ReviewUncheckedCreateWithoutReviewerInput = {
    id?: string
    strengths: string
    weaknesses: string
    score: number
    recommendation: string
    createdAt?: Date | string
    paperId: string
    assignmentId: string
  }

  export type ReviewCreateOrConnectWithoutReviewerInput = {
    where: ReviewWhereUniqueInput
    create: XOR<ReviewCreateWithoutReviewerInput, ReviewUncheckedCreateWithoutReviewerInput>
  }

  export type ReviewCreateManyReviewerInputEnvelope = {
    data: ReviewCreateManyReviewerInput | ReviewCreateManyReviewerInput[]
    skipDuplicates?: boolean
  }

  export type CommentCreateWithoutAuthorInput = {
    id?: string
    body: string
    createdAt?: Date | string
    updatedAt?: Date | string
    paper: PaperCreateNestedOneWithoutCommentsInput
    parent?: CommentCreateNestedOneWithoutRepliesInput
    replies?: CommentCreateNestedManyWithoutParentInput
  }

  export type CommentUncheckedCreateWithoutAuthorInput = {
    id?: string
    body: string
    createdAt?: Date | string
    updatedAt?: Date | string
    paperId: string
    parentId?: string | null
    replies?: CommentUncheckedCreateNestedManyWithoutParentInput
  }

  export type CommentCreateOrConnectWithoutAuthorInput = {
    where: CommentWhereUniqueInput
    create: XOR<CommentCreateWithoutAuthorInput, CommentUncheckedCreateWithoutAuthorInput>
  }

  export type CommentCreateManyAuthorInputEnvelope = {
    data: CommentCreateManyAuthorInput | CommentCreateManyAuthorInput[]
    skipDuplicates?: boolean
  }

  export type PaperUpsertWithWhereUniqueWithoutAuthorInput = {
    where: PaperWhereUniqueInput
    update: XOR<PaperUpdateWithoutAuthorInput, PaperUncheckedUpdateWithoutAuthorInput>
    create: XOR<PaperCreateWithoutAuthorInput, PaperUncheckedCreateWithoutAuthorInput>
  }

  export type PaperUpdateWithWhereUniqueWithoutAuthorInput = {
    where: PaperWhereUniqueInput
    data: XOR<PaperUpdateWithoutAuthorInput, PaperUncheckedUpdateWithoutAuthorInput>
  }

  export type PaperUpdateManyWithWhereWithoutAuthorInput = {
    where: PaperScalarWhereInput
    data: XOR<PaperUpdateManyMutationInput, PaperUncheckedUpdateManyWithoutAuthorInput>
  }

  export type PaperScalarWhereInput = {
    AND?: PaperScalarWhereInput | PaperScalarWhereInput[]
    OR?: PaperScalarWhereInput[]
    NOT?: PaperScalarWhereInput | PaperScalarWhereInput[]
    id?: StringFilter<"Paper"> | string
    title?: StringFilter<"Paper"> | string
    abstract?: StringFilter<"Paper"> | string
    domain?: StringFilter<"Paper"> | string
    keywords?: StringNullableListFilter<"Paper">
    status?: EnumPaperStatusFilter<"Paper"> | $Enums.PaperStatus
    rejectionReason?: StringNullableFilter<"Paper"> | string | null
    aiSummary?: StringNullableFilter<"Paper"> | string | null
    embedding?: FloatNullableListFilter<"Paper">
    reviewAISuggestion?: StringNullableFilter<"Paper"> | string | null
    createdAt?: DateTimeFilter<"Paper"> | Date | string
    updatedAt?: DateTimeFilter<"Paper"> | Date | string
    approvedAt?: DateTimeNullableFilter<"Paper"> | Date | string | null
    submittedBy?: StringFilter<"Paper"> | string
  }

  export type ReviewerAssignmentUpsertWithWhereUniqueWithoutReviewerInput = {
    where: ReviewerAssignmentWhereUniqueInput
    update: XOR<ReviewerAssignmentUpdateWithoutReviewerInput, ReviewerAssignmentUncheckedUpdateWithoutReviewerInput>
    create: XOR<ReviewerAssignmentCreateWithoutReviewerInput, ReviewerAssignmentUncheckedCreateWithoutReviewerInput>
  }

  export type ReviewerAssignmentUpdateWithWhereUniqueWithoutReviewerInput = {
    where: ReviewerAssignmentWhereUniqueInput
    data: XOR<ReviewerAssignmentUpdateWithoutReviewerInput, ReviewerAssignmentUncheckedUpdateWithoutReviewerInput>
  }

  export type ReviewerAssignmentUpdateManyWithWhereWithoutReviewerInput = {
    where: ReviewerAssignmentScalarWhereInput
    data: XOR<ReviewerAssignmentUpdateManyMutationInput, ReviewerAssignmentUncheckedUpdateManyWithoutReviewerInput>
  }

  export type ReviewerAssignmentScalarWhereInput = {
    AND?: ReviewerAssignmentScalarWhereInput | ReviewerAssignmentScalarWhereInput[]
    OR?: ReviewerAssignmentScalarWhereInput[]
    NOT?: ReviewerAssignmentScalarWhereInput | ReviewerAssignmentScalarWhereInput[]
    id?: StringFilter<"ReviewerAssignment"> | string
    status?: EnumAssignmentStatusFilter<"ReviewerAssignment"> | $Enums.AssignmentStatus
    assignedAt?: DateTimeFilter<"ReviewerAssignment"> | Date | string
    paperId?: StringFilter<"ReviewerAssignment"> | string
    reviewerId?: StringFilter<"ReviewerAssignment"> | string
  }

  export type ReviewUpsertWithWhereUniqueWithoutReviewerInput = {
    where: ReviewWhereUniqueInput
    update: XOR<ReviewUpdateWithoutReviewerInput, ReviewUncheckedUpdateWithoutReviewerInput>
    create: XOR<ReviewCreateWithoutReviewerInput, ReviewUncheckedCreateWithoutReviewerInput>
  }

  export type ReviewUpdateWithWhereUniqueWithoutReviewerInput = {
    where: ReviewWhereUniqueInput
    data: XOR<ReviewUpdateWithoutReviewerInput, ReviewUncheckedUpdateWithoutReviewerInput>
  }

  export type ReviewUpdateManyWithWhereWithoutReviewerInput = {
    where: ReviewScalarWhereInput
    data: XOR<ReviewUpdateManyMutationInput, ReviewUncheckedUpdateManyWithoutReviewerInput>
  }

  export type ReviewScalarWhereInput = {
    AND?: ReviewScalarWhereInput | ReviewScalarWhereInput[]
    OR?: ReviewScalarWhereInput[]
    NOT?: ReviewScalarWhereInput | ReviewScalarWhereInput[]
    id?: StringFilter<"Review"> | string
    strengths?: StringFilter<"Review"> | string
    weaknesses?: StringFilter<"Review"> | string
    score?: IntFilter<"Review"> | number
    recommendation?: StringFilter<"Review"> | string
    createdAt?: DateTimeFilter<"Review"> | Date | string
    paperId?: StringFilter<"Review"> | string
    reviewerId?: StringFilter<"Review"> | string
    assignmentId?: StringFilter<"Review"> | string
  }

  export type CommentUpsertWithWhereUniqueWithoutAuthorInput = {
    where: CommentWhereUniqueInput
    update: XOR<CommentUpdateWithoutAuthorInput, CommentUncheckedUpdateWithoutAuthorInput>
    create: XOR<CommentCreateWithoutAuthorInput, CommentUncheckedCreateWithoutAuthorInput>
  }

  export type CommentUpdateWithWhereUniqueWithoutAuthorInput = {
    where: CommentWhereUniqueInput
    data: XOR<CommentUpdateWithoutAuthorInput, CommentUncheckedUpdateWithoutAuthorInput>
  }

  export type CommentUpdateManyWithWhereWithoutAuthorInput = {
    where: CommentScalarWhereInput
    data: XOR<CommentUpdateManyMutationInput, CommentUncheckedUpdateManyWithoutAuthorInput>
  }

  export type CommentScalarWhereInput = {
    AND?: CommentScalarWhereInput | CommentScalarWhereInput[]
    OR?: CommentScalarWhereInput[]
    NOT?: CommentScalarWhereInput | CommentScalarWhereInput[]
    id?: StringFilter<"Comment"> | string
    body?: StringFilter<"Comment"> | string
    createdAt?: DateTimeFilter<"Comment"> | Date | string
    updatedAt?: DateTimeFilter<"Comment"> | Date | string
    paperId?: StringFilter<"Comment"> | string
    authorId?: StringFilter<"Comment"> | string
    parentId?: StringNullableFilter<"Comment"> | string | null
  }

  export type UserCreateWithoutPapersInput = {
    id?: string
    name: string
    email: string
    password: string
    role?: $Enums.Role
    isBanned?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    reviewerAssignments?: ReviewerAssignmentCreateNestedManyWithoutReviewerInput
    reviews?: ReviewCreateNestedManyWithoutReviewerInput
    comments?: CommentCreateNestedManyWithoutAuthorInput
  }

  export type UserUncheckedCreateWithoutPapersInput = {
    id?: string
    name: string
    email: string
    password: string
    role?: $Enums.Role
    isBanned?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    reviewerAssignments?: ReviewerAssignmentUncheckedCreateNestedManyWithoutReviewerInput
    reviews?: ReviewUncheckedCreateNestedManyWithoutReviewerInput
    comments?: CommentUncheckedCreateNestedManyWithoutAuthorInput
  }

  export type UserCreateOrConnectWithoutPapersInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPapersInput, UserUncheckedCreateWithoutPapersInput>
  }

  export type ReviewerAssignmentCreateWithoutPaperInput = {
    id?: string
    status?: $Enums.AssignmentStatus
    assignedAt?: Date | string
    reviewer: UserCreateNestedOneWithoutReviewerAssignmentsInput
    review?: ReviewCreateNestedOneWithoutAssignmentInput
  }

  export type ReviewerAssignmentUncheckedCreateWithoutPaperInput = {
    id?: string
    status?: $Enums.AssignmentStatus
    assignedAt?: Date | string
    reviewerId: string
    review?: ReviewUncheckedCreateNestedOneWithoutAssignmentInput
  }

  export type ReviewerAssignmentCreateOrConnectWithoutPaperInput = {
    where: ReviewerAssignmentWhereUniqueInput
    create: XOR<ReviewerAssignmentCreateWithoutPaperInput, ReviewerAssignmentUncheckedCreateWithoutPaperInput>
  }

  export type ReviewerAssignmentCreateManyPaperInputEnvelope = {
    data: ReviewerAssignmentCreateManyPaperInput | ReviewerAssignmentCreateManyPaperInput[]
    skipDuplicates?: boolean
  }

  export type ReviewCreateWithoutPaperInput = {
    id?: string
    strengths: string
    weaknesses: string
    score: number
    recommendation: string
    createdAt?: Date | string
    reviewer: UserCreateNestedOneWithoutReviewsInput
    assignment: ReviewerAssignmentCreateNestedOneWithoutReviewInput
  }

  export type ReviewUncheckedCreateWithoutPaperInput = {
    id?: string
    strengths: string
    weaknesses: string
    score: number
    recommendation: string
    createdAt?: Date | string
    reviewerId: string
    assignmentId: string
  }

  export type ReviewCreateOrConnectWithoutPaperInput = {
    where: ReviewWhereUniqueInput
    create: XOR<ReviewCreateWithoutPaperInput, ReviewUncheckedCreateWithoutPaperInput>
  }

  export type ReviewCreateManyPaperInputEnvelope = {
    data: ReviewCreateManyPaperInput | ReviewCreateManyPaperInput[]
    skipDuplicates?: boolean
  }

  export type CommentCreateWithoutPaperInput = {
    id?: string
    body: string
    createdAt?: Date | string
    updatedAt?: Date | string
    author: UserCreateNestedOneWithoutCommentsInput
    parent?: CommentCreateNestedOneWithoutRepliesInput
    replies?: CommentCreateNestedManyWithoutParentInput
  }

  export type CommentUncheckedCreateWithoutPaperInput = {
    id?: string
    body: string
    createdAt?: Date | string
    updatedAt?: Date | string
    authorId: string
    parentId?: string | null
    replies?: CommentUncheckedCreateNestedManyWithoutParentInput
  }

  export type CommentCreateOrConnectWithoutPaperInput = {
    where: CommentWhereUniqueInput
    create: XOR<CommentCreateWithoutPaperInput, CommentUncheckedCreateWithoutPaperInput>
  }

  export type CommentCreateManyPaperInputEnvelope = {
    data: CommentCreateManyPaperInput | CommentCreateManyPaperInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutPapersInput = {
    update: XOR<UserUpdateWithoutPapersInput, UserUncheckedUpdateWithoutPapersInput>
    create: XOR<UserCreateWithoutPapersInput, UserUncheckedCreateWithoutPapersInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPapersInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPapersInput, UserUncheckedUpdateWithoutPapersInput>
  }

  export type UserUpdateWithoutPapersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isBanned?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewerAssignments?: ReviewerAssignmentUpdateManyWithoutReviewerNestedInput
    reviews?: ReviewUpdateManyWithoutReviewerNestedInput
    comments?: CommentUpdateManyWithoutAuthorNestedInput
  }

  export type UserUncheckedUpdateWithoutPapersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isBanned?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewerAssignments?: ReviewerAssignmentUncheckedUpdateManyWithoutReviewerNestedInput
    reviews?: ReviewUncheckedUpdateManyWithoutReviewerNestedInput
    comments?: CommentUncheckedUpdateManyWithoutAuthorNestedInput
  }

  export type ReviewerAssignmentUpsertWithWhereUniqueWithoutPaperInput = {
    where: ReviewerAssignmentWhereUniqueInput
    update: XOR<ReviewerAssignmentUpdateWithoutPaperInput, ReviewerAssignmentUncheckedUpdateWithoutPaperInput>
    create: XOR<ReviewerAssignmentCreateWithoutPaperInput, ReviewerAssignmentUncheckedCreateWithoutPaperInput>
  }

  export type ReviewerAssignmentUpdateWithWhereUniqueWithoutPaperInput = {
    where: ReviewerAssignmentWhereUniqueInput
    data: XOR<ReviewerAssignmentUpdateWithoutPaperInput, ReviewerAssignmentUncheckedUpdateWithoutPaperInput>
  }

  export type ReviewerAssignmentUpdateManyWithWhereWithoutPaperInput = {
    where: ReviewerAssignmentScalarWhereInput
    data: XOR<ReviewerAssignmentUpdateManyMutationInput, ReviewerAssignmentUncheckedUpdateManyWithoutPaperInput>
  }

  export type ReviewUpsertWithWhereUniqueWithoutPaperInput = {
    where: ReviewWhereUniqueInput
    update: XOR<ReviewUpdateWithoutPaperInput, ReviewUncheckedUpdateWithoutPaperInput>
    create: XOR<ReviewCreateWithoutPaperInput, ReviewUncheckedCreateWithoutPaperInput>
  }

  export type ReviewUpdateWithWhereUniqueWithoutPaperInput = {
    where: ReviewWhereUniqueInput
    data: XOR<ReviewUpdateWithoutPaperInput, ReviewUncheckedUpdateWithoutPaperInput>
  }

  export type ReviewUpdateManyWithWhereWithoutPaperInput = {
    where: ReviewScalarWhereInput
    data: XOR<ReviewUpdateManyMutationInput, ReviewUncheckedUpdateManyWithoutPaperInput>
  }

  export type CommentUpsertWithWhereUniqueWithoutPaperInput = {
    where: CommentWhereUniqueInput
    update: XOR<CommentUpdateWithoutPaperInput, CommentUncheckedUpdateWithoutPaperInput>
    create: XOR<CommentCreateWithoutPaperInput, CommentUncheckedCreateWithoutPaperInput>
  }

  export type CommentUpdateWithWhereUniqueWithoutPaperInput = {
    where: CommentWhereUniqueInput
    data: XOR<CommentUpdateWithoutPaperInput, CommentUncheckedUpdateWithoutPaperInput>
  }

  export type CommentUpdateManyWithWhereWithoutPaperInput = {
    where: CommentScalarWhereInput
    data: XOR<CommentUpdateManyMutationInput, CommentUncheckedUpdateManyWithoutPaperInput>
  }

  export type PaperCreateWithoutAssignmentsInput = {
    id?: string
    title: string
    abstract: string
    domain: string
    keywords?: PaperCreatekeywordsInput | string[]
    status?: $Enums.PaperStatus
    rejectionReason?: string | null
    aiSummary?: string | null
    embedding?: PaperCreateembeddingInput | number[]
    reviewAISuggestion?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    approvedAt?: Date | string | null
    author: UserCreateNestedOneWithoutPapersInput
    reviews?: ReviewCreateNestedManyWithoutPaperInput
    comments?: CommentCreateNestedManyWithoutPaperInput
  }

  export type PaperUncheckedCreateWithoutAssignmentsInput = {
    id?: string
    title: string
    abstract: string
    domain: string
    keywords?: PaperCreatekeywordsInput | string[]
    status?: $Enums.PaperStatus
    rejectionReason?: string | null
    aiSummary?: string | null
    embedding?: PaperCreateembeddingInput | number[]
    reviewAISuggestion?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    approvedAt?: Date | string | null
    submittedBy: string
    reviews?: ReviewUncheckedCreateNestedManyWithoutPaperInput
    comments?: CommentUncheckedCreateNestedManyWithoutPaperInput
  }

  export type PaperCreateOrConnectWithoutAssignmentsInput = {
    where: PaperWhereUniqueInput
    create: XOR<PaperCreateWithoutAssignmentsInput, PaperUncheckedCreateWithoutAssignmentsInput>
  }

  export type UserCreateWithoutReviewerAssignmentsInput = {
    id?: string
    name: string
    email: string
    password: string
    role?: $Enums.Role
    isBanned?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    papers?: PaperCreateNestedManyWithoutAuthorInput
    reviews?: ReviewCreateNestedManyWithoutReviewerInput
    comments?: CommentCreateNestedManyWithoutAuthorInput
  }

  export type UserUncheckedCreateWithoutReviewerAssignmentsInput = {
    id?: string
    name: string
    email: string
    password: string
    role?: $Enums.Role
    isBanned?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    papers?: PaperUncheckedCreateNestedManyWithoutAuthorInput
    reviews?: ReviewUncheckedCreateNestedManyWithoutReviewerInput
    comments?: CommentUncheckedCreateNestedManyWithoutAuthorInput
  }

  export type UserCreateOrConnectWithoutReviewerAssignmentsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutReviewerAssignmentsInput, UserUncheckedCreateWithoutReviewerAssignmentsInput>
  }

  export type ReviewCreateWithoutAssignmentInput = {
    id?: string
    strengths: string
    weaknesses: string
    score: number
    recommendation: string
    createdAt?: Date | string
    paper: PaperCreateNestedOneWithoutReviewsInput
    reviewer: UserCreateNestedOneWithoutReviewsInput
  }

  export type ReviewUncheckedCreateWithoutAssignmentInput = {
    id?: string
    strengths: string
    weaknesses: string
    score: number
    recommendation: string
    createdAt?: Date | string
    paperId: string
    reviewerId: string
  }

  export type ReviewCreateOrConnectWithoutAssignmentInput = {
    where: ReviewWhereUniqueInput
    create: XOR<ReviewCreateWithoutAssignmentInput, ReviewUncheckedCreateWithoutAssignmentInput>
  }

  export type PaperUpsertWithoutAssignmentsInput = {
    update: XOR<PaperUpdateWithoutAssignmentsInput, PaperUncheckedUpdateWithoutAssignmentsInput>
    create: XOR<PaperCreateWithoutAssignmentsInput, PaperUncheckedCreateWithoutAssignmentsInput>
    where?: PaperWhereInput
  }

  export type PaperUpdateToOneWithWhereWithoutAssignmentsInput = {
    where?: PaperWhereInput
    data: XOR<PaperUpdateWithoutAssignmentsInput, PaperUncheckedUpdateWithoutAssignmentsInput>
  }

  export type PaperUpdateWithoutAssignmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    abstract?: StringFieldUpdateOperationsInput | string
    domain?: StringFieldUpdateOperationsInput | string
    keywords?: PaperUpdatekeywordsInput | string[]
    status?: EnumPaperStatusFieldUpdateOperationsInput | $Enums.PaperStatus
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    aiSummary?: NullableStringFieldUpdateOperationsInput | string | null
    embedding?: PaperUpdateembeddingInput | number[]
    reviewAISuggestion?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    author?: UserUpdateOneRequiredWithoutPapersNestedInput
    reviews?: ReviewUpdateManyWithoutPaperNestedInput
    comments?: CommentUpdateManyWithoutPaperNestedInput
  }

  export type PaperUncheckedUpdateWithoutAssignmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    abstract?: StringFieldUpdateOperationsInput | string
    domain?: StringFieldUpdateOperationsInput | string
    keywords?: PaperUpdatekeywordsInput | string[]
    status?: EnumPaperStatusFieldUpdateOperationsInput | $Enums.PaperStatus
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    aiSummary?: NullableStringFieldUpdateOperationsInput | string | null
    embedding?: PaperUpdateembeddingInput | number[]
    reviewAISuggestion?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    submittedBy?: StringFieldUpdateOperationsInput | string
    reviews?: ReviewUncheckedUpdateManyWithoutPaperNestedInput
    comments?: CommentUncheckedUpdateManyWithoutPaperNestedInput
  }

  export type UserUpsertWithoutReviewerAssignmentsInput = {
    update: XOR<UserUpdateWithoutReviewerAssignmentsInput, UserUncheckedUpdateWithoutReviewerAssignmentsInput>
    create: XOR<UserCreateWithoutReviewerAssignmentsInput, UserUncheckedCreateWithoutReviewerAssignmentsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutReviewerAssignmentsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutReviewerAssignmentsInput, UserUncheckedUpdateWithoutReviewerAssignmentsInput>
  }

  export type UserUpdateWithoutReviewerAssignmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isBanned?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    papers?: PaperUpdateManyWithoutAuthorNestedInput
    reviews?: ReviewUpdateManyWithoutReviewerNestedInput
    comments?: CommentUpdateManyWithoutAuthorNestedInput
  }

  export type UserUncheckedUpdateWithoutReviewerAssignmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isBanned?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    papers?: PaperUncheckedUpdateManyWithoutAuthorNestedInput
    reviews?: ReviewUncheckedUpdateManyWithoutReviewerNestedInput
    comments?: CommentUncheckedUpdateManyWithoutAuthorNestedInput
  }

  export type ReviewUpsertWithoutAssignmentInput = {
    update: XOR<ReviewUpdateWithoutAssignmentInput, ReviewUncheckedUpdateWithoutAssignmentInput>
    create: XOR<ReviewCreateWithoutAssignmentInput, ReviewUncheckedCreateWithoutAssignmentInput>
    where?: ReviewWhereInput
  }

  export type ReviewUpdateToOneWithWhereWithoutAssignmentInput = {
    where?: ReviewWhereInput
    data: XOR<ReviewUpdateWithoutAssignmentInput, ReviewUncheckedUpdateWithoutAssignmentInput>
  }

  export type ReviewUpdateWithoutAssignmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    strengths?: StringFieldUpdateOperationsInput | string
    weaknesses?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    recommendation?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paper?: PaperUpdateOneRequiredWithoutReviewsNestedInput
    reviewer?: UserUpdateOneRequiredWithoutReviewsNestedInput
  }

  export type ReviewUncheckedUpdateWithoutAssignmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    strengths?: StringFieldUpdateOperationsInput | string
    weaknesses?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    recommendation?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paperId?: StringFieldUpdateOperationsInput | string
    reviewerId?: StringFieldUpdateOperationsInput | string
  }

  export type PaperCreateWithoutReviewsInput = {
    id?: string
    title: string
    abstract: string
    domain: string
    keywords?: PaperCreatekeywordsInput | string[]
    status?: $Enums.PaperStatus
    rejectionReason?: string | null
    aiSummary?: string | null
    embedding?: PaperCreateembeddingInput | number[]
    reviewAISuggestion?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    approvedAt?: Date | string | null
    author: UserCreateNestedOneWithoutPapersInput
    assignments?: ReviewerAssignmentCreateNestedManyWithoutPaperInput
    comments?: CommentCreateNestedManyWithoutPaperInput
  }

  export type PaperUncheckedCreateWithoutReviewsInput = {
    id?: string
    title: string
    abstract: string
    domain: string
    keywords?: PaperCreatekeywordsInput | string[]
    status?: $Enums.PaperStatus
    rejectionReason?: string | null
    aiSummary?: string | null
    embedding?: PaperCreateembeddingInput | number[]
    reviewAISuggestion?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    approvedAt?: Date | string | null
    submittedBy: string
    assignments?: ReviewerAssignmentUncheckedCreateNestedManyWithoutPaperInput
    comments?: CommentUncheckedCreateNestedManyWithoutPaperInput
  }

  export type PaperCreateOrConnectWithoutReviewsInput = {
    where: PaperWhereUniqueInput
    create: XOR<PaperCreateWithoutReviewsInput, PaperUncheckedCreateWithoutReviewsInput>
  }

  export type UserCreateWithoutReviewsInput = {
    id?: string
    name: string
    email: string
    password: string
    role?: $Enums.Role
    isBanned?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    papers?: PaperCreateNestedManyWithoutAuthorInput
    reviewerAssignments?: ReviewerAssignmentCreateNestedManyWithoutReviewerInput
    comments?: CommentCreateNestedManyWithoutAuthorInput
  }

  export type UserUncheckedCreateWithoutReviewsInput = {
    id?: string
    name: string
    email: string
    password: string
    role?: $Enums.Role
    isBanned?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    papers?: PaperUncheckedCreateNestedManyWithoutAuthorInput
    reviewerAssignments?: ReviewerAssignmentUncheckedCreateNestedManyWithoutReviewerInput
    comments?: CommentUncheckedCreateNestedManyWithoutAuthorInput
  }

  export type UserCreateOrConnectWithoutReviewsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutReviewsInput, UserUncheckedCreateWithoutReviewsInput>
  }

  export type ReviewerAssignmentCreateWithoutReviewInput = {
    id?: string
    status?: $Enums.AssignmentStatus
    assignedAt?: Date | string
    paper: PaperCreateNestedOneWithoutAssignmentsInput
    reviewer: UserCreateNestedOneWithoutReviewerAssignmentsInput
  }

  export type ReviewerAssignmentUncheckedCreateWithoutReviewInput = {
    id?: string
    status?: $Enums.AssignmentStatus
    assignedAt?: Date | string
    paperId: string
    reviewerId: string
  }

  export type ReviewerAssignmentCreateOrConnectWithoutReviewInput = {
    where: ReviewerAssignmentWhereUniqueInput
    create: XOR<ReviewerAssignmentCreateWithoutReviewInput, ReviewerAssignmentUncheckedCreateWithoutReviewInput>
  }

  export type PaperUpsertWithoutReviewsInput = {
    update: XOR<PaperUpdateWithoutReviewsInput, PaperUncheckedUpdateWithoutReviewsInput>
    create: XOR<PaperCreateWithoutReviewsInput, PaperUncheckedCreateWithoutReviewsInput>
    where?: PaperWhereInput
  }

  export type PaperUpdateToOneWithWhereWithoutReviewsInput = {
    where?: PaperWhereInput
    data: XOR<PaperUpdateWithoutReviewsInput, PaperUncheckedUpdateWithoutReviewsInput>
  }

  export type PaperUpdateWithoutReviewsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    abstract?: StringFieldUpdateOperationsInput | string
    domain?: StringFieldUpdateOperationsInput | string
    keywords?: PaperUpdatekeywordsInput | string[]
    status?: EnumPaperStatusFieldUpdateOperationsInput | $Enums.PaperStatus
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    aiSummary?: NullableStringFieldUpdateOperationsInput | string | null
    embedding?: PaperUpdateembeddingInput | number[]
    reviewAISuggestion?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    author?: UserUpdateOneRequiredWithoutPapersNestedInput
    assignments?: ReviewerAssignmentUpdateManyWithoutPaperNestedInput
    comments?: CommentUpdateManyWithoutPaperNestedInput
  }

  export type PaperUncheckedUpdateWithoutReviewsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    abstract?: StringFieldUpdateOperationsInput | string
    domain?: StringFieldUpdateOperationsInput | string
    keywords?: PaperUpdatekeywordsInput | string[]
    status?: EnumPaperStatusFieldUpdateOperationsInput | $Enums.PaperStatus
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    aiSummary?: NullableStringFieldUpdateOperationsInput | string | null
    embedding?: PaperUpdateembeddingInput | number[]
    reviewAISuggestion?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    submittedBy?: StringFieldUpdateOperationsInput | string
    assignments?: ReviewerAssignmentUncheckedUpdateManyWithoutPaperNestedInput
    comments?: CommentUncheckedUpdateManyWithoutPaperNestedInput
  }

  export type UserUpsertWithoutReviewsInput = {
    update: XOR<UserUpdateWithoutReviewsInput, UserUncheckedUpdateWithoutReviewsInput>
    create: XOR<UserCreateWithoutReviewsInput, UserUncheckedCreateWithoutReviewsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutReviewsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutReviewsInput, UserUncheckedUpdateWithoutReviewsInput>
  }

  export type UserUpdateWithoutReviewsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isBanned?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    papers?: PaperUpdateManyWithoutAuthorNestedInput
    reviewerAssignments?: ReviewerAssignmentUpdateManyWithoutReviewerNestedInput
    comments?: CommentUpdateManyWithoutAuthorNestedInput
  }

  export type UserUncheckedUpdateWithoutReviewsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isBanned?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    papers?: PaperUncheckedUpdateManyWithoutAuthorNestedInput
    reviewerAssignments?: ReviewerAssignmentUncheckedUpdateManyWithoutReviewerNestedInput
    comments?: CommentUncheckedUpdateManyWithoutAuthorNestedInput
  }

  export type ReviewerAssignmentUpsertWithoutReviewInput = {
    update: XOR<ReviewerAssignmentUpdateWithoutReviewInput, ReviewerAssignmentUncheckedUpdateWithoutReviewInput>
    create: XOR<ReviewerAssignmentCreateWithoutReviewInput, ReviewerAssignmentUncheckedCreateWithoutReviewInput>
    where?: ReviewerAssignmentWhereInput
  }

  export type ReviewerAssignmentUpdateToOneWithWhereWithoutReviewInput = {
    where?: ReviewerAssignmentWhereInput
    data: XOR<ReviewerAssignmentUpdateWithoutReviewInput, ReviewerAssignmentUncheckedUpdateWithoutReviewInput>
  }

  export type ReviewerAssignmentUpdateWithoutReviewInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumAssignmentStatusFieldUpdateOperationsInput | $Enums.AssignmentStatus
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paper?: PaperUpdateOneRequiredWithoutAssignmentsNestedInput
    reviewer?: UserUpdateOneRequiredWithoutReviewerAssignmentsNestedInput
  }

  export type ReviewerAssignmentUncheckedUpdateWithoutReviewInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumAssignmentStatusFieldUpdateOperationsInput | $Enums.AssignmentStatus
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paperId?: StringFieldUpdateOperationsInput | string
    reviewerId?: StringFieldUpdateOperationsInput | string
  }

  export type PaperCreateWithoutCommentsInput = {
    id?: string
    title: string
    abstract: string
    domain: string
    keywords?: PaperCreatekeywordsInput | string[]
    status?: $Enums.PaperStatus
    rejectionReason?: string | null
    aiSummary?: string | null
    embedding?: PaperCreateembeddingInput | number[]
    reviewAISuggestion?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    approvedAt?: Date | string | null
    author: UserCreateNestedOneWithoutPapersInput
    assignments?: ReviewerAssignmentCreateNestedManyWithoutPaperInput
    reviews?: ReviewCreateNestedManyWithoutPaperInput
  }

  export type PaperUncheckedCreateWithoutCommentsInput = {
    id?: string
    title: string
    abstract: string
    domain: string
    keywords?: PaperCreatekeywordsInput | string[]
    status?: $Enums.PaperStatus
    rejectionReason?: string | null
    aiSummary?: string | null
    embedding?: PaperCreateembeddingInput | number[]
    reviewAISuggestion?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    approvedAt?: Date | string | null
    submittedBy: string
    assignments?: ReviewerAssignmentUncheckedCreateNestedManyWithoutPaperInput
    reviews?: ReviewUncheckedCreateNestedManyWithoutPaperInput
  }

  export type PaperCreateOrConnectWithoutCommentsInput = {
    where: PaperWhereUniqueInput
    create: XOR<PaperCreateWithoutCommentsInput, PaperUncheckedCreateWithoutCommentsInput>
  }

  export type UserCreateWithoutCommentsInput = {
    id?: string
    name: string
    email: string
    password: string
    role?: $Enums.Role
    isBanned?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    papers?: PaperCreateNestedManyWithoutAuthorInput
    reviewerAssignments?: ReviewerAssignmentCreateNestedManyWithoutReviewerInput
    reviews?: ReviewCreateNestedManyWithoutReviewerInput
  }

  export type UserUncheckedCreateWithoutCommentsInput = {
    id?: string
    name: string
    email: string
    password: string
    role?: $Enums.Role
    isBanned?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    papers?: PaperUncheckedCreateNestedManyWithoutAuthorInput
    reviewerAssignments?: ReviewerAssignmentUncheckedCreateNestedManyWithoutReviewerInput
    reviews?: ReviewUncheckedCreateNestedManyWithoutReviewerInput
  }

  export type UserCreateOrConnectWithoutCommentsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCommentsInput, UserUncheckedCreateWithoutCommentsInput>
  }

  export type CommentCreateWithoutRepliesInput = {
    id?: string
    body: string
    createdAt?: Date | string
    updatedAt?: Date | string
    paper: PaperCreateNestedOneWithoutCommentsInput
    author: UserCreateNestedOneWithoutCommentsInput
    parent?: CommentCreateNestedOneWithoutRepliesInput
  }

  export type CommentUncheckedCreateWithoutRepliesInput = {
    id?: string
    body: string
    createdAt?: Date | string
    updatedAt?: Date | string
    paperId: string
    authorId: string
    parentId?: string | null
  }

  export type CommentCreateOrConnectWithoutRepliesInput = {
    where: CommentWhereUniqueInput
    create: XOR<CommentCreateWithoutRepliesInput, CommentUncheckedCreateWithoutRepliesInput>
  }

  export type CommentCreateWithoutParentInput = {
    id?: string
    body: string
    createdAt?: Date | string
    updatedAt?: Date | string
    paper: PaperCreateNestedOneWithoutCommentsInput
    author: UserCreateNestedOneWithoutCommentsInput
    replies?: CommentCreateNestedManyWithoutParentInput
  }

  export type CommentUncheckedCreateWithoutParentInput = {
    id?: string
    body: string
    createdAt?: Date | string
    updatedAt?: Date | string
    paperId: string
    authorId: string
    replies?: CommentUncheckedCreateNestedManyWithoutParentInput
  }

  export type CommentCreateOrConnectWithoutParentInput = {
    where: CommentWhereUniqueInput
    create: XOR<CommentCreateWithoutParentInput, CommentUncheckedCreateWithoutParentInput>
  }

  export type CommentCreateManyParentInputEnvelope = {
    data: CommentCreateManyParentInput | CommentCreateManyParentInput[]
    skipDuplicates?: boolean
  }

  export type PaperUpsertWithoutCommentsInput = {
    update: XOR<PaperUpdateWithoutCommentsInput, PaperUncheckedUpdateWithoutCommentsInput>
    create: XOR<PaperCreateWithoutCommentsInput, PaperUncheckedCreateWithoutCommentsInput>
    where?: PaperWhereInput
  }

  export type PaperUpdateToOneWithWhereWithoutCommentsInput = {
    where?: PaperWhereInput
    data: XOR<PaperUpdateWithoutCommentsInput, PaperUncheckedUpdateWithoutCommentsInput>
  }

  export type PaperUpdateWithoutCommentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    abstract?: StringFieldUpdateOperationsInput | string
    domain?: StringFieldUpdateOperationsInput | string
    keywords?: PaperUpdatekeywordsInput | string[]
    status?: EnumPaperStatusFieldUpdateOperationsInput | $Enums.PaperStatus
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    aiSummary?: NullableStringFieldUpdateOperationsInput | string | null
    embedding?: PaperUpdateembeddingInput | number[]
    reviewAISuggestion?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    author?: UserUpdateOneRequiredWithoutPapersNestedInput
    assignments?: ReviewerAssignmentUpdateManyWithoutPaperNestedInput
    reviews?: ReviewUpdateManyWithoutPaperNestedInput
  }

  export type PaperUncheckedUpdateWithoutCommentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    abstract?: StringFieldUpdateOperationsInput | string
    domain?: StringFieldUpdateOperationsInput | string
    keywords?: PaperUpdatekeywordsInput | string[]
    status?: EnumPaperStatusFieldUpdateOperationsInput | $Enums.PaperStatus
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    aiSummary?: NullableStringFieldUpdateOperationsInput | string | null
    embedding?: PaperUpdateembeddingInput | number[]
    reviewAISuggestion?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    submittedBy?: StringFieldUpdateOperationsInput | string
    assignments?: ReviewerAssignmentUncheckedUpdateManyWithoutPaperNestedInput
    reviews?: ReviewUncheckedUpdateManyWithoutPaperNestedInput
  }

  export type UserUpsertWithoutCommentsInput = {
    update: XOR<UserUpdateWithoutCommentsInput, UserUncheckedUpdateWithoutCommentsInput>
    create: XOR<UserCreateWithoutCommentsInput, UserUncheckedCreateWithoutCommentsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCommentsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCommentsInput, UserUncheckedUpdateWithoutCommentsInput>
  }

  export type UserUpdateWithoutCommentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isBanned?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    papers?: PaperUpdateManyWithoutAuthorNestedInput
    reviewerAssignments?: ReviewerAssignmentUpdateManyWithoutReviewerNestedInput
    reviews?: ReviewUpdateManyWithoutReviewerNestedInput
  }

  export type UserUncheckedUpdateWithoutCommentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isBanned?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    papers?: PaperUncheckedUpdateManyWithoutAuthorNestedInput
    reviewerAssignments?: ReviewerAssignmentUncheckedUpdateManyWithoutReviewerNestedInput
    reviews?: ReviewUncheckedUpdateManyWithoutReviewerNestedInput
  }

  export type CommentUpsertWithoutRepliesInput = {
    update: XOR<CommentUpdateWithoutRepliesInput, CommentUncheckedUpdateWithoutRepliesInput>
    create: XOR<CommentCreateWithoutRepliesInput, CommentUncheckedCreateWithoutRepliesInput>
    where?: CommentWhereInput
  }

  export type CommentUpdateToOneWithWhereWithoutRepliesInput = {
    where?: CommentWhereInput
    data: XOR<CommentUpdateWithoutRepliesInput, CommentUncheckedUpdateWithoutRepliesInput>
  }

  export type CommentUpdateWithoutRepliesInput = {
    id?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paper?: PaperUpdateOneRequiredWithoutCommentsNestedInput
    author?: UserUpdateOneRequiredWithoutCommentsNestedInput
    parent?: CommentUpdateOneWithoutRepliesNestedInput
  }

  export type CommentUncheckedUpdateWithoutRepliesInput = {
    id?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paperId?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CommentUpsertWithWhereUniqueWithoutParentInput = {
    where: CommentWhereUniqueInput
    update: XOR<CommentUpdateWithoutParentInput, CommentUncheckedUpdateWithoutParentInput>
    create: XOR<CommentCreateWithoutParentInput, CommentUncheckedCreateWithoutParentInput>
  }

  export type CommentUpdateWithWhereUniqueWithoutParentInput = {
    where: CommentWhereUniqueInput
    data: XOR<CommentUpdateWithoutParentInput, CommentUncheckedUpdateWithoutParentInput>
  }

  export type CommentUpdateManyWithWhereWithoutParentInput = {
    where: CommentScalarWhereInput
    data: XOR<CommentUpdateManyMutationInput, CommentUncheckedUpdateManyWithoutParentInput>
  }

  export type PaperCreateManyAuthorInput = {
    id?: string
    title: string
    abstract: string
    domain: string
    keywords?: PaperCreatekeywordsInput | string[]
    status?: $Enums.PaperStatus
    rejectionReason?: string | null
    aiSummary?: string | null
    embedding?: PaperCreateembeddingInput | number[]
    reviewAISuggestion?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    approvedAt?: Date | string | null
  }

  export type ReviewerAssignmentCreateManyReviewerInput = {
    id?: string
    status?: $Enums.AssignmentStatus
    assignedAt?: Date | string
    paperId: string
  }

  export type ReviewCreateManyReviewerInput = {
    id?: string
    strengths: string
    weaknesses: string
    score: number
    recommendation: string
    createdAt?: Date | string
    paperId: string
    assignmentId: string
  }

  export type CommentCreateManyAuthorInput = {
    id?: string
    body: string
    createdAt?: Date | string
    updatedAt?: Date | string
    paperId: string
    parentId?: string | null
  }

  export type PaperUpdateWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    abstract?: StringFieldUpdateOperationsInput | string
    domain?: StringFieldUpdateOperationsInput | string
    keywords?: PaperUpdatekeywordsInput | string[]
    status?: EnumPaperStatusFieldUpdateOperationsInput | $Enums.PaperStatus
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    aiSummary?: NullableStringFieldUpdateOperationsInput | string | null
    embedding?: PaperUpdateembeddingInput | number[]
    reviewAISuggestion?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    assignments?: ReviewerAssignmentUpdateManyWithoutPaperNestedInput
    reviews?: ReviewUpdateManyWithoutPaperNestedInput
    comments?: CommentUpdateManyWithoutPaperNestedInput
  }

  export type PaperUncheckedUpdateWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    abstract?: StringFieldUpdateOperationsInput | string
    domain?: StringFieldUpdateOperationsInput | string
    keywords?: PaperUpdatekeywordsInput | string[]
    status?: EnumPaperStatusFieldUpdateOperationsInput | $Enums.PaperStatus
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    aiSummary?: NullableStringFieldUpdateOperationsInput | string | null
    embedding?: PaperUpdateembeddingInput | number[]
    reviewAISuggestion?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    assignments?: ReviewerAssignmentUncheckedUpdateManyWithoutPaperNestedInput
    reviews?: ReviewUncheckedUpdateManyWithoutPaperNestedInput
    comments?: CommentUncheckedUpdateManyWithoutPaperNestedInput
  }

  export type PaperUncheckedUpdateManyWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    abstract?: StringFieldUpdateOperationsInput | string
    domain?: StringFieldUpdateOperationsInput | string
    keywords?: PaperUpdatekeywordsInput | string[]
    status?: EnumPaperStatusFieldUpdateOperationsInput | $Enums.PaperStatus
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    aiSummary?: NullableStringFieldUpdateOperationsInput | string | null
    embedding?: PaperUpdateembeddingInput | number[]
    reviewAISuggestion?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ReviewerAssignmentUpdateWithoutReviewerInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumAssignmentStatusFieldUpdateOperationsInput | $Enums.AssignmentStatus
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paper?: PaperUpdateOneRequiredWithoutAssignmentsNestedInput
    review?: ReviewUpdateOneWithoutAssignmentNestedInput
  }

  export type ReviewerAssignmentUncheckedUpdateWithoutReviewerInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumAssignmentStatusFieldUpdateOperationsInput | $Enums.AssignmentStatus
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paperId?: StringFieldUpdateOperationsInput | string
    review?: ReviewUncheckedUpdateOneWithoutAssignmentNestedInput
  }

  export type ReviewerAssignmentUncheckedUpdateManyWithoutReviewerInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumAssignmentStatusFieldUpdateOperationsInput | $Enums.AssignmentStatus
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paperId?: StringFieldUpdateOperationsInput | string
  }

  export type ReviewUpdateWithoutReviewerInput = {
    id?: StringFieldUpdateOperationsInput | string
    strengths?: StringFieldUpdateOperationsInput | string
    weaknesses?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    recommendation?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paper?: PaperUpdateOneRequiredWithoutReviewsNestedInput
    assignment?: ReviewerAssignmentUpdateOneRequiredWithoutReviewNestedInput
  }

  export type ReviewUncheckedUpdateWithoutReviewerInput = {
    id?: StringFieldUpdateOperationsInput | string
    strengths?: StringFieldUpdateOperationsInput | string
    weaknesses?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    recommendation?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paperId?: StringFieldUpdateOperationsInput | string
    assignmentId?: StringFieldUpdateOperationsInput | string
  }

  export type ReviewUncheckedUpdateManyWithoutReviewerInput = {
    id?: StringFieldUpdateOperationsInput | string
    strengths?: StringFieldUpdateOperationsInput | string
    weaknesses?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    recommendation?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paperId?: StringFieldUpdateOperationsInput | string
    assignmentId?: StringFieldUpdateOperationsInput | string
  }

  export type CommentUpdateWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paper?: PaperUpdateOneRequiredWithoutCommentsNestedInput
    parent?: CommentUpdateOneWithoutRepliesNestedInput
    replies?: CommentUpdateManyWithoutParentNestedInput
  }

  export type CommentUncheckedUpdateWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paperId?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    replies?: CommentUncheckedUpdateManyWithoutParentNestedInput
  }

  export type CommentUncheckedUpdateManyWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paperId?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ReviewerAssignmentCreateManyPaperInput = {
    id?: string
    status?: $Enums.AssignmentStatus
    assignedAt?: Date | string
    reviewerId: string
  }

  export type ReviewCreateManyPaperInput = {
    id?: string
    strengths: string
    weaknesses: string
    score: number
    recommendation: string
    createdAt?: Date | string
    reviewerId: string
    assignmentId: string
  }

  export type CommentCreateManyPaperInput = {
    id?: string
    body: string
    createdAt?: Date | string
    updatedAt?: Date | string
    authorId: string
    parentId?: string | null
  }

  export type ReviewerAssignmentUpdateWithoutPaperInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumAssignmentStatusFieldUpdateOperationsInput | $Enums.AssignmentStatus
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewer?: UserUpdateOneRequiredWithoutReviewerAssignmentsNestedInput
    review?: ReviewUpdateOneWithoutAssignmentNestedInput
  }

  export type ReviewerAssignmentUncheckedUpdateWithoutPaperInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumAssignmentStatusFieldUpdateOperationsInput | $Enums.AssignmentStatus
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewerId?: StringFieldUpdateOperationsInput | string
    review?: ReviewUncheckedUpdateOneWithoutAssignmentNestedInput
  }

  export type ReviewerAssignmentUncheckedUpdateManyWithoutPaperInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumAssignmentStatusFieldUpdateOperationsInput | $Enums.AssignmentStatus
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewerId?: StringFieldUpdateOperationsInput | string
  }

  export type ReviewUpdateWithoutPaperInput = {
    id?: StringFieldUpdateOperationsInput | string
    strengths?: StringFieldUpdateOperationsInput | string
    weaknesses?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    recommendation?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewer?: UserUpdateOneRequiredWithoutReviewsNestedInput
    assignment?: ReviewerAssignmentUpdateOneRequiredWithoutReviewNestedInput
  }

  export type ReviewUncheckedUpdateWithoutPaperInput = {
    id?: StringFieldUpdateOperationsInput | string
    strengths?: StringFieldUpdateOperationsInput | string
    weaknesses?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    recommendation?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewerId?: StringFieldUpdateOperationsInput | string
    assignmentId?: StringFieldUpdateOperationsInput | string
  }

  export type ReviewUncheckedUpdateManyWithoutPaperInput = {
    id?: StringFieldUpdateOperationsInput | string
    strengths?: StringFieldUpdateOperationsInput | string
    weaknesses?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    recommendation?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewerId?: StringFieldUpdateOperationsInput | string
    assignmentId?: StringFieldUpdateOperationsInput | string
  }

  export type CommentUpdateWithoutPaperInput = {
    id?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    author?: UserUpdateOneRequiredWithoutCommentsNestedInput
    parent?: CommentUpdateOneWithoutRepliesNestedInput
    replies?: CommentUpdateManyWithoutParentNestedInput
  }

  export type CommentUncheckedUpdateWithoutPaperInput = {
    id?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    authorId?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    replies?: CommentUncheckedUpdateManyWithoutParentNestedInput
  }

  export type CommentUncheckedUpdateManyWithoutPaperInput = {
    id?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    authorId?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CommentCreateManyParentInput = {
    id?: string
    body: string
    createdAt?: Date | string
    updatedAt?: Date | string
    paperId: string
    authorId: string
  }

  export type CommentUpdateWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paper?: PaperUpdateOneRequiredWithoutCommentsNestedInput
    author?: UserUpdateOneRequiredWithoutCommentsNestedInput
    replies?: CommentUpdateManyWithoutParentNestedInput
  }

  export type CommentUncheckedUpdateWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paperId?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    replies?: CommentUncheckedUpdateManyWithoutParentNestedInput
  }

  export type CommentUncheckedUpdateManyWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paperId?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}