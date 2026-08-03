"use client";

import SearchIcon from "@mui/icons-material/Search";

import {
  Autocomplete,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { LabPatientOrder } from "@/lib/mock/lab_data";


interface Props {

  search: string;

  patients: LabPatientOrder[];

  onSearchChange: (
    value: string
  ) => void;

  onSearch: () => void;

  disabled?: boolean;

}



export default function SearchPatient({

  search,

  patients,

  onSearchChange,

  onSearch,

  disabled = false,

}: Props) {


  return (

    <Paper

      elevation={2}

      sx={{
        p:3,
        borderRadius:3,
      }}

    >


      <Typography

        variant="h6"

        fontWeight={600}

        mb={2}

      >

        Search Patient

      </Typography>



      <Stack

        direction={{
          xs:"column",
          md:"row",
        }}

        spacing={2}

      >



        <Autocomplete


          fullWidth


          freeSolo


          disabled={disabled}


          size="small"


          options={patients}



          inputValue={search}



          onInputChange={(_,value)=>{

            if(!disabled){

              onSearchChange(value);

            }

          }}




          isOptionEqualToValue={

            (option,value)=>

              option.order.orderId ===
              value.order.orderId

          }





          getOptionLabel={(option)=>


            typeof option === "string"

              ? option

              :

              `${option.patient.name} - ${option.order.orderId}`


          }





          filterOptions={(options,state)=>{


            const value =
              state.inputValue
              .toLowerCase()
              .trim();



            if(!value)
              return options;



            return options.filter(

              (item)=>

                item.order.orderId
                .toLowerCase()
                .includes(value)


                ||

                item.patient.name
                .toLowerCase()
                .includes(value)


                ||

                item.patient.uhid
                .toLowerCase()
                .includes(value)


                ||

                item.sample.barcode
                .toLowerCase()
                .includes(value)


            );


          }}






          renderOption={(props,option)=>(


            <Box

              component="li"

              {...props}

            >


              <Box>


                <Typography

                  fontWeight={600}

                >

                  {option.patient.name}

                </Typography>




                <Typography

                  variant="caption"

                  color="text.secondary"

                >

                  Order ID:
                  {" "}
                  {option.order.orderId}

                </Typography>



                <br />



                <Typography

                  variant="caption"

                  color="text.secondary"

                >

                  UHID:
                  {" "}
                  {option.patient.uhid}

                </Typography>



                <br />



                <Typography

                  variant="caption"

                  color="text.secondary"

                >

                  Barcode:
                  {" "}
                  {option.sample.barcode || "-"}

                </Typography>


              </Box>


            </Box>


          )}




          renderInput={(params)=>(


            <TextField

              {...params}


              placeholder={

                disabled

                ? "Patient loaded from Order ID"

                : "Search by Order ID, Patient Name, UHID or Barcode"

              }


              size="small"


            />


          )}




          sx={{

            "& .MuiOutlinedInput-root":{

              height:38,

            },

          }}



        />





        <Button


          variant="contained"


          startIcon={<SearchIcon />}


          onClick={onSearch}


          disabled={disabled}




          sx={{

            minWidth:120,

            height:38,

            px:2,

            borderRadius:2,

            textTransform:"none",

            whiteSpace:"nowrap",

          }}



        >

          Search


        </Button>



      </Stack>


    </Paper>


  );

}