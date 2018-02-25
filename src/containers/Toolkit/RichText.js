import React, { Component } from 'react'
import ReactQuill from 'react-quill'
// import '../Toolkit/RichText.css'
import styles from './RichText.css';
import '../../../node_modules/react-quill/dist/quill.snow.css';

export default class RichText extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            text: ''
        }
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(value) {
        // console.log(value)
        const { callback } = this.props
        callback(value)
        this.setState({ text: value })
    }

    modules = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],       // toggled buttons
            ['blockquote', 'code-block'],                    // blocks
            [{ 'header': 1 }, { 'header': 2 }],              // custom button values
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],    // lists
            [{ 'script': 'sub' }, { 'script': 'super' }],     // superscript/subscript
            [{ 'indent': '-1' }, { 'indent': '+1' }],         // outdent/indent
            [{ 'direction': 'rtl' }],                        // text direction
            [{ 'size': ['small', false, 'large', 'huge', '20px'] }], // custom dropdown
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],       // header dropdown
            [{ 'color': [] }, { 'background': [] }],         // dropdown with defaults
            [{ 'font': [] }],                                // font family
            [{ 'align': [] }],                               // text align
            ['link'],                                       //链接
            ['clean'],                                       // remove formatting
        ]
    }

    formats = [
        'header', 'font', 'background', 'color', 'code', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent', 'script', 'align', 'direction',
        'link', 'image', 'code-block', 'formula', 'video'
    ]

    componentWillMount() {
        this.props
        this.setState({ text: this.props.value })
    }

    componentDidMount() {
        // let toolbar = document.getElementsByClassName('ql-toolbar')[0]
        // if (toolbar) {
        //     const { style } = this.props
        //     const left = style.get('left')
        //     toolbar.style.left = '-' + left + 'px'
        // }
        // const { rid } = this.props
        // let editor = document.getElementById(rid).querySelector('.ql-editor')
        // if (editor) {
        //     // editor.contentEditable = false
        // }

        // this.refs.rich.onClick  =function(a){
        //     a
        // }


        // this.refs.aa.getDOMNode().on('click',function(){
        //     alert(1)
        // })

        //  this.refs.aa.onClick =function(aa){
        // aa
        //  }

    }

    componentWillUpdate() {
        const { style, rid } = this.props
        let toolbar = document.getElementById(rid).querySelector('.ql-toolbar')
        if (toolbar) {
            const left = style.get('left')
            toolbar.style.left = '-' + left + 'px'
        }
    }

    render() {
        const { style } = this.props
        const width = style.get('width')
        const height = style.get('height')
        const top = style.get('top')
        const left = style.get('left')
        return (


            <ReactQuill ref='rich' className={styles.richText} theme="snow" placeholder={'双击修改文本'} modules={this.modules} formats={this.formats}
                onChange={this.handleChange} value={this.state.text}>
                {/*<div className={`my-editing-area ${styles.richEditor}`} />*/}
                <div className={`my-editing-area ${styles.richEditor}`} style={{ width: width, height: height }} />

            </ReactQuill>
        )
    }
}

/*export default class RichText extends React.Component {
    constructor(props) {
        super(props)
        this.state = { editorHtml: '', mountedEditor: false }
        this.quillRef = null;
        this.reactQuillRef = null;
        this.handleChange = this.handleChange.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.attachQuillRefs = this.attachQuillRefs.bind(this);
    }

    modules = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],       // toggled buttons
            ['blockquote', 'code-block'],                    // blocks
            [{ 'header': 1 }, { 'header': 2 }],              // custom button values
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],    // lists
            [{ 'script': 'sub' }, { 'script': 'super' }],     // superscript/subscript
            [{ 'indent': '-1' }, { 'indent': '+1' }],         // outdent/indent
            [{ 'direction': 'rtl' }],                        // text direction
            [{ 'size': ['small', false, 'large', 'huge'] }], // custom dropdown
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],       // header dropdown
            [{ 'color': [] }, { 'background': [] }],         // dropdown with defaults
            [{ 'font': [] }],                                // font family
            [{ 'align': [] }],                               // text align
            ['clean'],                                       // remove formatting
        ]
    }

    
    
    formats = [
        'header', 'font', 'background', 'color', 'code', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent', 'script', 'align', 'direction',
        'link', 'image', 'code-block', 'formula', 'video'
    ]


    componentDidMount() {
        this.attachQuillRefs()
    }

    componentDidUpdate() {
        this.attachQuillRefs()
    }



    attachQuillRefs() {
        // Ensure React-Quill reference is available:
        if (typeof this.reactQuillRef.getEditor !== 'function') return;
        // Skip if Quill reference is defined:
        if (this.quillRef != null) return;

        const quillRef = this.reactQuillRef.getEditor();
        if (quillRef != null) this.quillRef = quillRef;
    }

    handleClick() {
        var range = this.quillRef.getSelection();
        let position = range ? range.index : 0;
        this.quillRef.insertText(position, 'Hello, World! ')
    }

    handleChange(html) {
        this.setState({ editorHtml: html });
    }

    render() {
        return (
            <div>
                <ReactQuill
                    ref={(el) => { this.reactQuillRef = el }}
                    theme={'snow'}
                    onChange={this.handleChange}
                    modules={this.modules}
                    formats={this.formats}
                    placeholder={this.props.placeholder} />
                <button onClick={this.handleClick}>Insert Text</button>
            </div>
        )
    }
}*/


