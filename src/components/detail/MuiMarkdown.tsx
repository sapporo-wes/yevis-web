import { Box, Link } from '@mui/material'
import React from 'react'
import ReactMarkdown, { Components } from 'react-markdown'
import { Prism } from 'react-syntax-highlighter'
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'

const HeadComponent: React.VFC<{
  children: React.ReactNode
  level: number
}> = ({ level, children }: { children: React.ReactNode; level: number }) => {
  return (
    <Box
      children={children}
      component={level === 1 ? 'h2' : level == 2 ? 'h3' : 'h4'}
      sx={{
        borderBottom:
          level === 1 || level == 2 ? '1px solid hsla(210,18%,87%,1)' : null,
        color: 'primary.main',
        fontSize: level === 1 ? '2rem' : level === 2 ? '1.5rem' : '1.25rem',
        fontWeight: 'bold',
        lineHeight: '1.25',
        marginBottom: '1rem',
        paddingBottom: level === 1 ? '0.3rem' : null,
      }}
    />
  )
}

const components: Components = {
  a: ({ href, target, children }) => {
    return (
      <Link
        children={children}
        href={href}
        sx={{
          color: 'secondary.main',
        }}
        target={target}
        underline='hover'
      />
    )
  },
  code: ({ inline, className, children }) => {
    if (!inline) {
      const language = className?.replace('language-', '') || ''
      return (
        <Prism
          children={children}
          customStyle={{
            '.token': {
              background: '#f5f5f5',
            },
            backgroundColor: '#f5f5f5',
            borderRadius: '0.25rem',
            fontSize: '0.875rem',
            margin: '0',
            paddingBottom: '0',
            paddingTop: '1rem',
          }}
          language={language}
          style={prism}
        />
      )
    } else {
      return (
        <code
          children={children}
          style={{
            backgroundColor: '#f5f5f5',
            borderRadius: '0.25rem',
            fontFamily: 'Menlo,monospace,Quicksand',
            fontSize: '0.875rem',
            margin: '0',
            padding: '0.2rem 0.4rem',
          }}
        />
      )
    }
  },
  h1: ({ children }) => {
    return <HeadComponent children={children} level={1} />
  },
  h2: ({ children }) => {
    return <HeadComponent children={children} level={2} />
  },
  h3: ({ children }) => {
    return <HeadComponent children={children} level={3} />
  },
  h4: ({ children }) => {
    return <HeadComponent children={children} level={4} />
  },
  h5: ({ children }) => {
    return <HeadComponent children={children} level={5} />
  },
  h6: ({ children }) => {
    return <HeadComponent children={children} level={6} />
  },
  hr: (_props) => {
    return (
      <hr
        style={{
          margin: '1rem 0',
        }}
      />
    )
  },
  li: ({ className, checked, ordered, children }) => {
    return (
      <li
        className={className}
        style={{
          listStyle: checked ? 'none' : ordered ? 'decimal' : 'disc',
        }}>
        {children}
      </li>
    )
  },
}

interface Props {
  children: string
  sx?: object
}

const MuiMarkdown: React.VFC<Props> = ({ children, sx, ...other }: Props) => (
  <Box sx={{ ...sx }}>
    <ReactMarkdown
      {...other}
      children={children}
      components={components}
      linkTarget={'_blank'}
      rehypePlugins={[rehypeRaw]}
      remarkPlugins={[remarkGfm]}
    />
  </Box>
)

export default MuiMarkdown
