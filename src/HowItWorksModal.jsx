import React from "react";
import Modal from "@mui/material/Modal"

const HowItWorksModal = ({ open, handleClose }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          width: "80%",
          height: "auto",
          padding: "1rem",
          borderRadius: "10px"
        }}
      >
        <h2>How it Works</h2>
        <p>
          This predictor uses a simple prediction model which determines the average 
          finishing position of each driver this season and adds it to their average 
          finishing position in any previous races at the circuit. The total of the 
          averages are then sorted from least to greatest and that gives us the predicted 
          order from 1st to 20th. This attempts to take into account the driver and teams 
          current competitiveness as well as how well they have performed at that 
          specific circuit in the past.
        </p>
        <p>
          There are limitations to this model. One example is Lewis Hamilton. Because 
          Hamilton had an extremely competitive car for years, his average finishing 
          position at any given circuit in past races is likely to be very low. This 
          means he will be placed higher in predictions even though his car is not very 
          competitive this year.
        </p>
      </div>
    </Modal>
  )
}

export default HowItWorksModal