// tutorial.js

var converter = new Showdown.converter();

var Comment = React.createClass({
    render: function() {
        var rawMarkup = converter.makeHtml(this.props.children.toString());

        return (
            <div className="comment">
                <h2 className="commentAuthor">
                  {this.props.author}
                </h2>
                <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
            </div>
        );
    }
});

var CommentList = React.createClass({
    render: function() {

        var commentNodes = this.props.data.map(
            function(comment) {
                return (
                <Comment author={comment.author}>
                {comment.text}
                </Comment>
                );
            }
        );

        return (
            <div className="commentList">
              {commentNodes}
            </div>
        );
    }
});

var CommentForm = React.createClass({
    render: function() {
        return (
            <div className="commentForm">
            Hello world! I'm a CommentForm.
            </div>
        );
    }
});

var CommentBox = React.createClass({

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
            <div className="commentBox">
                <h1>Comments</h1>
                <CommentList data={this.state.data} pollInterval={2000} />
                <CommentForm onCommentSubmit={this.handleCommentSubmit} />
            </div>
        );
    }
});

var CommentForm = React.createClass( {
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
            <form className="commentForm" onSubmit={this.handleSubmit}>
                <input type="text" placeholder="Your name" ref="author" />
                <input type="text" placeholder="Say something..." ref="text" />
                <input type="submit" value="Post now!" />
            </form>
        );
    }
});

React.render(<CommentBox url="src/comments.json" />, document.getElementById("content"));