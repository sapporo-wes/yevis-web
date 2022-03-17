import { Box, Tab, Tabs } from '@mui/material'
import React from 'react'

import TabFiles from '@/components/detail/TabFiles'
import TabReadme from '@/components/detail/TabReadme'
import TabTests from '@/components/detail/TabTests'

interface Props {
  id: string
  sx?: object
  version: string
}

const ContentBox: React.VFC<Props> = (props: Props) => {
  const [activeTab, setActiveTab] = React.useState('readme')

  return (
    <React.Fragment>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', ...props.sx }}>
        <Tabs
          indicatorColor='secondary'
          onChange={(_, value) => setActiveTab(value)}
          textColor='secondary'
          value={activeTab}>
          <Tab label='Readme' value='readme' />
          <Tab label='Files' value='files' />
          <Tab label='Tests' value='tests' />
          <Tab label='Versions' value='versions' />
        </Tabs>
      </Box>
      {activeTab === 'readme' && (
        <TabReadme id={props.id} sx={{ mx: 2 }} version={props.version} />
      )}
      {activeTab === 'files' && (
        <TabFiles id={props.id} sx={{ mt: 2, mx: 2 }} version={props.version} />
      )}
      {activeTab === 'tests' && (
        <TabTests id={props.id} sx={{ mt: 2, mx: 2 }} version={props.version} />
      )}
      {activeTab === 'versions' && <Box>versions</Box>}
    </React.Fragment>
  )
}

export default React.memo(ContentBox)
