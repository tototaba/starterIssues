import React from 'react';
import FileProfile from './FileProfile';
import ImagePreview from './ImagePreview';

export const FileType = props => {
  let type = '';
  const { fileType, image, fileName, size, lastModifiedDate } = props;

  switch (fileType) {
    case 'pdf':
      type = (
        <FileProfile
          fileType={fileType}
          fileName={fileName}
          size={size}
          lastModifiedDate={lastModifiedDate}
        />
      );
      break;
    case 'doc':
      type = (
        <FileProfile
          fileType={fileType}
          fileName={fileName}
          size={size}
          lastModifiedDate={lastModifiedDate}
        />
      );
      break;
    case 'png':
      type = (
        <FileProfile
          fileType={fileType}
          fileName={fileName}
          size={size}
          lastModifiedDate={lastModifiedDate}
        >
          <ImagePreview image={image} />
        </FileProfile>
      );
      break;
    case 'jpg':
      type = (
        <FileProfile
          fileType={fileType}
          fileName={fileName}
          size={size}
          lastModifiedDate={lastModifiedDate}
        >
          <ImagePreview image={image} />
        </FileProfile>
      );
      break;
    case 'jpeg':
      type = (
        <FileProfile
          fileType={fileType}
          fileName={fileName}
          size={size}
          lastModifiedDate={lastModifiedDate}
        >
          <ImagePreview image={image} />
        </FileProfile>
      );
      break;

    default:
  }

  return type;
};
