import React, { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import {
  Form,
  Field,
  SubmitButton,
  FluentTextFieldAutoComplete,
  FluentButton,
  useAxiosGet,
  useUser,
  useHandleAxiosSnackbar,
  apiMutate
} from 'unity-fluent-library';
import axios from 'axios';
import { Box, TextField } from '@material-ui/core'
import RichTextEditor from '../../UI/RichTextEditor';
import { Stack } from '@mui/material';
import { AttachIcon, SaveIcon, DownloadIcon, SendIcon } from '@fluentui/react-icons';
import AltSubmitButton from '../../utils/AltSubmitButton';
import { handleError } from '@apollo/client/link/http/parseAndCheckHttpResponse';
const MinutesCorrespondence = (props) => {
  const {
    correspondence,
    meeting,
    attendees,
    refetchCorrespondence,
    type,
  } = props;

  const { handleErrorSnackbar, handleSuccessSnackbar } = useHandleAxiosSnackbar();
  const formRef = useRef();
  const emptyHtmlContent = '<p></p>\n';
  const [comments, setComments] = useState(emptyHtmlContent);
  const user = useUser();
  const [reviewAttachmentId, setReviewAttachmentId] = useState(0);
  const [minutesAttachmentId, setMinutesAttachmentId] = useState(0);

  const [{ data: tenantUsers }, refetchTenantUsers] = useAxiosGet(
    process.env.REACT_APP_SECURITY_API_BASE,
    `users?tenantId=${user?.currentTenantId}&includeOnlyActiveTenants=true`,
    {},
    !!!user?.id
  );

  useEffect(() => {
    if (correspondence) {
      setReviewAttachmentId(correspondence.review.correspondence?.id);
      setMinutesAttachmentId(correspondence.minutes.correspondence?.id);

      if (type === "Review") {
        setComments(correspondence.review.correspondence?.comments);
      }
      else if (type === "Minutes") {
        setComments(correspondence.minutes.correspondence?.comments);
      }
    }
  }, [correspondence, type]);

  const submitCorrespondence = useCallback(
    async request =>
      await apiMutate(
        process.env.REACT_APP_PRODUCTIVITY_API_BASE,
        `cpsmeeting_attachment/meeting/${meeting.id}/${type}`,
        {
          method: 'PATCH',
        },
        { data: request }
      ),
    [meeting, type]
  );

  const postAttachmentCcs = useCallback(
    async emails =>
      await apiMutate(
        process.env.REACT_APP_PRODUCTIVITY_API_BASE,
        `cpsmeeting_attachment_cc/meeting-attachment/${type === "Review" ? reviewAttachmentId : minutesAttachmentId}/PostMultiple`,
        {
          method: 'POST',
        },
        { data: emails }
      ),
    [reviewAttachmentId, minutesAttachmentId, type]
  );

  const deleteAttachmentCcs = useCallback(
    async emails =>
      await apiMutate(
        process.env.REACT_APP_PRODUCTIVITY_API_BASE,
        `cpsmeeting_attachment_cc/meeting-attachment/${type === "Review" ? reviewAttachmentId : minutesAttachmentId}/DeleteMultiple`,
        {
          method: 'DELETE',
        },
        { data: emails }
      ),
    [minutesAttachmentId, reviewAttachmentId, type]
  );

  const ccsToUpdate = () => {
    let formValues = formRef.current.values;
    let ccsToAdd = [];
    let ccsToDelete = [];

    if (type == "Review") {
      ccsToAdd = formValues.cc.filter(r => !correspondence.review.ccRecipients.includes(r));
      ccsToDelete = correspondence?.review?.ccRecipients?.filter(r => !formValues.cc.includes(r));

    } else if (type == "Minutes") {
      ccsToAdd = formValues.cc.filter(r => !correspondence.minutes.ccRecipients.includes(r));
      ccsToDelete = correspondence.minutes.ccRecipients.filter(r => !formValues.cc.includes(r));
    }

    return { ccsToAdd, ccsToDelete };
  };

  const postCcs = async (ccsToAdd) => {
    const response = await postAttachmentCcs(ccsToAdd).catch(res => {
      handleErrorSnackbar("", "Error Adding Ccs")
    });
    if (response?.status === 201) {
      handleSuccessSnackbar('Successlly Added Ccs')
    }
  };

  const deleteCcs = async (ccsToDelete) => {
    const response = await deleteAttachmentCcs(ccsToDelete).catch(res => {
      handleErrorSnackbar("", 'Error Deleting Ccs')
    });
    if (response?.status === 204) {
      handleSuccessSnackbar('Successfully Deleted Ccs')
    }
  };

  const handleOnSubmit = useCallback(async (values) => {
    const { ccsToAdd, ccsToDelete } = ccsToUpdate();

    if (values.action === "save") {
      if (ccsToAdd.length) {
        postCcs(ccsToAdd);
      }
      if (ccsToDelete.length) {
        deleteCcs(ccsToDelete);
      }

      let request = {
        "CCRecipients": values.cc,
        "MeetingAttachment": {
          "comments": comments,
          "name": values.PDFFilename,
          "type": type === "Review" ? "Review" : "Minutes"
        },
        "recipients": values.recipients
      }
      const response = await submitCorrespondence(request).catch(res => {
        handleErrorSnackbar("", 'Error Saving Correspondence')
      });
      if (response?.status === 200) {
        handleSuccessSnackbar('Successfully Saved Correspondence')
      }

      refetchCorrespondence();

    } else if (values.action === "download") {
      handleDownloadPdf(values);

    } else if (values.action === "send") {
    }
    refetchCorrespondence();
  });

  const handleOnChange = useCallback(content => {
    setComments(content);
  }, []);

  const PDFFilename = useMemo(() => {
    if (correspondence && meeting) {
      return `${meeting.title} Meeting - ${type === "Review" ? 'Draft' : 'Final'} Minutes`;
    }
    return '';
  }, [correspondence, meeting, type]);

  const recipients = useMemo(() => {
    if (correspondence) {
      if (type === "Review") {
        return correspondence.review.recipients;
      }
      else if (type === "Minutes") {
        return correspondence.minutes.recipients;
      }
    }
    return [];
  }, [correspondence, type]);

  const ccRecipients = useMemo(() => {
    if (correspondence) {
      if (type === "Review") {
        return correspondence.review.ccRecipients;
      } else if (type === "Minutes") {
        return correspondence.minutes.ccRecipients;
      }
    }
    return [];
  }, [correspondence, type]);

  const downloadPdf = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_PRODUCTIVITY_API_BASE}/CpsCorrespondence_action/createpdf`, {
        responseType: 'blob'
      });

      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', PDFFilename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading the file:', error);
    }
  };

  const handleDownloadPdf = async (values) => {
    try {
      const response = await apiMutate(process.env.REACT_APP_PRODUCTIVITY_API_BASE,
        'CpsCorrespondence_action/createpdf',
        {
          responseType: 'blob',
          method: 'get'
        })

      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', values.PDF_filename + ".pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading the file:', error);
    }
  }

  return (
    <Box>
      <Form onSubmit={handleOnSubmit} ref={formRef}>
        <Field
          component={TextField}
          label='PDF Filename'
          name='PDF_filename'
          id='PDF Filename'
          initialValue={PDFFilename}
          required
        />
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", alignItems: 'center', marginBottom: '1rem' }}>
          <Field
            component={FluentTextFieldAutoComplete}
            label='Recipients'
            name='recipients'
            options={attendees}
            id="recipients"
            optionKey="name"
            initialValue={recipients}
            size='medium'
            isMultiple
            variant="outlined"
            fullWidth
          />
          <Field
            component={FluentTextFieldAutoComplete}
            label='CC'
            name='cc'
            options={tenantUsers ? tenantUsers.map(tu => tu.email) : ''}
            id="cc"
            optionKey=''
            initialValue={ccRecipients}
            size='medium'
            isMultiple
            variant="outlined"
            fullWidth
          />
        </Box>
        <RichTextEditor
          onChange={handleOnChange}
          comments={comments}
        // setComments={setComments}
        />
        <Box display='flex' justifyContent='space-between' alignItems='center' marginTop='15px' marginRight='auto'>
          <FluentButton
            // onClick={handleIncludeAttachments} 
            marginRight='auto'
            variant='outlined'
            color='secondary'
          >
            <span style={{ padding: '10px' }}>Include Attachments</span>
            <AttachIcon />
          </FluentButton>
          <Stack display='flex' direction='row' marginLeft='auto' gap='15px'>
            <AltSubmitButton
              name='action'
              value='save'
              variant='outlined'
              disablePristine={false}
              size='small'
            >
              <span style={{ paddingLeft: '10px', paddingRight: '10px' }}>Save</span>
              <SaveIcon />
            </AltSubmitButton>
            <AltSubmitButton
              name='action'
              value='download'
              variant='outlined'
              disablePristine={false}
              size='small'
            >
              <span style={{ paddingLeft: '10px', paddingRight: '10px' }}>Download Minutes in PDF</span>
              <DownloadIcon />
            </AltSubmitButton>
            <SubmitButton
              name='action'
              value='send'
              variant='outlined'
              size='large'
            >
              <span style={{ padding: '10px' }}>Send Email</span>
              <SendIcon />
            </SubmitButton>
          </Stack>
        </Box>
      </Form>
    </Box>
  );
};

export default MinutesCorrespondence;