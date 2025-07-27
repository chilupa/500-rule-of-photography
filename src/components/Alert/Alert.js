import React from "react"
import { Alert as MuiAlert } from "@mui/material"

const Alert = props => (
  <MuiAlert elevation={6} icon={false} variant="filled" {...props} />
)

export default Alert
