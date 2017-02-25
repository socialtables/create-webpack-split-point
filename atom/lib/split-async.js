const DefaultComponent = () => null;
let cachedComponent = null;
export default class SplitAsync extends React.Component {
	constructor(props) {
		super(props);
		this.state = { Component: cachedComponent || props.Loader || DefaultComponent };
	}
	componentDidMount() {
		/* if we've already loaded the component, we will have already stored a reference to it
     * so no need to import again.
		*/
		if (!cachedComponent) {
			import("./split.js").then(file => {
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
