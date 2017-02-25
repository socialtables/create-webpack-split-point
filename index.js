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
let cachedComponent = null;
export default class ${asyncComponentName}Async extends React.Component {
	constructor(props) {
		super(props);
		this.state = { Component: cachedComponent || props.Loader || DefaultComponent };
	}
	componentDidMount() {
		/* if we've already loaded the component, we will have already stored a reference to it
     * so no need to import again.
		*/
		if (!cachedComponent) {
			import("./${fileName}.js").then(file => {
				/* cache component so if we unmount + remount component we will not need to
				 * wait until next tick to display (which we would be if wait for promise.then)
				*/
				cachedComponent = file.default;
				this.setState({ Component: file.default });
			});
		}
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