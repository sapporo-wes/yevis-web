import { Link } from '@mui/material'
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'

const Workflow: React.VFC = () => {
  return (
    <div>
      Workflow page
      <Link component={RouterLink} to='/'>
        Back to Home
      </Link>
    </div>
  )
}

export default Workflow
