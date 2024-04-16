import { EditIcon } from '@fluentui/react-icons';
import { Box, LinearProgress } from '@material-ui/core';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  SideSheet,
  apiMutate,
  useHandleAxiosSnackbar,
  FluentTextField,
  FluentCard,
  DragDropFileUpload,
  FluentButton,
} from 'unity-fluent-library';
import Markdown from 'react-markdown';

const SummaryTab = ({
  meeting,
  meetingId,
  refetchMeeting,
  summarySidesheetOpen,
  setSummarySidesheetOpen
}) => {

  const [meetingSummaryMarkdown, setMeetingSummaryMarkdown] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { handleErrorSnackbar, handleSuccessSnackbar } = useHandleAxiosSnackbar();
  const processingSummaryKey = '--processing--'

  // sidesheet helper
  const onClose = () => {
    setSummarySidesheetOpen(false);
  };

  useEffect(() => {
    if (meeting.summary == processingSummaryKey) {
      setIsLoading(true)
      setTimeout(() => refetchMeeting(), 2000); // check the status every 2 seconds   
    } else if (meeting.summary) {
      setMeetingSummaryMarkdown(meeting.summary);
      setIsLoading(false)
    } else{
      setIsLoading(false)
    }
  }, [meeting]);

  // CALLS AIGLE API DIRECTLY
  const executeTranscriptSummaryAPI = useCallback(
    async data =>
      await apiMutate(
        process.env.REACT_APP_AIGLE_API_BASE,
        `mstranscript/gettranscriptsummary`,
        {
          method: 'post',
        },
        data
      ),
    []
  );

  // CALLS MM API DIRECTLY 
  const executeTranscriptSummaryAPIInternal = useCallback(
    async data =>
      await apiMutate(
        process.env.REACT_APP_MEETING_MINUTES_API_BASE,
        `cpsmeeting/${meetingId}/transcriptsummary`,
        {
          method: 'post',
        },
        data
      ),
    []
  );


  // update the summary field in meeting table
  const executeUpdateQuery = useCallback(async data => {
    return await apiMutate(
      process.env.REACT_APP_MEETING_MINUTES_API_BASE,
      `cpsmeeting/${meetingId}`,
      {
        method: 'PUT',
      },
      data
    );
  }, []);


  const handleUploadFile = async (files) => {
    try {
      setIsLoading(true);

      let vttFile = null;  
      let txtFile = null;  

      // Loop through the files and assign them based on their extension  
      for (const file of files) {  
        const extension = file.name.split('.').pop().toLowerCase();  
        if (extension === 'vtt' && !vttFile) {  
          vttFile = file;  
        } else if (extension === 'txt' && !txtFile) {  
          txtFile = file;  
        }  
      }

      if (!vttFile) {  
        handleErrorSnackbar("", 'Please upload a .vtt file');  
        setIsLoading(false);  
        return;  
      }  

      // // // ********************** USING AIGLE API DIRECTLY ***************  
      // // Create a new FormData object
      // const formData = new FormData();
      // formData.append('File', vttFile);
      // formData.append('URL', txtFile);
      // formData.append('meetingData', meeting)

      // const response = await executeTranscriptSummaryAPI({ data: formData }); // call AIGLE transcript API (NEED TO upload file to MM Backend)      
      // let summaryMarkdown = response.data.content;
      // setMeetingSummaryMarkdown(summaryMarkdown);
      // setIsLoading(false);
      // const response2 = await executeUpdateQuery({
      //   data: { ...meeting, summary: summaryMarkdown },
      // });     
        
      // ********************** USING BACKEND MM API ***************    
      const formData = new FormData();
      formData.append('File', vttFile);
      formData.append('URL', txtFile);
      formData.append('meetingRecord', JSON.stringify(meeting))
      meeting.summary = processingSummaryKey
      const response = await executeTranscriptSummaryAPIInternal({ data: formData }); // call MM transcript API 

      if (response.status !== 200) {   
        throw new Error('Error generating meeting summary.');  
      } else {  
        handleSuccessSnackbar('Meeting summary generated Successfully');  
        setIsLoading(false)
        refetchMeeting();  
      }  
             
    } catch (error) {
      handleErrorSnackbar("", error.message);
      setIsLoading(false);
    }
  };

  const handleSummaryUpdate = e => {
    setMeetingSummaryMarkdown(e.target.value);
  };

  const handleUpdateSummary = async () => {
    try {
      const response = await executeUpdateQuery({
        data: { ...meeting, summary: meetingSummaryMarkdown },
      });

      if (response?.status !== 204) {
        throw new Error('Failed to Updated Summary');
      } else {
        refetchMeeting();
        handleSuccessSnackbar('Successfully Updated Summary');
      }
    } catch (error) {
      handleErrorSnackbar('', error.message);
      console.log(error);
    }
  };

  return (
    <>
      <SideSheet
        width="700px"
        open={summarySidesheetOpen}
        title={'Meeting Summary'}
        onClose={() => {
          onClose();
          refetchMeeting();
        }}
        buttonLabel={'Update Summary'}
        onSubmit={() => {
          handleUpdateSummary();
        }}
        id={'udpRecord-EditSummarySidesheet-submit'}
        udprecordid={'udpRecord-EditSummarySidesheet-submit'}
      >
        <FluentTextField
          multiline
          minRows={30}
          value={meetingSummaryMarkdown}
          onChange={handleSummaryUpdate}
        ></FluentTextField>
      </SideSheet>

      <FluentCard style={{ padding: '3em 6em' }}>
        {meeting.summary && meeting.summary != processingSummaryKey ? (
          <Markdown>{meetingSummaryMarkdown}</Markdown>
        ) : isLoading ? (
          <div style={{margin: '2em auto'}}>
            Please wait. This may take a minute.
            <LinearProgress />
          </div>
        ) : 
        //   // TODO: THIS IS A PLACEHOLDER FOR FUTURE OUTLOOK INTEGRATION
        // meeting.outlookEventId ? (
        //   <div style={{display: "flex", flexDirection: "column"}}>
        //     <DragDropFileUpload
        //       handleUploadFile={handleUploadFile}
        //       multiple={true}
        //       minHeight={200}
        //       title={"Upload a meeting transcript file in .vtt format and an optional URL file in .txt format."}
        //     ></DragDropFileUpload>
        //     <div style={{margin: "2em auto" }}>OR</div>
        //     <FluentButton
        //       variant="contained"
        //       color="secondary"
        //       onClick={handleGenerateSummary}
        //       style={{ margin: 'auto' }}
        //     >
        //       Generate Meeting Summary From Outlook Event
        //     </FluentButton>
        //   </div>
        // ) 
        // : 
        (
          <DragDropFileUpload
            handleUploadFile={handleUploadFile}
            multiple={true}
            minHeight={200}
            title={"Upload a meeting transcript file in .vtt format and an optional URL file in .txt format."}
          ></DragDropFileUpload>
        )}
      </FluentCard>
    </>
  );
};

export default SummaryTab;
