const js = require("@eslint/js");

module.exports = [
    {
        ignores: ["node_modules/**"]
    },
    js.configs.recommended,
    {
        files: ["src/**/*.js", "scripts/**/*.js"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "commonjs",
            globals: {
                console: "readonly",
                process: "readonly",
                module: "readonly",
                require: "readonly",
                __dirname: "readonly"
            }
        },
        rules: {
            "no-unused-vars": "error"
        }
    }
];