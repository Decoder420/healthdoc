"use client";

import {
  Paper,
  Stack,
  TextField,
  MenuItem,
  InputAdornment,
  Button,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";

import type { SearchToolbarProps } from "./types";


export default function SearchToolbar({

  search,
  status,
  date,

  onSearchChange,
  onStatusChange,
  onDateChange,

  onRefresh,
  onExport,

  actions,

}: SearchToolbarProps) {


return (

<Paper

elevation={0}

sx={{

p:2,

mt:3,

borderRadius:3,

border:"1px solid",

borderColor:"divider",

}}

>


<Stack

direction={{

xs:"column",

lg:"row"

}}

spacing={2}

alignItems="center"

>


<Stack

direction={{

xs:"column",

sm:"row"

}}

spacing={2}

flex={1}

width="100%"

>


{/* Search */}

<TextField

fullWidth

size="small"

placeholder="Search Patient, UHID or Accession No."

value={search}

onChange={(e)=>
onSearchChange(e.target.value)
}

InputProps={{

startAdornment:(

<InputAdornment position="start">

<SearchIcon fontSize="small"/>

</InputAdornment>

)

}}

sx={{

"& .MuiOutlinedInput-root":{

height:40,

}

}}

/>





{/* Status */}

<TextField

select

size="small"

label="Status"

value={status}

onChange={(e)=>
onStatusChange(e.target.value)
}

sx={{

width:{

xs:"100%",

sm:160

},

"& .MuiOutlinedInput-root":{

height:40,

}

}}

>


<MenuItem value="ALL">
All Status
</MenuItem>


<MenuItem value="PROCESSING">
Processing
</MenuItem>


<MenuItem value="VERIFIED">
Verified
</MenuItem>


</TextField>





{/* Date */}

<TextField

type="date"

size="small"

label="Study Date"

value={date}

onChange={(e)=>
  onDateChange(e.target.value)
}

InputLabelProps={{
  shrink:true,
}}

inputProps={{
  max: new Date()
    .toISOString()
    .split("T")[0],
}}

sx={{
  width:{
    xs:"100%",
    sm:170
  },

  "& .MuiOutlinedInput-root":{
    height:40,
  }
}}

/>


</Stack>





{/* Buttons */}

<Stack

direction="row"

spacing={1.5}

flexWrap="wrap"

>


<Button

variant="outlined"

startIcon={
<RefreshOutlinedIcon/>
}

onClick={onRefresh}

sx={{

height:40,

borderRadius:2,

textTransform:"none",

}}

>

Refresh

</Button>





<Button

variant="contained"

startIcon={
<FileUploadOutlinedIcon/>
}

onClick={onExport}

sx={{

height:40,

borderRadius:2,

textTransform:"none",

}}

>

Export

</Button>



{actions}


</Stack>



</Stack>


</Paper>

);


}