import React from 'react';
import Draft from './draft';
import {Card, CardActions, CardHeader} from 'material-ui/Card';
import {Add, Share} from 'material-ui-icons';
import IconButton from 'material-ui/IconButton'
import TextField from 'material-ui/TextField';
import Button from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'

export default class DocumentView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      draft: false,
      doc: null,
      shareWith: '',
      open: false,
      openShare: false,
      newTitle: ''
    };
  }
  componentDidMount() {
    this.props.socket.on('doc', (doc) => {
      this.setState({doc, draft: true, open: false});
      this.props.toggleDocs();
    });
    this.props.socket.on('err', (err) => {
      console.log(err);
    });
    this.props.changeMenuTitle('HDocs')
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
  share(doc, user, docTitle) {
    console.log(doc)
    console.log(user)
    this.setState({
      openShare: false
    })
    this.props.socket.emit('share', {
      document: doc,
      username: user,
      title: docTitle
    })
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
          <Card>
            <CardHeader title={doc.title} subtitle={doc.document} onClick={() => this.props.socket.emit('doc', doc.document)}>
            </CardHeader>
            <CardActions>
              <Button onClick={()=> this.setState({openShare:true})}>Share <Share/></Button>
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
                <Button onClick={() => this.share(doc.document, this.state.shareWith, doc.title)} color="primary">
                  Share
                </Button>
              </Dialog>
            </CardActions>
          </Card>
        ))}
        <h4>Shared with you:</h4>
        {this.props.user.sharedDocs.map((doc) => (
          <Card>
            <CardHeader title={doc.title} subtitle={doc.document} onClick={() => this.props.socket.emit('doc', doc.document)}>
            </CardHeader>
          </Card>


          {/*<p onClick={() => this.props.socket.emit('doc', doc.document)}>
            {doc.title}
          </p>*/}
        ))}
      </div>
    );
  }
}
