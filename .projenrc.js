const { typescript } = require('projen');
const project = new typescript.TypeScriptProject({
  defaultReleaseBranch: 'main',
  name: 'ts-instanceof',
  description: 'A robust replacement for instanceof, for use in TypeScript libraries',

  // deps: [],                /* Runtime dependencies of this module. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */

  releaseToNpm: true,
});
project.synth();