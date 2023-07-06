import React, { useState, useCallback, useEffect } from 'react';
import { Paper, makeStyles } from '@material-ui/core';
/* import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg'; */
import Editor from 'tinymce/tinymce';


const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
  editor: {
    minHeight: props => (props.editorHeight ? props.editorHeight : 400),
    maxHeight: props => (props.editorHeight ? props.editorHeight : 400),
    borderTop: '1px solid #F1F1F1',
  },
  toolbar: {
    borderRadius: '0 !important',
    border: 'none !important',
  },
}));

const RichTextEditor = props => {
  /* const {
    onChange,
    initialContentState,
    placeholder,
    readOnly,
    selectedAction,
  } = props; */

  /* const [editorState, setEditorState] = useState(
    initialContentState
      ? EditorState.createWithContent(initialContentState)
      : EditorState.createEmpty()
  ); */
  /* const [action, setAction] = useState(null);
  const classes = useStyles(props);

  const handleOnChange = useCallback(
    editorState => {
      const content = editorState.getCurrentContent();
      onChange(content);
      setEditorState(editorState);
    },
    [onChange]
  );

  useEffect(() => {
    if (selectedAction !== action) {
      setAction(selectedAction);
      if (initialContentState) {
        setEditorState(EditorState.createWithContent(initialContentState));
      }
    }
  }, [initialContentState, selectedAction, action]); */

  return (
    <Editor
          apiKey="cqinompwgg3zoti9hi1hndfitrg7nx9q5aomc7bvwzrlh6qx"
          initialValue=""
          init={{
            branding: false,
            height: 400,
            menubar: true,
            plugins:
              "print preview paste searchreplace autolink directionality visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern",
            toolbar:
              "formatselect | bold italic underline strikethrough | forecolor backcolor blockquote | link image media | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | removeformat",
            image_advtab: true
          }}
          onChange={() => {}}
        />
  );
};

export default RichTextEditor;
