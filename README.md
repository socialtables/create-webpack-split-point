# create-webpack-split-point

Webpack 2 exposes System.import a async module loader that will automatically define a split point and create a new bundle in your code that will only be loaded if the system.import is executed. React components that are not part of initial paint are a taylor made use case for this. This module aims to abstract a way the work of creating one of these components.

## use

`npm install -g create-webpack-split-point`;

Then in terminal call the module with --path and a path to the component file. This will create 2 files in the directory of the component. In the case below it would create `./components/header/header-async.js` and `./components/header/index.js`.

```
create-webpack-split-point --path ./components/header/header.js
```

Then in the place you want to use the async header component you could simply import from the directory.

```js
import Header from "./components/header";
```

As soon as componentDidMount in Header is fired `System.import` will be called and it will asynchronously load the bundle containing the Header component and render it on the page, before that a Component returning null will be rendered.