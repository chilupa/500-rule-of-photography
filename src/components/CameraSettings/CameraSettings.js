import React, { useState } from "react"
import { Grid, Button, Snackbar, Box } from "@mui/material"
import CameraType from "../CameraType/CameraType"
import FocalLength from "../FocalLength/FocalLength"
import { motion } from "framer-motion"
import Alert from "../Alert/Alert"
import { IoIosCamera } from "react-icons/io"

const CameraSettings = () => {
  const [cropType, setCropType] = useState("Canon Crop Sensor")
  const [focalLength, setFocalLength] = useState("")
  const [shutterSpeed, setShutterSpeed] = useState("")
  const [error, setError] = useState(false)

  const handleChange = event => setCropType(event.target.value)
  const handleFocalLengthChange = event => setFocalLength(event.target.value)

  const cameras = [
    { value: "Canon Crop Sensor", label: "Canon Crop Sensor" },
    { value: "Nikon Crop Sensor", label: "Nikon Crop Sensor" },
    { value: "Full Frame Cameras", label: "Full Frame Cameras" },
  ]

  const calculation = {
    "Canon Crop Sensor": 500 / focalLength / 1.6,
    "Nikon Crop Sensor": 500 / focalLength / 1.5,
    "Full Frame Cameras": 500 / focalLength,
  }

  const handleCalculation = () => {
    const shutterSpeed = Math.round(calculation[cropType], 0)
    if (shutterSpeed === Infinity) {
      setError(true)
    } else {
      setShutterSpeed(shutterSpeed)
      setError(false)
    }
  }

  const [open, setOpen] = React.useState(false)

  const handleClick = () => {
    setOpen(true)
    handleCalculation()
  }

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setOpen(false)
  }

  return (
    <Grid
      container
      direction="row"
      alignItems="center"
      justify="center"
      spacing={4}
    >
      <Grid style={{ textAlign: "center" }} item xs={12}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <IoIosCamera style={{ fontSize: "3rem" }} />
        </motion.div>
      </Grid>
      <Grid style={{ textAlign: "center" }} item xs={12}>
        <p>
          Calculate the shutter speed for your <b>Astrophotography</b> shots.
          Choosing the right shutter speed will avoid unnecessary star trails.
        </p>
      </Grid>
      <Grid style={{ textAlign: "center" }} item xs={12}>
        <CameraType
          cameras={cameras}
          handleChange={handleChange}
          cropType={cropType}
        />
      </Grid>
      <Grid style={{ textAlign: "center" }} item xs={12}>
        <FocalLength handleFocalLengthChange={handleFocalLengthChange} />
      </Grid>
      <Grid item xs={6} sm={3}>
        <Box pt={2}>
          <Button
            fullWidth
            disabled={focalLength === "" || cropType === ""}
            variant="contained"
            color="primary"
            onClick={handleClick}
          >
            Calculate
          </Button>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
          {error ? (
            <Alert severity="error">
              <motion.div
                initial={{ x: -10 }}
                animate={{ x: 0 }}
                transition={{ repeat: 2, duration: 0.2 }}
              >
                <div>Something went wrong. Please try again.</div>
              </motion.div>
            </Alert>
          ) : (
            <Alert severity="success">
              <motion.div
                initial={{ y: -10 }}
                animate={{ y: 0 }}
                transition={{ repeat: 1, duration: 0.3 }}
              >
                <div>
                  Your shutter speed should be ~ <b>{shutterSpeed}</b> second(s)
                </div>
              </motion.div>
            </Alert>
          )}
        </Snackbar>
      </Grid>
    </Grid>
  )
}

export default CameraSettings
