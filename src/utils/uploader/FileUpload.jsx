import React, { useRef, useState, useEffect } from 'react';
import {
  makeStyles,
  Typography,
  Card,
  CardContent,
  Divider,
} from '@material-ui/core';
import { FileType } from './FileType';
import { FluentButton } from 'unity-fluent-library';

const useStyles = makeStyles(theme => ({
  avatarImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    border: '3px solid',
    borderColor: theme.palette.primary.main,
    marginTop: -3,
    marginLeft: -3,
  },
  image: {
    width: 300,
    height: '100%',
    border: '2px solid',
    borderColor: theme.palette.primary.main,
    marginTop: -3,
    marginLeft: -3,
  },
  instruction: {
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center',
  },
  icon: {
    display: 'flex',
    justifyContent: 'center',
  },
  avatarIcon: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '35%',
  },
  previewCard: {
    maxWidth: 500,
  },
  action: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    display: 'flex',
    flexDirection: 'row',
  },
  divider: {
    marginTop: theme.spacing(1),
  },
  initialInstruction: {
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(0.5),
  },
}));

const FileUpload = props => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);
  const [fileType, setFileType] = useState();
  const [fileName, setFileName] = useState();
  const [fileSize, setFileSize] = useState();
  const [fileDate, setFileDate] = useState();
  const { id, onInput, accept, errorText } = props;
  const classes = useStyles();

  const filePickerRef = useRef();
  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedHandler = event => {
    let pickedFile = event.target.files[0];
    let fileIsValid = isValid;
    setFileName(event.target.files[0].name);
    setFileSize(event.target.files[0].size);
    const str = event.target.files[0].name.split('.')[1];
    setFileType(str);
    if (event.target.files && event.target.files.length === 1) {
      const pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    onInput(id, pickedFile, fileIsValid);
  };

  const pickFileHandler = () => {
    filePickerRef.current.click();
    if (file && file !== previewUrl) {
      reset();
    }
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const reset = () => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  };

  return (
    <Card className={classes.previewCard} variant="outlined">
      <CardContent>
        <div className={classes.formControl}>
          <input
            id={id}
            ref={filePickerRef}
            style={{ display: 'none' }}
            type="file"
            accept={accept}
            onChange={pickedHandler}
          />

          <div className={classes.imageUpload}>
            {!previewUrl && (
              <div className={classes.action}>
                <div className={classes.action}>
                  <FluentButton
                    type="button"
                    variant="contained"
                    color="secondary"
                    onClick={pickFileHandler}
                  >
                    Select File
                  </FluentButton>

                  <div className={classes.initialInstruction}>
                    <Typography variant="caption">
                      Click 'Select File' to upload a file from your computer
                    </Typography>
                  </div>
                </div>
              </div>
            )}

            {previewUrl && (
              <>
                <div className={classes.imagePreview}>
                  {/* {console.log('PREVIEW URL:', previewUrl)} */}
                  <FileType
                    fileType={fileType}
                    image={previewUrl}
                    fileName={fileName}
                    size={formatBytes(fileSize)}
                    lastModifiedDate={fileDate}
                  />
                </div>
                <div className={classes.divider}>
                  <Divider />
                </div>
              </>
            )}
          </div>
          {!isValid && <Typography>{errorText} </Typography>}
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUpload;
