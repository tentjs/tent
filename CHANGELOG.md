# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.33-1] - 2024-06-02

### Fixed

- `Component<S>` now requires `state` if `S` is defined ([#43](https://github.com/tentjs/tent/issues/43))

## [0.0.33-0] - 2024-05-27

### Added

- Add `mounted` to `tags` to run code after the tag has been mounted

## [0.0.32] - 2024-05-20

### Fixed

- Fix when root node becomes a new tag ([#38](https://github.com/tentjs/tent/issues/38))

## [0.0.31] - 2024-05-20

### Fixed

- Don't `console.warn` on existing tags. You should have full control over your tags.

## [0.0.29] & [0.0.30] - 2024-05-16

- A mistake was made in the versioning, so these are re-releases of `0.0.28`. The changelog is kept for transparency.

## [0.0.28] - 2024-05-16

### Fixed

- Falsy boolean values are now correctly removing attributes

## [0.0.27] - 2024-05-16

### Fixed

- When setting attributes it now differs between assignment and `setAttribute`

## [0.0.26] - 2024-05-15

### Changed

- Move to using `el.dataset` for attributes, instead of `attr()`
  - `attr` is deprecated and will be removed in the next major version

## [0.0.25] - 2024-05-14

### Added

- Typed attributes via `Component<S, A>`, allows for typing via `attr<K extends keyof A>(name: K) => A[K] | undefined`

### Fixed

- Rollback the support for nesting components with `mount` and tag functions, as it was not following the vision. Instead, you should use a regular function if you'd like to abstract away some logic.

## [0.0.24] - 2024-05-13

### Added

- Add possibility to pass component directly to a tag, making nesting easier

## [0.0.23] - 2024-05-10

### Fixed

- Fix `attr()` on attributes without a value

### Added

- Allow nested components with `mount`
- Add typed `attr` via `attr<T = string>(name: string)`

## [0.0.22] - 2024-05-09

### Fixed

- Fix `Component` type to allow no defined state

## [0.0.21] - 2024-05-09

### Added

- Add `attr` to `view` and `mounted`: Let's you query an attribute on the element

## [0.0.20] - 2024-04-10

### Added

- Pass `el` to `view` and `mounted`

### Changed

- Remove unused `TentNodeList` type

## [0.0.19] - 2024-02-06

### Added

- Allow a mix of text nodes and html nodes

## [0.0.18] - 2024-01-11

### Changed

- Check if a node have children before running nested diffs
- Use `!= null` instead of `!foo` for stability

## [0.0.17] - 2024-01-09

### Fixed

- `Children` now rightfully accepts `CustomNode`
  - E.g. you can now, without Typescript complaining, nest nodes: `p(span('my cool span'))`

## [0.0.16] - 2024-01-03

### Added

- Add ES module build target

## [0.0.15] - 2024-01-03

### Fixed

- The root node of a component is now also updated [#29](https://github.com/tentjs/tent/pull/29)

## [0.0.14] - 2024-01-02

### Fixed

- Nested assignments will now trigger re-renders [#28](https://github.com/tentjs/tent/pull/28)

## [0.0.13] - 2024-01-02

### Added

- Export `createTag` for creating custom tags, as well as `Component`, `Children` and `Context` types

## [0.0.12] - 2023-12-27

### Fixed

- Children can be a number. A number will be converted to string with `.toString()`

## [0.0.11] - 2023-12-27

### Fixed

- `state` is now optional on `Component<S>`

## [0.0.10] - 2023-12-26

### Added

- Ability to type `state`
- Remove `.parcel-cache` on `npm run build`

### Fixed

- Add attributes recursively when cloning elements
- Remove unpkg link from README
- Set `license` in package.json to `MIT`

## [0.0.9] - 2023-12-24

### Added

- Added `CHANGELOG.md`

### Fixed

- Set/remove `boolean` attributes instead of `disabled="true"`/`disabled="false"`

## [0.0.8] - 2023-12-24

### Changed

- Rename `createElement` to `createTag`
- Rename variables in `walker()` to make a bit more sense
- Remove some tags and only keep the most used ones
