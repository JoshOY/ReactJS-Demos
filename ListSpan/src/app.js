/** @jsx React.DOM */

var NavOption = React.createClass({displayName: "NavOption",
	render: function() {
		return  React.createElement("li", null, 
					 this.props.name
				);
	}
});

var TitleView = React.createClass( {displayName: "TitleView",

	getInitialState: function() {
		return { };
	},

	render: function() {
		var self = this;

		var optionList = this.props.headOptions.map( function(s, i) {
			return (
				React.createElement(NavOption, {name: s.name, buttonSpecial: s.buttonSpecial}
				)
				);
		});

		return (
			React.createElement("div", null, 
				React.createElement("ul", {class: "nav"}, 
				 optionList 
				)
			)
			);
	}
});

var headOptionsList = [
	{ name: "浏览物品", buttonSpecial: "no" },
	{ name: "今日最新", buttonSpecial: "no" },
	{ name: "帮助",     buttonSpecial: "no" },
	{ name: "登录",     buttonSpecial: "no" },
	{ name: "注册清风", buttonSpecial: "button-green" }
];


React.render(
	React.createElement(TitleView, {headOptions:  headOptionsList }),
	document.body
);
