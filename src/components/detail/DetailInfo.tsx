import { Box, Theme, Link } from '@mui/material'
import dayjs from 'dayjs'
import React from 'react'

import AuthorChip from '@/components/AuthorChip'
import LoadingMsg from '@/components/LoadingMsg'
import { trsEndpoint } from '@/envDefault'
import { useAppSelector } from '@/store'
import { extractAuthors } from '@/store/workflowsGetters'

interface Props {
  id: string
  sx?: object
  version: string
}

const DetailInfo: React.VFC<Props> = (props: Props) => {
  const wf = useAppSelector(
    (state) => state.workflow[props.id]?.versions[props.version]?.wf
  )
  const licenseInfo = useAppSelector(
    (state) => state.workflow[props.id]?.versions[props.version]?.licenseInfo
  )
  const tests = useAppSelector(
    (state) => state.workflow[props.id]?.versions[props.version]?.tests
  )
  if (
    typeof wf === 'undefined' ||
    wf === null ||
    typeof licenseInfo === 'undefined' ||
    typeof tests === 'undefined'
  ) {
    return null
  }
  const loading = licenseInfo.loading || tests.loading

  const authors = extractAuthors(wf)
  const license = wf.config.license
  const sortedResults = tests.results.sort((a, b) =>
    dayjs(a.date) < dayjs(b.date) ? 1 : -1
  )

  return !loading ? (
    <Box sx={{ ...props.sx, display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={(theme: Theme) => ({
          borderBottom: `1px solid ${theme.palette.divider}`,
          borderTop: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          flexDirection: 'column',
          p: 1,
          rowGap: 0.5,
        })}>
        <Box
          children='Authors:'
          component='span'
          sx={{ color: 'primary.main', fontSize: '0.8rem', fontWeight: 'bold' }}
        />
        <Box
          sx={{
            columnGap: 1,
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            px: 0.5,
            rowGap: 0.5,
          }}>
          {authors.map((author) => (
            <AuthorChip author={author} key={author} />
          ))}
        </Box>
      </Box>

      <Box
        sx={(theme: Theme) => ({
          borderBottom: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          flexDirection: 'column',
          p: 1,
          rowGap: 0.5,
        })}>
        <Box
          children='License:'
          component='span'
          sx={{
            color: 'primary.main',
            fontSize: '0.8rem',
            fontWeight: 'bold',
          }}
        />
        {licenseInfo.error === null && licenseInfo.licenseInfo !== null ? (
          <Link
            children={licenseInfo.licenseInfo.name}
            href={licenseInfo.licenseInfo.url}
            sx={{
              color: 'secondary.dark',
              fontSize: '0.8rem',
              px: 0.5,
            }}
            target='_blank'
            underline='hover'
          />
        ) : (
          <Box
            children={license || 'Unknown'}
            component='span'
            sx={{ fontSize: '0.8rem', px: 0.5 }}
          />
        )}
      </Box>

      <Box
        sx={(theme: Theme) => ({
          borderBottom: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          flexDirection: 'column',
          p: 1,
          rowGap: 0.5,
        })}>
        <Box
          children='Latest Test Status:'
          component='span'
          sx={{
            color: 'primary.main',
            fontSize: '0.8rem',
            fontWeight: 'bold',
          }}
        />
        <Box
          children={
            sortedResults.length > 0 && sortedResults[0].status !== null
              ? `
                  ${sortedResults[0].status
                    .charAt(0)
                    .toUpperCase()}${sortedResults[0].status.slice(1)}
                `
              : 'Unknown'
          }
          component='span'
          sx={{ fontSize: '0.8rem', px: 0.5 }}
        />
      </Box>

      <Box
        sx={(theme: Theme) => ({
          borderBottom: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          flexDirection: 'column',
          p: 1,
          rowGap: 0.5,
        })}>
        <Box
          children='TRS URL:'
          component='span'
          sx={{
            color: 'primary.main',
            fontSize: '0.8rem',
            fontWeight: 'bold',
          }}
        />
        <Link
          children={`${trsEndpoint().replace(/\/$/, '')}/tools/${props.id}`}
          href={`${trsEndpoint().replace(/\/$/, '')}/tools/${props.id}`}
          sx={{
            color: 'secondary.dark',
            fontSize: '0.8rem',
            px: 0.5,
          }}
          target='_blank'
          underline='hover'
        />
      </Box>
    </Box>
  ) : (
    <LoadingMsg content='Loading info contents...' />
  )
}

export default React.memo(DetailInfo)
