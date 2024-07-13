// npm install eslint @eslint/js --save-dev installs ESlint as a dev dependency
// npx eslint --init initializes a default ESlint config (this file)

import globals from "globals";
import js from '@eslint/js'
// plugin that defines a set of code style-related rules
// npm install --save-dev @stylistic/eslint-plugin-js
import stylisticJs from '@stylistic/eslint-plugin-js'



export default [
  js.configs.recommended, // hightlight-line

  // our custom options
  {
    files: ["**/*.js"], // tells ESlint to look at all files
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node, // include all global vars such as process, globals.browser to allow browser specific global variables like window and document
      },
      ecmaVersion: "latest", // sets ECMAScript version to the latest available version
    },

    // import stylisticJs from '@stylistic/eslint-plugin-js'
    plugins: { // extends ESLint's functionality by adding custom rules, configs etc not avail in ESLint library
      '@stylistic/js': stylisticJs
    },
    rules: { // rules for indentation, line breaks, quotes, semi colons all defined in the ESlint styles plugin
      '@stylistic/js/indent': [
        'error',
        2
      ],
      '@stylistic/js/linebreak-style': [
        'error',
        'windows'
      ],
      '@stylistic/js/quotes': [
        'error',
        'single'
      ],
      '@stylistic/js/semi': [
        'error',
        'never'
      ],
      'eqeqeq': 'error', // warns us if equality is not checked w/ ===
      'no-trailing-spaces': 'error', // no trailing spaces
      'object-curly-spacing': [ // space b4 and after curly braces
        'error', 'always'
      ],
      'arrow-spacing': [ // consistent use of whitespaces in parameters of arrow functions
        'error', { 'before': true, 'after': true },
      ],
      'no-console': 'off', // disabling the rule that warns us abt console.log cmds, will allow us to use console.log w/o ESlint flagging them as issues

    },
  },

  { 
    ignores: ["dist/**", "build/**"],
  }, // we do not want npm run lint to check dist file

]

  // Now the npm run lint command will check every file in the project.

