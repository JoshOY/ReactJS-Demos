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
                <CommentForm />
            </div>
        );
    }
});


React.render(<CommentBox url="src/comments.json" />, document.getElementById("content"));