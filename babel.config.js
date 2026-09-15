module.exports = {
  presets: ['module:@react-native/babel-preset'],
  "plugins": [
    [
      "module-resolver",
      {
        "root": [
          "./src"
        ],
        "alias": {
          "@assets": "./assets",
          "@src": "./src",
          "@components": "./src/components",
          "@store": "./src/store",
          "@screens": "./src/screens",
          "@utils": "./src/utils",
          "@constants": "./src/constants",
          "@navigation": "./src/navigation",
          "@hooks": "./src/hooks",
          "@libs": "./src/libs",
          "@translations": "./src/translations",
          "@api": "./src/api",
          "@tokens": "./src/tokens",
          "@types": "./src/types",
          "@sharedComponents": "./src/sharedComponents"
        }
      }
    ]
  ]
};
