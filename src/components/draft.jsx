import React from 'react';
import {Editor, EditorState, RichUtils, Modifier, convertToRaw, convertFromRaw} from 'draft-js';
import FontPicker from 'font-picker-react';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Popover from 'material-ui/Popover';
import IconButton from 'material-ui/IconButton';
import {FormatBold, FormatItalic, FormatUnderlined, FormatAlignLeft, FormatAlignCenter, FormatAlignRight, FormatListBulleted, FormatListNumbered, FormatSize, FormatColorText} from 'material-ui-icons';

export default class Draft extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      activeFont: 'Open Sans',
      anchorEl: null,
      showColor: false,
      showSize: false,
    };
    this.focus = () => this.refs.editor.focus();
    this.toggleColor = (toggledColor) => this._toggleColor(toggledColor);
  }

  componentDidMount() {
    console.log(this.props.doc);
    this.props.changeMenuTitle(this.props.doc.title);
    if (this.props.doc.content !== 'new') this.setContent(this.props.doc.content);
  }

  onChange = (editorState) => {
    this.setState({editorState});
    const content = this.getContent(editorState);
    this.props.socket.emit('docChange', {id: this.props.doc._id, content});
  }

  getContent(editorState) {
    return JSON.stringify(convertToRaw(editorState.getCurrentContent()));
  }
  setContent(rawContent) {
    this.setState({editorState: EditorState.createWithContent(convertFromRaw(JSON.parse(rawContent)))});
  }

  getBlockStyle(block) {
    switch (block.getType()) {
      case 'left':
      return 'left';
      case 'center':
      return 'center';
      case 'right':
      return 'right';
      default:
      return null;
    }
  }

  _onFontClick(e, fontSize) {
    e.preventDefault();
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, fontSize));
    this.handleRequestClose();
  }
  _onBoldClick(e) {
    e.preventDefault();
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  }
  _onItalClick(e) {
    e.preventDefault();
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'));
  }
  _onUnderClick(e) {
    e.preventDefault();
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'UNDERLINE'));
  }

  _onLeftClick(e) {
    e.preventDefault();
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'left'));
  }
  _onCenterClick(e) {
    e.preventDefault();
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'center'));
  }
  _onRightClick(e) {
    e.preventDefault();
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'right'));
  }

  _toggleBulletPoints(e){
    e.preventDefault();
    this.onChange(RichUtils.toggleBlockType(
      this.state.editorState,
      'unordered-list-item'
    ))
  }
  _toggleNumberList(e){
    e.preventDefault();
    this.onChange(RichUtils.toggleBlockType(
      this.state.editorState,
      'ordered-list-item'
    ))
  }


  _toggleColor(toggledColor) {
    const {editorState} = this.state;
    const selection = editorState.getSelection();

    // Let's just allow one color at a time. Turn off all active colors.
    const nextContentState = Object.keys(colorStyleMap)
    .reduce((contentState, color) => {
      return Modifier.removeInlineStyle(contentState, selection, color)
    }, editorState.getCurrentContent());

    let nextEditorState = EditorState.push(
      editorState,
      nextContentState,
      'change-inline-style'
    );

    const currentStyle = editorState.getCurrentInlineStyle();

    // Unset style override for current color.
    if (selection.isCollapsed()) {
      nextEditorState = currentStyle.reduce((state, color) => {
        return RichUtils.toggleInlineStyle(state, color);
      }, nextEditorState);
    }

    // If the color is being toggled on, apply it.
    if (!currentStyle.has(toggledColor)) {
      nextEditorState = RichUtils.toggleInlineStyle(
        nextEditorState,
        toggledColor
      );
    }

    this.onChange(nextEditorState);
  }

  handleClick = event => {
    this.setState({anchorEl: event.currentTarget, open: true});
  };
  handleClose = () => {
    this.setState({anchorEl: null});
  };
  handleRequestClose = () => {
    this.setState({open: false});
  };

  render() {
    const {editorState} = this.state;
    const {classes} = this.props;
    const {anchorEl, open, placement} = this.state;

    return (
      <div style={styles.root}>

        <IconButton onClick={(e) => this._onBoldClick(e)}> <FormatBold/> </IconButton>
        <IconButton onClick={(e) => this._onItalClick(e)}> <FormatItalic/> </IconButton>
        <IconButton onClick={(e) => this._onUnderClick(e)}> <FormatUnderlined/> </IconButton>
        <IconButton onClick={(e) => this._toggleBulletPoints(e)}> <FormatListBulleted/> </IconButton>
        <IconButton onClick={(e) => this._toggleNumberList(e)}> <FormatListNumbered/> </IconButton>
        <IconButton onClick={(e) => this._onLeftClick(e)}> <FormatAlignLeft/> </IconButton>
        <IconButton onClick={(e) => this._onCenterClick(e)}> <FormatAlignCenter/> </IconButton>
        <IconButton onClick={(e) => this._onRightClick(e)}> <FormatAlignRight/> </IconButton>

        <IconButton  onClick={(e) => this.setState({
          anchorEl: e.currentTarget,
          showSize: true
        })}> <FormatSize/> </IconButton>
        <Popover
          open={this.state.showSize}
          anchorEl={anchorEl}
          onClose={this.handleClose}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={() => this.setState({
            showSize: false
          })}
          >
            <Menu>
              <MenuItem onClick={(e) => this._onFontClick(e, 'two')}>2</MenuItem>
              <MenuItem onClick={(e) => this._onFontClick(e, 'four')}>4</MenuItem>
              <MenuItem onClick={(e) => this._onFontClick(e, 'eight')}>8</MenuItem>
              <MenuItem onClick={(e) => this._onFontClick(e, 'sixteen')}>16</MenuItem>
              <MenuItem onClick={(e) => this._onFontClick(e, 'thirtytwo')}>32</MenuItem>
              <MenuItem onClick={(e) => this._onFontClick(e, 'seventytwo')}>72</MenuItem>
            </Menu>
          </Popover>

          <IconButton  onClick={(e) => this.setState({
            anchorEl: e.currentTarget,
            showColor: true
          })}> <FormatColorText/> </IconButton>
          <Popover
            open={this.state.showColor}
            anchorEl={anchorEl}
            onClose={this.handleClose}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onRequestClose={() => this.setState({
              showColor:false
            })}
            >
              <ColorControls
                editorState={editorState}
                onToggle={this.toggleColor}
              />
            </Popover>

            <div>
              <FontPicker
                apiKey="AIzaSyAEJbLvfLVpSM2CB66g_K4iOLjospEG_rY"
                activeFont={this.state.activeFont}
                onChange={nextFont => this.setState({ activeFont: nextFont.family })}
              />
            </div>

            <div style={styles.editor} onClick={this.focus} className="apply-font">
              <Editor
                customStyleMap={colorStyleMap}
                editorState={editorState}
                onChange={this.onChange}
                placeholder="Type Something to Begin!"
                ref="editor"
                className="apply-font"
                blockStyleFn={this.getBlockStyle}
              />
            </div>
          </div>
        );
      }
    }

