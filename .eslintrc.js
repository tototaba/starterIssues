module.exports = {
  extends: 'react-app',
  plugins: ['filenames'],
  rules: {
    'no-var': ['error'],
    'filenames/match-exported': ['error', null, '\\.(preval|codegen)$'],
    'react/jsx-no-useless-fragment': ['warn'],
    'react/display-name': ['error'],
    'react/jsx-fragments': ['warn', 'syntax'],
    'react/self-closing-comp': ['warn'],
    'react/function-component-definition': [
      'warn',
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      },
    ],
    'react/destructuring-assignment': ['warn', 'always'],
    'no-restricted-syntax': [
      'error',
      {
        selector: "MemberExpression[object.name='React']",
        message: 'Do not use React. like a namespace',
      },
    ],
  },
};
