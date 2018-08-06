import React from 'react';
import TextField from 'material-ui/TextField'
import { Editor, EditorState, RichUtils, Modifier} from 'draft-js';
import FontPicker from 'font-picker-react';

export default class Colors extends React.Component {
 constructor(props) {
   super(props);
   this.state = {
     editorState: EditorState.createEmpty(),
     textAlignment: 'left',
     colorHex: '',
     activeFont: 'Open Sans'
   };

   this.focus = () => this.refs.editor.focus();
   this.onChange = (editorState) => {
     RichUtils.toggleInlineStyle(this.state.editorState, this.state.activeFont);
     this.setState({editorState})
   };
   this.toggleColor = (toggledColor) => this._toggleColor(toggledColor);
 }



 _onBoldClick(e) {
   e.preventDefault()
   this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
 }
 _onItalClick(e) {
   e.preventDefault()
   this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'));
 }
 _onUnderClick(e) {
   e.preventDefault()
   this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'UNDERLINE'));
 }
 _onLeftClick(e) {
   e.preventDefault()
   this.onChange(console.log(this));
 }
 _onCenterClick(e) {
   e.preventDefault()
   this.onChange(this.setState({
     textAlignment: 'center'
   }));
 }
 _onRightClick(e) {
   e.preventDefault()
   this.onChange(this.setState({
     textAlignment: 'right'
   }));
 }

 handleText(e) {
   this.setState({
     colorHex: e.target.value
   })
   console.log(this.state.colorHex)
 }


 /*_toggleList() {
   const {editorState} = this.state;
   const selection = editorState.getSelection();

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
 }*/

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

 render() {
   const {editorState} = this.state;
   return (
     <div style={styles.root}>


       <button onMouseDown={(e) => this._onBoldClick(e)}>BOLD</button>
       <button onMouseDown={(e) => this._onItalClick(e)}>ITALICS</button>
       <button onMouseDown={(e) => this._onUnderClick(e)}>UNDERLINE</button>
       <button onMouseDown={(e) => this._onLeftClick(e)}>Left</button>
       <button onMouseDown={(e) => this._onCenterClick(e)}>Center</button>
       <button onMouseDown={(e) => this._onRightClick(e)}>Right</button>
       {/*<ColorMenu />*/}

       <TextField
           id="with-placeholder"
           label="With placeholder"
           placeholder="Color Hex Value"
           className='colorHex'
           onChange={(events) => this.handleText(events)}
         />

         <div>
         <FontPicker
          apiKey="AIzaSyAEJbLvfLVpSM2CB66g_K4iOLjospEG_rY"
          activeFont={this.state.activeFont}
          onChange={nextFont => this.setState({ activeFont: nextFont.family })}
        />
        <p className="apply-font">
          The font will be applied to this text.
        </p>
        {console.log(this.state.activeFont)}
      </div>



       <ColorControls
         editorState={editorState}
         onToggle={this.toggleColor}
       />
       <div style={styles.editor} onClick={this.focus}>
         <Editor
           customStyleMap={colorStyleMap}
           editorState={editorState}
           onChange={this.onChange}
           placeholder="Write something colorful..."
           ref="editor"
           className="apply-font"
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
 let style;
 if (this.props.active) {
   style = {...styles.styleButton, ...colorStyleMap[this.props.style]};
 } else {
   style = styles.styleButton;
 }

 return (
   <span style={style} onMouseDown={this.onToggle}>
     {this.props.label}
   </span>
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
return (
 <div style={styles.controls}>
   {COLORARR.map(type =>
     <StyleButton
       active={currentStyle.has(type.style)}
       label={type.label}
       onToggle={props.onToggle}
       style={type.style}
     />
   )}
 </div>
);
};

// This object provides the styling information for our custom color
// styles.
const colorStyleMap = {
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
 minHeight: 400,
 paddingTop: 20,
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
};
