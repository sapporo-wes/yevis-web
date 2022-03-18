import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Link,
  Box,
  Theme,
} from '@mui/material'
import dayjs from 'dayjs'
import React from 'react'

import { WfVersion } from '@/store/workflow'

interface Props {
  results: WfVersion['tests']['results']
  sx?: object
}

const TestResultList: React.VFC<Props> = (props: Props) => {
  const sortedResults = props.results.sort((a, b) =>
    dayjs(a.date) < dayjs(b.date) ? 1 : -1
  )

  return (
    <Box
      sx={(theme: Theme) => ({
        ...props.sx,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: '0.25rem',
      })}>
      <Table size='small'>
        <TableHead sx={{ ['.MuiTableCell-root']: { color: 'primary.main' } }}>
          <TableRow>
            <TableCell children='GitHub Actions URL' />
            <TableCell children='Status' sx={{ width: '80px' }} />
            <TableCell children='Date' sx={{ width: '180px' }} />
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedResults.map((result) => (
            <TableRow key={result.url}>
              <TableCell size='medium'>
                <Link
                  children={result.url}
                  color='secondary.dark'
                  href={result.url}
                  target='_blank'
                  underline='hover'
                />
              </TableCell>
              <TableCell
                children={
                  result.status !== null
                    ? `
                  ${result.status.charAt(0).toUpperCase()}${result.status.slice(
                        1
                      )}
                `
                    : 'Unknown'
                }
                size='medium'
              />
              <TableCell
                children={`${dayjs(result.date).format('YYYY-MM-DD HH:mm:ss')}`}
                size='medium'
              />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  )
}

export default React.memo(TestResultList)
