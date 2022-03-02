import { Box, Link } from '@mui/material'
import React from 'react'
import ReactMarkdown, { Components } from 'react-markdown'
import { Prism } from 'react-syntax-highlighter'
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'

const HeadComponent: React.VFC<{
  level: number
  children: React.ReactNode
}> = ({ level, children }: { level: number; children: React.ReactNode }) => {
  return (
    <Box
      children={children}
      component={level === 1 ? 'h2' : level == 2 ? 'h3' : 'h4'}
      sx={{
        fontSize: level === 1 ? '2rem' : level === 2 ? '1.5rem' : '1.25rem',
        paddingBottom: level === 1 ? '0.3rem' : null,
        borderBottom:
          level === 1 || level == 2 ? '1px solid hsla(210,18%,87%,1)' : null,
        marginBottom: '1rem',
        fontWeight: 'bold',
        lineHeight: '1.25',
        color: 'primary.main',
      }}
    />
  )
}

const components: Components = {
  code: ({ inline, className, children }) => {
    if (!inline) {
      const language = className?.replace('language-', '') || ''
      return (
        <Prism
          children={children}
          customStyle={{
            margin: '0',
            paddingTop: '1rem',
            paddingBottom: '0',
            borderRadius: '0.25rem',
            fontSize: '0.875rem',
            backgroundColor: '#f5f5f5',
            '.token': {
              background: '#f5f5f5',
            },
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
            padding: '0.2em 0.4em',
            margin: '0',
            borderRadius: '0.25rem',
            fontSize: '0.875rem',
            fontFamily:
              'ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace',
          }}
        />
      )
    }
  },
  a: ({ href, target, children }) => {
    return (
      <Link
        children={children}
        href={href}
        sx={{
          textDecoration: 'none',
          color: 'secondary.dark',
        }}
        target={target}
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
