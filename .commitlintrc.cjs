module.exports = {
  extends: ['cz'],
  rules: {
    // header最大94字符
    'header-max-length': [0, 'always', 94],

    // type的类型必须在指定范围内
    'type-enum': [
      2,
      'always',
      [
        'build',
        'ci',
        'chore',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test',
      ],
    ],

    // type不能为空
    'type-empty': [2, 'never'],

    // type必须小写
    'type-case': [2, 'always', 'lowerCase'],

    // scope 必须小写
    'scope-case': [2, 'always', 'lowerCase'],

    // scope 不限制类型
    'scope-enum': [2, 'always', []],
    'body-max-line-length': [0, 'always', 300],
  },
}
