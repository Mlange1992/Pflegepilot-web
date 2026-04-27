import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'PflegePilot — 12 Mrd. € Pflegeleistungen verfallen jedes Jahr'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0369a1 0%, #075985 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 80,
          color: 'white',
        }}
      >
        <div style={{ fontSize: 32, opacity: 0.7, marginBottom: 16 }}>🧭 PflegePilot</div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            textAlign: 'center',
            lineHeight: 1.1,
          }}
        >
          12 Mrd. € verfallen jedes Jahr
        </div>
        <div
          style={{
            fontSize: 32,
            marginTop: 32,
            opacity: 0.85,
            textAlign: 'center',
          }}
        >
          Nicht Ihr Geld.
        </div>
      </div>
    ),
    { ...size },
  )
}
