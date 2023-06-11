module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
    env: {
        node: true,
    },
    rules: {
        'no-console': 'off',
        'import/prefer-default-export': 'off',
    },
};
