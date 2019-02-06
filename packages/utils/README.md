# @code-to-json/utils

[![Build Status](https://travis-ci.org/code-to-json/code-to-json.svg?branch=master)](https://travis-ci.org/code-to-json/code-to-json)
[![Build Status](https://dev.azure.com/code-to-json/code-to-json/_apis/build/status/code-to-json.code-to-json)](https://dev.azure.com/code-to-json/code-to-json/_build/latest?definitionId=1)
[![Version](https://img.shields.io/npm/v/@code-to-json/utils.svg)](https://www.npmjs.com/package/@code-to-json/utils)
[![codecov](https://codecov.io/gh/code-to-json/code-to-json/branch/master/graph/badge.svg)](https://codecov.io/gh/code-to-json/code-to-json/tree/master/packages/utils/src)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/code-to-json/code-to-json.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/code-to-json/code-to-json/alerts/)

---
# Usage
```js
import {
  all,
  isArray,
  some,
  isNotNull,
  isDefined,
  UnreachableError
} from '@code-to-json/utils';
isArray(0) // equals: false;
isArray([1,2,3]) // equals: true;
all([1, '2'], (v) => typeof v === 'string') // equals: false;
all([1, 2], (v) => typeof v === 'number') // equals: true;
all([2, 4], (v) => v%2 === 0) // equals: true;
some([1, '2'], (v) => typeof v === 'string') // equals: true;
some([1, 2], (v) => typeof v === 'string') // equals: false;
some([1, 4], (v) => v%2 === 0) // equals: true;
isNotNull(0) // equals: true;
isNotNull(null) // equals: false;
isNotNull(undefined) // equals: true;
isDefined(0) // equals: true;
isDefined(undefined) // equals: false;
new UnreachableError('') // throws;
```
© 2018 LinkedIn
