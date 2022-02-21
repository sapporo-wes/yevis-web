import { Card, CardContent, Link, Typography } from '@mui/material'
import React from 'react'

import { Tool } from '@/types/trs'

interface Props {
  wf: Tool
}

const WfCard: React.VFC<Props> = (props: Props) => {
  return (
    <Card
      sx={{
        flexGrow: 1,
        flexBasis: 0,
      }}>
      <CardContent>
        <Link
          sx={{
            color: 'primary.main',
            fontSize: '1.2rem',
            fontWeight: 'bold',
          }}
          underline='none'
          href={props.wf.url}>
          {props.wf.name}
        </Link>
        {JSON.stringify(props.wf)}
      </CardContent>
    </Card>
  )
}

export default WfCard

// {
//   "url": "https://ddbj.github.io/yevis-workflows-dev/tools/c9282217-f616-42bb-9d6c-f061f9047e77",
//   "id": "c9282217-f616-42bb-9d6c-f061f9047e77",
//   "organization": "@ddbj, @suecharo",
//   "name": "SMK_tutorial",
//   "tool_class": {
//     "id": "workflow",
//     "name": "Workflow",
//     "description": "A computational workflow"
//   },
//   "description": "https://sandbox.zenodo.org/record/1018220/files/README.md",
//   "has_checker": true,
//   "checker_url": "https://github.com/suecharo/gh-trs",
//   "versions": [
//     {
//       "author": ["ddbj", "suecharo"],
//       "name": "SMK_tutorial",
//       "url": "https://ddbj.github.io/yevis-workflows-dev/tools/c9282217-f616-42bb-9d6c-f061f9047e77/versions/1.0.0",
//       "id": "c9282217-f616-42bb-9d6c-f061f9047e77",
//       "descriptor_type": ["SMK"],
//       "verified": true,
//       "verified_source": [
//         "https://github.com/ddbj/yevis-workflows-dev/actions/runs/1868079106"
//       ]
//     }
//   ]
// }
