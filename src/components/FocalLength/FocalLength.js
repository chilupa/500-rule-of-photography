import React from "react"
import { TextField } from "@mui/material"

const FocalLength = ({ handleFocalLengthChange }) => (
  <TextField
    label="Focal Length (mm)"
    type="number"
    min="0"
    onChange={handleFocalLengthChange}
  />
)

export default FocalLength
