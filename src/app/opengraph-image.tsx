import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'AIGC Room'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f0f14, #1a1033)',
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 800, color: 'white' }}>
          AIGC <span style={{ color: '#a78bfa' }}>Room</span>
        </div>
        <div style={{ fontSize: 28, color: '#9ca3af', marginTop: 16 }}>
          Discover the Best AI Tools
        </div>
      </div>
    ),
    { ...size }
  )
}
