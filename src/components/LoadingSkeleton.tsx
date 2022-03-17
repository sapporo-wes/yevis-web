import { Skeleton } from '@mui/material'
import React from 'react'

interface Props {
  children: React.ReactNode
  height?: string | number
  loading: boolean
  variant?: 'rectangular' | 'circular' | 'text'
  width?: string | number
}

const LoadingSkeleton: React.VFC<Props> = (props: Props) => {
  return (
    <React.Fragment>
      {props.loading ? (
        <Skeleton
          animation='wave'
          height={props.height}
          variant={props.variant || 'rectangular'}
          width={props.width}
        />
      ) : (
        props.children
      )}
    </React.Fragment>
  )
}

export default React.memo(LoadingSkeleton)
