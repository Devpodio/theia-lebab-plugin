# theia-lebab-plugin

A Theia-plugin to support Lebab formatting.

## Note

This repository is made to work on @devpodio fork of Theia.

To make this work on Theia, Clone this repo and replace all instances of `@devpodio` and rebuild.

### How to Install

- On your theia-ide, press F1 and search for `deploy`
- Choose `Deploy plugin by id`
- Enter the path of `theia_lebab_plugin.theia` on your repository. example: `https://github.com/Devpodio/theia-lebab-plugin/blob/master/theia_lebab_plugin.theia`

### Lebab configuration

- This plugin reads the `.lebabrc.json` file on your workspace root path.
Sample configuration
```json
{
  "enable": true,
  "showWarnings": false,
  "showErrors": true,
  "transforms" : [
      "arrow",
      "arrow-return",
      "let"
  ]
}
```
For more transform choices, visit [Lebab](https://github.com/lebab/lebab)

