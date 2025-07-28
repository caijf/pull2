/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
// ref: https://github.com/ant-design/ant-design-mobile/blob/master/fileTransformer.js
const path = require('path');

// https://jestjs.io/docs/code-transformation#transforming-images-to-their-path
module.exports = {
  process(sourceText, sourcePath, options) {
    return {
      code: `module.exports = ${JSON.stringify(path.basename(sourcePath))};`
    };
  }
};
