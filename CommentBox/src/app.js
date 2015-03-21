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

    handleCommentSubmit: function(comment) {
        // Optimization: optimistic updates
        var comments = this.state.data;
        var newComments = comments.concat([comment]);
        this.setState({data: newComments});

        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: comment,
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
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
                React.createElement(CommentForm, {onCommentSubmit: this.handleCommentSubmit})
            )
        );
    }
});

var CommentForm = React.createClass( {displayName: "CommentForm",
    handleSubmit: function(e) {
        // Call preventDefault() on the event to prevent the browser's default action of submitting the form.
        e.preventDefault();
        // We use the ref attribute to assign a name to a child component and this.refs to reference the component.
        // We can call React.findDOMNode(component) on a component to get the native browser DOM element.
        var author = React.findDOMNode(this.refs.author).value.trim();
        var text = React.findDOMNode(this.refs.text).value.trim();
        if (!text || !author) {
            return;
        }
        this.props.onCommentSubmit({author: author, text: text});
        React.findDOMNode(this.refs.author).value = '';
        React.findDOMNode(this.refs.text).value = '';
        return;
    },

    render: function() {
        return (
            React.createElement("form", {className: "commentForm", onSubmit: this.handleSubmit}, 
                React.createElement("input", {type: "text", placeholder: "Your name", ref: "author"}), 
                React.createElement("input", {type: "text", placeholder: "Say something...", ref: "text"}), 
                React.createElement("input", {type: "submit", value: "Post now!"})
            )
        );
    }
});

React.render(React.createElement(CommentBox, {url: "src/comments.json"}), document.getElementById("content"));
