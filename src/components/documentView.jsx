import React from 'react';
import Draft from './draft';
import {Card, CardActions, CardHeader} from 'material-ui/Card';
import {Close, Add, Share} from 'material-ui-icons';
import IconButton from 'material-ui/IconButton'
import TextField from 'material-ui/TextField';
import Button from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'
import Paper from 'material-ui/Paper';
import Snackbar from 'material-ui/Snackbar';

export default class DocumentView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      draft: false,
      doc: null,
      open: false,
      newTitle: '',
      openShare: false,
      shareWith: '',
      shareDoc: null,
      showMessage: false,
      message: '',
    };
  }
  componentDidMount() {
    this.props.changeMenuTitle('HDocs');
    this.props.socket.on('doc', (doc) => {
      this.setState({doc, draft: true, open: false});
      this.props.toggleDocs();
    });
    this.props.socket.on('err', (err) => console.log(err));
    this.props.socket.on('shareSuccessful', (user) => {
      const message = `Successfully shared to ${user}!`;
      this.setState({message, showMessage: true});
    });
    this.props.socket.on('shareUnsuccessful', (user) => {
      const message = `${user} not found!`;
      this.setState({message, showMessage: true});
    });
    this.props.socket.on('deleteSuccessful', (title) => {
      const message = `Successfully deleted ${title}!`;
      this.setState({message, showMessage: true});
    });
    this.props.socket.on('deleteUnsuccessful', (title) => {
      const message = `Could not delete ${title}!`;
      this.setState({message, showMessage: true});
    });
    this.props.socket.on('removeSuccessful', (title) => {
      const message = `Successfully removed ${title}!`;
      this.setState({message, showMessage: true});
    });
    this.props.socket.on('removeUnsuccessful', (title) => {
      const message = `Could not remove ${title}!`;
      this.setState({message, showMessage: true});
    });
  }

  updateNewTitle(e) {
    this.setState({newTitle: e.target.value});
  }
  updateShareWith(e) {
    this.setState({shareWith: e.target.value});
  }
  createDoc() {
    this.props.socket.emit('newDoc', this.state.newTitle);
  }
  share() {
    this.props.socket.emit('share', {doc: this.state.shareDoc, username: this.state.shareWith});
    this.setState({openShare: false, shareWith: '', shareDoc: null});
  }
  delete(e, doc) {
    e.stopPropagation();
    this.props.socket.emit('delete', doc);
  }
  remove(e, doc) {
    e.stopPropagation();
    this.props.socket.emit('remove', doc);
  }

  render() {
    if (this.state.draft && this.props.showDoc) {
      return (
        <Draft doc={this.state.doc}
          changeMenuTitle={(title) => this.props.changeMenuTitle(title)}
          user={this.props.user} socket={this.props.socket} />
      );
    }
    return (
    <div>
        {/*Following IconButton and Dialog prompt the user for a document title before creating the request new document*/}
          <IconButton onClick={() => this.setState({open:true})}>
            <Add />
          </IconButton>
          <Dialog
            title="Create Document"
            modal={false}
            open={this.state.open}
            onRequestClose={() => this.setState({open:false})}>
            Title of new document
            <TextField
              autoFocus
              id="newTitle"
              label="Document Title"
              type="text"
              onChange={(e) => this.updateNewTitle(e)}
            />
            <Button onClick={() => this.createDoc()} color="primary">
              Create
            </Button>
          </Dialog>

          <h4>Your documents:</h4>
          {this.props.user.docs.map((doc) => (
            <div>
              <Card>
                <CardHeader title={doc.title} subtitle={doc.document}
                  onClick={() => this.props.socket.emit('doc', doc.document)} />
                <CardActions>
                  <Button onClick={() => this.setState({openShare: true, shareDoc: doc})}>
                    Share <Share />
                  </Button>
                  <Button onClick={(e) => this.delete(e, doc)}>
                    Delete
                  </Button>
                  <Snackbar
                    anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
                    open={this.state.showMessage}
                    onClose={() => this.setState({showMessage: false})}
                    ContentProps={{'aria-describedby': 'message-id'}}
                    message={<span id="message-id">{this.state.message}</span>}
                    action={[
                      <IconButton
                        key="close"
                        aria-label="Close"
                        color="inherit"
                        className="Close"
                        onClick={() => this.setState({showMessage: false})}
                      >
                        <Close style={{fill: 'white'}} />
                      </IconButton>,
                    ]}
                  />
                  <Dialog
                    title="Share Document"
                    modal={false}
                    open={this.state.openShare}
                    onRequestClose={() => this.setState({openShare:false})}>
                    Share with:
                    <TextField
                      autoFocus
                      id="shareUsername"
                      placeholder="Username"
                      label="Username"
                      type="text"
                      onChange={(e) => this.updateShareWith(e)}
                    />
                    <Button onClick={() => this.share()} color="primary">
                      Share
                    </Button>
                  </Dialog>
                </CardActions>
              </Card>
            </div>
          ))}
          <h4>Shared with you:</h4>
          {this.props.user.sharedDocs.map((doc) => (
            <Card>
              <CardHeader title={doc.title} subtitle={doc.document} onClick={() => this.props.socket.emit('doc', doc.document)}>
                <CardActions>
                  <Button onClick={(e) => this.remove(e, doc)}>
                    Remove
                  </Button>
                </CardActions>
              </CardHeader>
            </Card>
          ))}
      </div>
    );
  }
}
