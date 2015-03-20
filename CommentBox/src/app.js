// tutorial.js

var converter = new Showdown.converter();

var Comment = React.createClass({displayName: "Comment",
    render: function() {
        var rawMarkup = converter.makeHtml(this.props.children.toString());

        return (
            React.createElement("div", {className: "comment"}, 
                React.createElement("h2", {className: "commentAuthor"}, 
                  this.props.author
                ), 
                React.createElement("span", {dangerouslySetInnerHTML: {__html: rawMarkup}})
            )
        );
    }
});

var CommentList = React.createClass({displayName: "CommentList",
    render: function() {

        var commentNodes = this.props.data.map(
            function(comment) {
                return (
                React.createElement(Comment, {author: comment.author}, 
                comment.text
                )
                );
            }
        );

        return (
            React.createElement("div", {className: "commentList"}, 
              commentNodes
            )
        );
    }
});

var CommentForm = React.createClass({displayName: "CommentForm",
    render: function() {
        return (
            React.createElement("div", {className: "commentForm"}, 
            "Hello world! I'm a CommentForm."
            )
        );
    }
});

var CommentBox = React.createClass({displayName: "CommentBox",

    getInitialState: function() {
        return {data: []};
    },


    loadCommentsFromServer: function() {
        var self = this;
        $.ajax({
            url: this.props.url,
            datatype: "json",
            success: function(d) {
                self.setState({data: d});
            },
            error: function(xhr, status, err) {
                console.error(self.props.url, status, err.toString());
            }
        });
    },

    /*
     * componentDidMount is a method called automatically by React when a component is rendered
     * */
    componentDidMount: function() {
        this.loadCommentsFromServer();
        setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },

    render: function() {
        return (
            React.createElement("div", {className: "commentBox"}, 
                React.createElement("h1", null, "Comments"), 
                React.createElement(CommentList, {data: this.state.data, pollInterval: 2000}), 
                React.createElement(CommentForm, null)
            )
        );
    }
});


React.render(React.createElement(CommentBox, {url: "src/comments.json"}), document.getElementById("content"));
