import React from 'react';
import Draft from './draft';
import {Card, CardActions, CardHeader, CardContent} from 'material-ui/Card';
import {Add} from 'material-ui-icons';
import IconButton from 'material-ui/IconButton'
import TextField from 'material-ui/TextField';
import Button from 'material-ui/RaisedButton'
import Dialog from 'material-ui/Dialog'
import DialogActions from 'material-ui/Dialog'
import DialogContent from 'material-ui/Dialog'
import DialogContentText from 'material-ui/Dialog'
import DialogTitle from 'material-ui/Dialog'

class PromptNew extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    }
  }


  handleClickOpen = () =>{
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    console.log(this.state.open)
    return (
      <div>
        <IconButton onClick={() => this.setState({
          open:true
        })}> <Add /> </IconButton>
        <Dialog
          title="Create Document"
          modal={false}
          open={this.state.open}
          onRequestClose={() => this.setState({
            open:false
          })}
        >
          Name of Document
            <Button onClick={() => this.props.createDoc()} color="primary">
              Create
            </Button>
      </Dialog>
        </div>
    )
  }
}

export default class DocumentView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      draft: false,
      doc: null,
      open: false,
      name: ''
    };
  }
  componentDidMount() {
    this.props.socket.on('doc', (doc) => {
      this.setState({doc, draft: true});
      this.props.toggleDocs()
    });
    this.props.socket.on('err', (err) => {
      console.log(err);
    });
  }

  updateName(e) {
    this.setState({
      name: e.target.value
    })
    console.log(this.state.name)
  }
  createDoc() {
    this.props.socket.emit('newDoc', this.state.name);
  }



  render() {
    if (this.state.draft && this.props.showDoc) {
      return <Draft doc={this.state.doc} changeMenuTitle={this.props.changeMenuTitle} title={this.state.doc.title}/>
    }
    return (
      <div>
        <IconButton onClick={() => this.setState({
          open:true
        })}> <Add /> </IconButton>
        <Dialog
          title="Create Document"
          modal={false}
          open={this.state.open}
          onRequestClose={() => this.setState({
            open:false
          })}
        >
          Name of Document
          <TextField
              autoFocus
              id="name"
              label="Document Name"
              type="text"
              fullWidth
              onChange={(e) => this.updateName(e)}
            />
            <Button onClick={() => this.createDoc()} color="primary">
              Create
            </Button>
      </Dialog>

        <h4>Your documents:</h4>
        {this.props.user.docs.map((doc) => (
          <Card >
            <CardHeader title={doc.title} subtitle={doc._id} onClick={() => this.props.socket.emit('doc', doc.document)}>
            </CardHeader>
          </Card>
        ))}
        <h4>Shared with you:</h4>
        {this.props.user.sharedDocs.map((doc) => (
          <p onClick={() => this.props.socket.emit('doc', doc.document)}>
            {doc.title}
          </p>
        ))}
      </div>
    );
  }
}
