import { Box, Tab, Tabs } from '@mui/material'
import React from 'react'

import Files from '@/components/detail/Files'
import MuiMarkdown from '@/components/detail/MuiMarkdown'
import { WfVersion } from '@/store/workflow'
import { contentLoading, contentError, content } from '@/store/workflowGetters'

interface Props {
  sx?: object
  wfVersion: WfVersion
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
        </Tabs>
      </Box>
      {activeTab === 'readme' && (
        <MuiMarkdown
          children={
            contentLoading(props.wfVersion.contents, 'readme')
              ? 'Loading README...'
              : contentError(props.wfVersion.contents, 'readme') ??
                content(props.wfVersion.contents, 'readme')
          }
          sx={{ mx: 2 }}
        />
      )}
      {activeTab === 'files' && (
        <Files sx={{ mt: 2, mx: 2 }} wfVersion={props.wfVersion} />
      )}
    </React.Fragment>
  )
}

export default ContentBox
