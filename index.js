"use strict";
const fs = require("fs");

module.exports = function createLazyBundleComponent(path) {
	const pathSplit = path.split("/");
	const fileName = pathSplit[pathSplit.length - 1].split(".js")[0];
	const newFileName = `${fileName}-async.js`;
	const component = `const DefaultComponent = () => null;
export default class ${fileName[0].toUpperCase()}${fileName.slice(1, fileName.length)}Async extends React.Component {
	constructor() {
		super();
		this.state = { Component: DefaultComponent };
	}
	componentDidMount() {
		import("./${fileName}.js").then(file => this.setState({ Component: file.default }));
	}
	render() {
		const { Component } = this.state;
		return <Component {...this.props} />;
	}
}
`;	
	const index = `export { default } from "./${newFileName}";`;
	fs.writeFile(pathSplit.slice(0, pathSplit.length - 1).concat(newFileName).join("/"), component, err => {
		if (err) {
			console.error(err);
			process.exit(1);
		}
		fs.writeFile(pathSplit.slice(0, pathSplit.length - 1).concat("index.js").join("/"), index, err => {
			if (err) {
				console.error(err);
				process.exit(1);
			}
			console.log("Succesfully created async component files");
			process.exit(0);
		});
	});
}
