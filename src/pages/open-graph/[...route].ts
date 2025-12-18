import { getCollection } from 'astro:content'
import { ImageResponse } from '@vercel/og'
import { themeConfig } from '../../config'

export const prerender = true

const collectionEntries = await getCollection('posts')

const pages = Object.fromEntries(
  collectionEntries.map(({ id, data }) => [id.replace(/\.(md|mdx)$/, ''), data])
)

export async function getStaticPaths() {
  return Object.keys(pages).map(route => ({
    params: { route: route.split('/') }
  }))
}

export async function GET({ params }) {
  const route = params.route.join('/')
  const page = pages[route]
  if (!page) {
    return new Response('Not found', { status: 404 })
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
          fontSize: 68,
          fontWeight: 600,
          color: '#1c1c1c',
          padding: 64,
        }}
      >
        <div>{page.title}</div>
        <div style={{ fontSize: 40, fontWeight: 400, color: '#b4b4b4', marginTop: 16 }}>
          {themeConfig.site.title}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
