import React, { useState } from 'react';
import { makeStyles, CardContent } from '@material-ui/core';
import {
  OpenPage,
  SapFlexibleTemplate,
  FluentButton,
  UtilityTabHeader,
  SubHeaderAction,
  InfoCard,
} from 'unity-fluent-library';

const useStyles = makeStyles(theme => ({
  root: {},
}));

const TestShell = props => {
  const classes = useStyles();

  const [value, setValue] = useState(0);

  const tabList = [
    { label: 'Messages', child: 'Item One' },
    { label: 'Notes', child: 'Item Two' },
    { label: 'Other', child: 'Item Three' },
    { label: 'Again', child: 'Item Four' },
  ];

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // const TabPanel = props => {
  //   const { children, value, index, ...other } = props;

  //   return (
  //     <div
  //       role="tabpanel"
  //       hidden={value !== index}
  //       id={`simple-tabpanel-${index}`}
  //       aria-labelledby={`simple-tab-${index}`}
  //       {...other}
  //     >
  //       {value === index && (
  //         <div>
  //           <div> {children}</div>
  //         </div>
  //       )}
  //     </div>
  //   );
  // };

  const templateOne = (
    <SapFlexibleTemplate
      left={
        <CardContent>
          <FluentButton variant="contained" color="secondary">
            Test Button
          </FluentButton>
          {/* <FluentTextField label="Test field" /> */}
        </CardContent>
      }
      center={
        <CardContent>
          <InfoCard title="Test title" headerComponent="h2">
            This is info
          </InfoCard>
        </CardContent>
      }
      right={<CardContent>Content</CardContent>}
    />
  );

  return (
    <OpenPage className={classes.root}>
      {/* <TabPanel aria-label="abc" value={value} index={0}>
        Empty
      </TabPanel>
      <TabPanel value={value} index={1}>
        {templateOne}
      </TabPanel> */}
      {templateOne}
      <SubHeaderAction>
        <div style={{ marginTop: 26 }}>
          <UtilityTabHeader
            handleChange={handleChange}
            value={value}
            tabList={tabList}
          />
        </div>
      </SubHeaderAction>
    </OpenPage>
  );
};
export default TestShell;