class StyleButton extends React.Component {
  constructor(props) {
    super(props);
    this.onToggle = (e) => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }

  render() {
    let style = styles.styleButton;
    if (this.props.active) {
      style = {...styles.styleButton, ...colorStyleMap[this.props.style]};
    }

    return (
      <MenuItem style={style} onMouseDown={this.onToggle}>
        {this.props.label}
      </MenuItem>
    );
  }
}

  // an array of color styles
  var COLORARR = [
    {label: 'Red', style: 'red'},
    {label: 'Orange', style: 'orange'},
    {label: 'Yellow', style: 'yellow'},
    {label: 'Green', style: 'green'},
    {label: 'Blue', style: 'blue'},
    {label: 'Indigo', style: 'indigo'},
    {label: 'Violet', style: 'violet'},
  ];

  const ColorControls = (props) => {
    var currentStyle = props.editorState.getCurrentInlineStyle();
    var index = 0;
    return (

      <div style={styles.controls}>
        <Menu>
          {COLORARR.map(type =>
            <StyleButton
              active={currentStyle.has(type.style)}
              label={type.label}
              onToggle={props.onToggle}
              style={type.style}
              key={++index}
            />
          )}
        </Menu>
      </div>
    );
  };

  // This object provides the styling information for our custom color
  // styles.
  const colorStyleMap = {
    two: {
      fontSize: 2
    },
    four: {
      fontSize: 4
    },
    eight: {
      fontSize: 8
    },
    sixteen: {
      fontSize: 16
    },
    twentyfour: {
      fontSize: 24
    },
    thirtytwo: {
      fontSize: 32
    },
    seventytwo: {
      fontSize: 72
    },
    red: {
      color: 'rgba(255, 0, 0, 1.0)',
    },
    orange: {
      color: 'rgba(255, 127, 0, 1.0)',
    },
    yellow: {
      color: 'rgba(180, 180, 0, 1.0)',
    },
    green: {
      color: 'rgba(0, 180, 0, 1.0)',
    },
    blue: {
      color: 'rgba(0, 0, 255, 1.0)',
    },
    indigo: {
      color: 'rgba(75, 0, 130, 1.0)',
    },
    violet: {
      color: 'rgba(127, 0, 255, 1.0)',
    },
    selection0: {
      borderLeft: 'solid 3px red',
      backgroundColor: 'rgba(255,0,0,.5)'
    },
    selection1: {
      borderLeft: 'solid 3px blue',
      backgroundColor: 'rgba(0,255,0,.5)'
    },
    selection2: {
      borderLeft: 'solid 3px green',
      backgroundColor: 'rgba(0,0,255,.5)'
    },
  };

  const styles = {
    root: {
      fontFamily: '\'Georgia\', serif',
      fontSize: 14,
      padding: 20,
      width: 600,
    },
    editor: {
      borderTop: '1px solid #ddd',
      cursor: 'text',
      fontSize: 16,
      marginTop: 20,
      minHeight: 250,
      paddingTop: 20,
      border: '1px solid #ccc',
    },
    controls: {
      fontFamily: '\'Helvetica\', sans-serif',
      fontSize: 14,
      marginBottom: 10,
      userSelect: 'none',
    },
    styleButton: {
      color: '#999',
      cursor: 'pointer',
      marginRight: 16,
      padding: '2px 0',
    },
    right: {
      'text-align': 'right'
    },
    center: {
      'text-align': 'center'
    },
    left: {
      'text-align': 'left'
    }
  };
