import BuildRoundedIcon from '@mui/icons-material/BuildRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import { Box, Link, Theme } from '@mui/material'
import dayjs from 'dayjs'
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'

import DoiBadge from '@/components/DoiBadge'
import { useAppSelector } from '@/store'
import { versionsInfo } from '@/store/workflowGetters'

interface Props {
  id: string
  sx?: object
  version: string
}

const VersionsInfo: React.VFC<Props> = (props: Props) => {
  const wfVersions = useAppSelector(
    (state) => state.workflow[props.id]?.versions
  )
  if (typeof wfVersions === 'undefined') {
    return null
  }
  const versionInfo = versionsInfo(wfVersions)

  return (
    <Box
      sx={{ ...props.sx, display: 'flex', flexDirection: 'column', rowGap: 1 }}>
      <Box
        children='Versions'
        component='h2'
        sx={{ color: 'primary.main', fontSize: '1.2rem', my: 0 }}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {versionInfo.map((info, i) => (
          <Box
            key={info.version}
            sx={(theme: Theme) => ({
              bgcolor: props.version === info.version ? '#ebe9f1' : null,
              borderBottom:
                i === versionInfo.length - 1
                  ? `1px solid ${theme.palette.divider}`
                  : null,
              borderTop: `1px solid ${theme.palette.divider}`,
              display: 'flex',
              flexDirection: 'column',
              px: 1,
              py: 2,
              rowGap: 1,
            })}>
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'row',
              }}>
              <Box
                sx={{
                  alignItems: 'center',
                  columnGap: 1,
                  display: 'flex',
                  flexDirection: 'row',
                  flexGrow: 1,
                }}>
                <Link
                  children={`Version ${info.version}`}
                  color='secondary.dark'
                  component={RouterLink}
                  to={`/workflows/${props.id}/versions/${info.version}`}
                  underline='hover'
                />
                {info.status === 'published' ? (
                  <CheckRoundedIcon
                    sx={{
                      color: 'success.light',
                      height: '1.2rem',
                      width: '1.2rem',
                    }}
                  />
                ) : (
                  <BuildRoundedIcon
                    sx={{
                      color: 'error.light',
                      height: '1.2rem',
                      width: '1.2rem',
                    }}
                  />
                )}
              </Box>
              <Box
                children={`${dayjs(info.date).format('MMM DD, YYYY')}`}
                component='span'
                sx={{ fontSize: '0.8rem', fontWeight: 300 }}
              />
            </Box>
            {info.doi ? <DoiBadge doi={info.doi} /> : null}
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default React.memo(VersionsInfo)
