import { Box, Stack } from '@mui/material'
import React from 'react'

import WfCard from '@/components/main/WfCard'
import WfNameFilter from '@/components/main/WfNameFilter'
import { RootState, useAppSelector } from '@/store'
import { wfToKey } from '@/store/workflows'
import { Config } from '@/types/ghTrs'

const WfList: React.VFC = () => {
  const { workflows, ghTrsConfigs, modifiedDates } = useAppSelector(
    (state: RootState) => state.workflows
  )
  const configs: (Config | null)[] = workflows
    .map((wf) => wfToKey(wf))
    .map((key) => ghTrsConfigs?.[key] || null)
  const dates: (string | null)[] = workflows
    .map((wf) => wfToKey(wf))
    .map((key) => modifiedDates?.[key] || null)

  return (
    <Box
      sx={{
        maxWidth: '100vw',
      }}>
      <Box
        sx={{
          maxWidth: 'lg',
          mx: 'auto',
          px: 8,
        }}>
        <Stack spacing={2}>
          <Stack direction='row'>
            <WfNameFilter />
          </Stack>
          <Stack spacing={2}>
            {[...Array(Math.ceil(workflows.length / 2)).keys()].map(
              (rowInd) => (
                <Stack key={rowInd} direction='row' spacing={2}>
                  {workflows[rowInd * 2] && (
                    <WfCard
                      wf={workflows[rowInd * 2]}
                      config={configs[rowInd * 2]}
                      modifiedDate={dates[rowInd * 2]}
                    />
                  )}
                  {workflows[rowInd * 2 + 1] && (
                    <WfCard
                      wf={workflows[rowInd * 2 + 1]}
                      config={configs[rowInd * 2 + 1]}
                      modifiedDate={dates[rowInd * 2 + 1]}
                    />
                  )}
                </Stack>
              )
            )}
          </Stack>
        </Stack>
      </Box>
    </Box>
  )
}

export default WfList
