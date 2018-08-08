import React from 'react';
import Draft from './draft';

export default class DocumentView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      draft: false,
      doc: null,
    };
  }
  componentDidMount() {
    this.props.socket.on('doc', (doc) => {
      this.setState({doc, draft: true});
    });
    this.props.socket.on('err', (err) => {
      console.log(err);
    });
  }
  createDoc() {
    this.props.socket.emit('newDoc', 'new document title');
  }
  render() {
    if (this.state.draft) return <Draft doc={this.state.doc}/>
    return (
      <div>
        <button onClick={() => this.createDoc()}>Create New</button>
        <h4>Your documents:</h4>
        {this.props.user.docs.map((doc) => (
          <p onClick={() => this.props.socket.emit('doc', doc.document)}>
            {doc.title}
          </p>
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
