"use strict";
const fs = require("fs");

module.exports = function createLazyBundleComponent(path, cb) {
	const pathSplit = path.split("/");
	const fileName = pathSplit[pathSplit.length - 1].split(".js")[0];
	const newFileName = `${fileName}-async.js`;
	const asyncComponentName = fileName.split("-").map(word => (
		`${word[0].toUpperCase()}${word.slice(1, word.length)}`
	)).join("");
	const component = `const DefaultComponent = () => null;
export default class ${asyncComponentName}Async extends React.Component {
	constructor(props) {
		super(props);
		this.state = { Component: props.Loader || DefaultComponent };
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
			cb(err);
			return;
		}
		fs.writeFile(pathSplit.slice(0, pathSplit.length - 1).concat("index.js").join("/"), index, err => {
			if (err) {
				cb(err);
				return;
			}
			cb(null);
		});
	});
}
