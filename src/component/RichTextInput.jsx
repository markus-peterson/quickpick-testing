import React from 'react';
import { Component } from 'react';
import { stateToHTML } from 'draft-js-export-html';
import Draft from 'draft-js';
import '../css/RichEditor.css';
import '../css/RichText.css';
import '../css/Draft.css';
import { Grid, Divider} from '@material-ui/core/';

const { Editor, EditorState, RichUtils, getDefaultKeyBinding } = Draft;

export default class RichTextInput extends Component {
    constructor(props) {
        super(props);
        this.state = { editorState: EditorState.createEmpty() };

        this.focus = () => this.refs.editor.focus();
        this.onChange = (editorState) => {
            this.setState({ editorState })
            let html = stateToHTML(this.state.editorState.getCurrentContent());
            this.props.updateParent(html)
        };

        this.handleKeyCommand = this._handleKeyCommand.bind(this);
        this.mapKeyToEditorCommand = this._mapKeyToEditorCommand.bind(this);
        this.toggleBlockType = this._toggleBlockType.bind(this);
        this.toggleInlineStyle = this._toggleInlineStyle.bind(this);
        this.handleFinish = this.handleFinish.bind(this);
    }

    _handleKeyCommand(command, editorState) {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            this.onChange(newState);
            return true;
        }
        return false;
    }

    _mapKeyToEditorCommand(e) {
        if (e.keyCode === 9 /* TAB */) {
            const newEditorState = RichUtils.onTab(
                e,
                this.state.editorState,
                4, /* maxDepth */
            );
            if (newEditorState !== this.state.editorState) {
                this.onChange(newEditorState);
            }
            return;
        }
        return getDefaultKeyBinding(e);
    }

    _toggleBlockType(blockType) {
        this.onChange(
            RichUtils.toggleBlockType(
                this.state.editorState,
                blockType
            )
        );
    }

    _toggleInlineStyle(inlineStyle) {
        this.onChange(
            RichUtils.toggleInlineStyle(
                this.state.editorState,
                inlineStyle
            )
        );
    }
    handleFinish() {
        let html = stateToHTML(this.state.editorState.getCurrentContent());
        return html;
    }

    render() {
        const { editorState } = this.state;
        return (
            <div>
                <Grid container spacing={2}>
                    <Grid item container justify="center" alignItems="center">
                        <Grid item xs={4}>
                            <InlineStyleControls
                                editorState={editorState}
                                onToggle={this.toggleInlineStyle}
                            />
                        </Grid>
                        <Grid item xs={5}>
                            <BlockStyleControls
                                editorState={editorState}
                                onToggle={this.toggleBlockType}
                            />
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Divider />
                    </Grid>
                    <Grid item xs={12}>
                        <Editor
                            blockStyleFn={getBlockStyle}
                            customStyleMap={styleMap}
                            editorState={editorState}
                            handleKeyCommand={this.handleKeyCommand}
                            keyBindingFn={this.mapKeyToEditorCommand}
                            onChange={this.onChange}
                            placeholder="Enter job description..."
                            ref="editor"
                            spellCheck={true}
                        />
                    </Grid>
                </Grid>
            </div>
        );
    }
}
const styleMap = {
    CODE: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
        fontSize: 16,
        padding: 2,
    },
};

function getBlockStyle(block) {
    switch (block.getType()) {
        case 'blockquote': return 'RichEditor-blockquote';
        default: return null;
    }
}

class StyleButton extends React.Component {
    constructor() {
        super();
        this.onToggle = (e) => {
            e.preventDefault();
            this.props.onToggle(this.props.style);
        };
    }

    render() {
        let className = 'RichEditor-styleButton';
        if (this.props.active) {
            className += ' RichEditor-activeButton';
        }

        return (
            <span className={className} onMouseDown={this.onToggle}>
                {this.props.label}
            </span>
        );
    }
}

const BLOCK_TYPES = [
    { label: 'H1', style: 'header-two' },
    { label: 'H2', style: 'header-three' },
    { label: 'H3', style: 'header-four' },
    { label: 'Blockquote', style: 'blockquote' },
    { label: 'UL', style: 'unordered-list-item' },
    { label: 'OL', style: 'ordered-list-item' },
    { label: 'Code Block', style: 'code-block' },
];

const BlockStyleControls = (props) => {
    const { editorState } = props;
    const selection = editorState.getSelection();
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();

    return (
        <div className="RichEditor-controls">
            {BLOCK_TYPES.map((type) =>
                <StyleButton
                    key={type.label}
                    active={type.style === blockType}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            )}
        </div>
    );
};

var INLINE_STYLES = [
    { label: 'Bold', style: 'BOLD' },
    { label: 'Italic', style: 'ITALIC' },
    { label: 'Underline', style: 'UNDERLINE' },
    { label: 'Monospace', style: 'CODE' },
];

const InlineStyleControls = (props) => {
    const currentStyle = props.editorState.getCurrentInlineStyle();

    return (
        <div className="RichEditor-controls">
            {INLINE_STYLES.map((type) =>
                <StyleButton
                    key={type.label}
                    active={currentStyle.has(type.style)}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            )}
        </div>
    );
};