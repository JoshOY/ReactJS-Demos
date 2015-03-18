/** @jsx React.DOM */

var NavOption = React.createClass({
	render: function() {
		return  <li className={ this.props.buttonSpecial }>
					{ this.props.name }
				</li>;
	}
});

var TitleView = React.createClass( {

	getInitialState: function() {
		return { };
	},

	render: function() {
		var self = this;

		var optionList = this.props.headOptions.map( function(s, i) {
			return (
				<NavOption name={s.name} buttonSpecial={s.buttonSpecial}>
				</NavOption>
				);
		});

		return (
			<div>
				<ul class="nav">
				{ optionList }
				</ul>
			</div>
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

document.ready( function() {
	React.render((<TitleView headOptions={ headOptionsList } />), document.body);
});