import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Paper, makeStyles } from '@material-ui/core';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RichTextEditor = props => {
  const {
    onChange,
    comments, 
    setComments,
  } = props;
  const [ value, setValue ] = useState('');
  const quillRef = useRef();
  const icons = ReactQuill.Quill.import('ui/icons'); 
  icons["undo"] = `<svg viewbox="0 0 18 18">
    <polygon class="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10"></polygon>
    <path class="ql-stroke" d="M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9"></path>
  </svg>`;
    icons["redo"] = `<svg viewbox="0 0 18 18">
    <polygon class="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10"></polygon>
    <path class="ql-stroke" d="M9.91,13.91A4.6,4.6,0,0,1,9,14a5,5,0,1,1,5-5"></path>
  </svg>`;


  const handleOnChange = useCallback(
    editorState => {
      // const content = editorState.getCurrentContent();
      onChange(editorState);
      // setEditorState(editorState);
      // setComments(editorState);
    }, 
    [onChange]
    );

  const handleUndo = () => {
    if (quillRef.current) {
      quillRef.current.getEditor().history.undo();
    }
  };

  const handleRedo = () => {
    if (quillRef.current) {
      quillRef.current.getEditor().history.redo();
    }
  }

  const formats = [
    'bold', 'italic', 'underline', 'strike',
    'heading', 'code-block', 'blockquote',
    'list', 'ordered', 'bullet', 'indent',
    'script', 'size', 'direction', 'code', 'font', 'header',
    // 'undo', 'redo',
  ];

  const fontSizes = ['8', '9', '10', '11', '12', '14', '16', '18', '24', '30', '36', '48', '60', '72', '96']

  const modules = {
    history: {
      userOnly: true,
    },
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }, 'blockquote', 'code-block'],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        ['undo', 'redo'],
      ],
      // handlers: {
      //   'undo': () => quillRef.current.getEditor().history.undo(),
      //   'redo': () => quillRef.current.getEditor().history.redo(),
      // }
    },
  };

  return(
    <div>   
      <ReactQuill
        theme="snow"
        // style={{ height: '20vh'}}
        value={comments}
        onChange={handleOnChange}
        formats={formats}
        modules={modules}
        ref={quillRef}
      />
     </div>
  );
};

export default RichTextEditor;
