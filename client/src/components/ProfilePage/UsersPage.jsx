import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  Box,
  Typography,
  Button,
} from "@mui/material";


const UsersPage = ({sessionData}) => {



    return (
      <Box sx={{ width: "85.3%", paddingBottom: 5, position: "absolute",border: 3,
      borderColor: "black",
      borderStyle: "dotted",
      left: "275.5px",
      height: "900px",
      borderLeft: 0,
      borderRight: 0,
      borderTop: 0,
      borderbottom: 0
      //make border top,right,bottom to 0 when done
       }}>

      <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            left: "275.5px",
            border: 3,
            borderTop: 0 ,
            borderRight: 0,
            borderLeft: 0 ,
            borderColor: "blue",
            borderStyle: "dotted",
            height: "175px"
          }}
        >
        
      <Typography
        variant="h4"
        sx={{
          position: "absolute",
          top: "10px",
          left: "30px",
          fontSize: "25px",
          fontWeight: "bolder",
          border: 3,
          borderColor: "purple",
          borderStyle: "dotted",
        }}
      >
        User Profile: SessionUSERNAME 
      </Typography>

      <Typography
        variant="h6"
        sx={{
          position: "absolute",
          top: "50px",
          left: "30px",
          fontSize: "18px",
          border: 3,
          borderColor: "red",
          borderStyle: "dotted",
        }}
      >
        Member for : TimeHERE
      </Typography>

      <Typography
        variant="h2"
        sx={{
          position: "absolute",
          top: "90px",
          left: "30px",
          fontSize: "15px",
          border: 3,
          borderColor: "red",
          borderStyle: "dotted",
        }}
      >
        Reptuation Score: ScoreHere
      </Typography>

      <Typography
        variant="h1"
        sx={{
          position: "absolute",
          top: "130px",
          left: "550px",
          fontSize: "18px",
          fontWeight: "bolder",
          border: 3,
          borderColor: "purple",
          borderStyle: "dotted",
        }}
      >
        All "Tags/Questions" created by "User"
      </Typography>
      </Box>
      <Table  sx={{ width: "100%" }}>
        <TableRow sx={{
                    borderBottom: 4,
                    borderTop: 4,
                    borderColor: "orange",
                    borderStyle: "dotted",
                  }}> 
          
          <TableCell
          sx={{
                    borderBottom: 4, //change this to 3 or 2 when done
                    borderRight: 4, //delete bottomright this once done 
                    borderColor: "yellow",
                    borderStyle: "dotted",
                    width: "65%"
                  }}>
          <Typography
                      /*onClick={() =>
                        handleQuestionTitleClick()
                      }*/
                      sx={{
                        cursor: "pointer",
                        color: "black",
                        fontSize: "large",
                      }}
                    >
                      LINK
                    </Typography>

          </TableCell>

          <TableCell
          sx={{
                    borderBottom: 4, //change this to 3 or 2 when done
                    borderRight: 4, //delete bottomright this once done 
                    borderColor: "green",
                    borderStyle: "dotted",
                    width: "17.5%"
                  }}>
          <Typography
                      /*onClick={() =>
                        handleDeleteClick()
                      }*/
                      sx={{
                        color: "red",
                        fontSize: "medium",
                      }}
                    >
                      Time Added
                    </Typography>
          </TableCell>

          <TableCell
          sx={{
                    borderBottom: 4, //change this to 3 or 2 when done
                    borderRight: 4, //delete bottomright this once done 
                    borderColor: "red",
                    borderStyle: "dotted",
                    width: "17.5%",
                    paddingLeft: "70px"
          
                  }}>
          <Typography
                      /*onClick={() =>
                        handleDeleteClick()
                      }*/
                      sx={{
                        cursor: "pointer",
                        color: "common.white",
                        fontSize: "medium",
                        backgroundColor: "red",
                        border: 3,
                        borderRadius: '16px', 
                        textAlign: "center",
                        borderColor: "red",
                        width: "100px",
                      
                      }}
                    >
                      Delete
                    </Typography>
          </TableCell>
        
        
        </TableRow>
      
      
      
      
      
      
       </Table>
       <Box sx={{ width: "100%", paddingBottom: 5, position: "absolute",border: 3,
      borderColor: "black",
      borderStyle: "dotted",
      bottom: "0px",
      top: "775px",
      borderBottom:0,
      borderRight: 0,
      borderLeft: 0,
      

       }}>  
        <Button variant="contained" sx={{ marginTop:"5px", marginRight:"5px", left:"450px" }}>All Tags Made by "User"</Button>
        <Button variant="contained" sx={{ marginTop:"5px", left:"450px" }}> Questions By "User" that have Answers</Button>

       </Box>
    </Box>






      );
    };


    
export default UsersPage;