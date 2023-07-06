import React, {useCallback, useState, useRef} from 'react';
import {
  OpenPage,
  PrimaryActionHeader,
  SubHeaderAction,
  SideSheet,
  AmbientCard,
  FluentSearchField,
  FluentTextField,
  FluentDialog,
  AgTable,
  useAgGridApi,
} from 'unity-fluent-library';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import TextField from '@mui/material/TextField';
import RichTextEditor from './RichTextEditor';
import ReactQuill, { Quill } from 'react-quill';
import "react-quill/dist/quill.snow.css";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';

import { AssemblyRecord, SubassemblyRecord } from '../../../api/models';
import { BasePage, BasePageProps, CreateEditPageProps } from '../base';
import { mockGridOptions, mockRowData } from '../../../mockData/mockData';

export interface ConstructionUnitsViewProps<RecordType>
  extends Pick<
  BasePageProps<RecordType>,
  'getData' | 'deleteItem' | 'renderSubHeaderActions'
  > {
  name: string;
  fetchPath: string;
  createEditPage: React.ComponentType<CreateEditPageProps<RecordType>>;
}

const CorrespondenceView = <
  RecordType extends AssemblyRecord | SubassemblyRecord
>({
  name,
  fetchPath,
  getData,
  deleteItem,
  createEditPage,
  renderSubHeaderActions,
}: ConstructionUnitsViewProps<RecordType>) => {
    const [value, setValue] = React.useState('1');


  /* const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  }; */
  const [text,setText] = useState('');
  const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  'Brad Atchison',
  'Liam Atchison',
  'Ayaan Shirazi',
  'Camilus Kung',
  'Samantha Hayes',
  'Julia Yiu',
  'Vanshree Mathur',
];

function getStyles(name: any, personName: any, theme: any) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}
    
    const handleChange= (html: any)=> {
        setText(html);
    }
    const reactQuillRef = useRef<ReactQuill>(null);
    const TOOLBAR_OPTIONS = [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike", "blockquote", "link"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        ["emoji"],
        ["clean"]
      ];
    /* const modules = {
        toolbar: {
            container: "#toolbar",
        }
    } */
    const formats = [
      'font','size',
      'bold','italic','underline','strike',
      'color','background',
      'script',
      'header','blockquote','code-block',
      'indent','list',
      'direction','align',
      'link','image','video','formula',
    ]
    const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);

  const handleNewChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const currencies = [
    {
      value: 'ayaan',
      label: 'Ayaan Shirazi',
    },
    {
      value: 'brad',
      label: 'Brad',
    },
    {
      value: 'samantha',
      label: 'Samantha',
    },
    {
      value: 'julia',
      label: 'Julia',
    },
  ];

  const fileInput = React.useRef();
  return (

    <Box sx={{ width: '100%', typography: 'body1' }}>
    <TabContext value={value}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <TabList onChange={handleChange} aria-label="lab API tabs example">
          <Tab label="DRAFT MINUTES CORRESPONDENCE" value="1" />
          <Tab label="FINAL MINUTES CORRESPONDENCE" value="2" />
        </TabList>
      </Box>
      <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '50ch' },
      }}
      noValidate
      autoComplete="off"
    >
      <TabPanel value="1">
      <Box sx={{display: 'flex', flexWrap: 'wrap'}}>
            <TextField
            sx={{ m: 1, width: '50ch' }}
                fullWidth
                required
                id="fullWidth"
                label="PDF Filename"
                defaultValue="Univerus Meeting Group - Draft Minutes"
            />
          </Box>
          <br/>
          <div>
          <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-chip-label">Recipents</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={personName}
          onChange={handleNewChange}
          input={<OutlinedInput id="select-multiple-chip" label="Recipents" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {names.map((name) => (
            <MenuItem
              key={name}
              value={name}
              style={getStyles(name, personName, theme)}
            >
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
            <TextField
                required
                fullWidth
                id="outlined-required"
                label="CC"
                defaultValue=""
            />
          </div>
          <br/>
          <div>
          <ReactQuill
           ref={reactQuillRef}
            value={text}
            theme="snow"
            onChange={handleChange}
            modules={{
                toolbar: {
                  container: TOOLBAR_OPTIONS
                }
              }}
            formats={formats}
          />
          </div>
          <br/>
          <Stack spacing={2} direction="row">
            <Button variant="contained">Save</Button>
            <Button variant="outlined">Download Minutes PDF</Button>
            <Button variant="contained" disabled>Send Mail</Button>
          </Stack>
          <br/>
          <div>
          <p>Mail Attachments:</p>
          <Button
            variant="contained"
            component="label"
          >
            Select File
            <input
              type="file"
              hidden
            />
          </Button>
          <p>These files will be included with meeting review and minutes</p>

          </div>
          
          
            
      </TabPanel>
      </Box>

      <TabPanel value="2">
          Item Two
      </TabPanel>

    </TabContext>
  </Box>
    // <BasePage<RecordType>
    //   title={name}
    //   fetchPath={fetchPath}
    //   getData={getData}
    //   deleteItem={deleteItem}
    //   createEditPage={createEditPage}
    //   columnDefs={({ getActionsColumnDef }) => [
    //     { field: 'code', headerName: '#' },
    //     { field: 'description', headerName: 'Itemsss' },
    //     { field: 'listCode', headerName: 'Due Date' },
    //     { field: 'listCode', headerName: 'Priority' },
    //     { field: 'listCode', headerName: 'Draft Sent' },
    //     { field: 'listCode', headerName: 'Final Sent' },
    //     { field: 'listCode', headerName: 'Actions' },
    //     /* { field: 'id', ...getActionsColumnDef() }, */
    //   ]}
    //   renderSubHeaderActions={renderSubHeaderActions}
    // />
  );
};

export default CorrespondenceView;
