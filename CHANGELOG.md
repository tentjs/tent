# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
