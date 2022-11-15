/* eslint-disable @next/next/no-img-element */

import * as React from 'react'
import { NextRequest } from 'next/server'
import { ImageResponse } from '@vercel/og'
import ms from 'pretty-ms'

import * as appConfig from '@/lib/config'
import { MovieModel } from '@/lib/types'

const interRegularFontP = fetch(
  new URL('../../../../public/fonts/Inter-Regular.ttf', import.meta.url)
).then((res) => res.arrayBuffer())

const interSemiBoldFontP = fetch(
  new URL('../../../../public/fonts/Inter-SemiBold.ttf', import.meta.url)
).then((res) => res.arrayBuffer())

export const config = {
  runtime: 'experimental-edge'
}

export default async function socialImageForMovie(req: NextRequest) {
  if (req.method !== 'GET') {
    return new Response(
      JSON.stringify({
        error: 'method not allowed'
      }),
      {
        status: 405,
        headers: { 'content-type': 'application/json' }
      }
    )
  }

  const { searchParams } = new URL(req.url)
  const movieId = searchParams.get('movieId')
  const id = parseInt(movieId as string)
  if (!movieId || isNaN(id)) {
    return new Response(
      JSON.stringify({ error: `invalid movie id "${movieId}"` }),
      {
        status: 400,
        headers: { 'content-type': 'application/json' }
      }
    )
  }

  const movieRes = await fetch(`${appConfig.apiBaseUrl}/api/titles/${id}`)
  if (!movieRes.ok) {
    return new Response(movieRes.statusText, { status: movieRes.status })
  }
  const [movie, interRegularFont, interSemiBoldFont] = await Promise.all([
    movieRes.json() as Promise<MovieModel>,
    interRegularFontP,
    interSemiBoldFontP
  ])
  // console.log(movie)

  const gap = '36px'
  const gapHalf = '18px'
  const title = movie.title || movie.originalTitle || 'Unknown Movie'
  const approxNumTitleLines = title.length / 15
  const isLargeTitle = approxNumTitleLines > 2.5
  const titleFontSize = isLargeTitle ? 70 : 90
  const detailFontSize = isLargeTitle ? 32 : 40

  return new ImageResponse(
    (
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          gap,
          // TODO: use gap
          // TODO: revert to just gap if we can remove the border after
          // blurring is fixed
          padding: 36 + 12,
          backgroundColor: '#1F1F27',
          fontFamily: '"Inter", sans-serif',
          color: '#fff'
        }}
      >
        {movie.backdropUrl && (
          <div
            style={{
              position: 'absolute',
              display: 'flex',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0
              // top: '-7.5%',
              // left: '-7.5%',
              // right: '-7.5%',
              // bottom: '-7.5%'
            }}
          >
            <img
              src={movie.backdropUrl!}
              alt=''
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                // TODO: https://github.com/vercel/satori/issues/309
                filter: 'blur(8px)'
                // transform: 'scale(1.05)'
              }}
            />

            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                opacity: 0.5,
                backgroundColor: '#000'
              }}
            />

            {/* adds an ugly border as a workaround for an even uglier blur border bug */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                border: '12px solid #888'
              }}
            />
          </div>
        )}

        <div
          style={{
            flex: '1 1',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                fontSize: titleFontSize,
                fontWeight: 600
              }}
            >
              {title}
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                fontSize: detailFontSize,
                opacity: 0.8,
                marginTop: gapHalf
              }}
            >
              {movie.releaseYear && (
                <div style={{ display: 'flex', marginRight: gap }}>
                  {movie.releaseYear}
                </div>
              )}

              {movie.mpaaRating && (
                <div style={{ display: 'flex', marginRight: gap }}>
                  {movie.mpaaRating}
                </div>
              )}

              {movie.runtime && (
                <div style={{ display: 'flex' }}>
                  {ms(movie.runtime * 60 * 1000)}
                </div>
              )}
            </div>
          </div>

          <svg
            width={400}
            height={66}
            viewBox='0 0 658 107'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            style={{
              marginTop: gap
            }}
          >
            <path
              d='M227.08 85.208L173.416 30.776L176.104 31.448L176.296 83H166.984V11.48H167.464L220.552 66.104L218.344 65.624L218.152 13.592H227.368V85.208H227.08ZM263.552 83.96C259.008 83.96 255.104 83.064 251.84 81.272C248.576 79.416 246.048 76.92 244.256 73.784C242.528 70.584 241.664 66.936 241.664 62.84C241.664 58.936 242.656 55.384 244.64 52.184C246.624 48.984 249.28 46.424 252.608 44.504C255.936 42.584 259.648 41.624 263.744 41.624C268.992 41.624 273.344 43.16 276.8 46.232C280.256 49.304 282.592 53.528 283.808 58.904L251.072 70.424L248.96 65.144L275.84 55.352L273.92 56.6C273.152 54.488 271.872 52.664 270.08 51.128C268.288 49.528 265.952 48.728 263.072 48.728C260.64 48.728 258.464 49.336 256.544 50.552C254.624 51.704 253.12 53.304 252.032 55.352C250.944 57.4 250.4 59.736 250.4 62.36C250.4 65.112 250.976 67.544 252.128 69.656C253.28 71.704 254.848 73.336 256.832 74.552C258.88 75.704 261.184 76.28 263.744 76.28C265.472 76.28 267.136 75.96 268.736 75.32C270.4 74.68 271.936 73.848 273.344 72.824L277.472 79.448C275.488 80.792 273.248 81.88 270.752 82.712C268.32 83.544 265.92 83.96 263.552 83.96ZM308.846 58.04L318.35 43.256H327.374L312.11 64.568L308.846 58.04ZM328.91 83H318.158L287.918 43.256H298.958L328.91 83ZM307.886 68.216L297.422 83H288.398L303.566 62.264L307.886 68.216ZM342.335 25.784H351.263V43.448H362.207V50.456H351.263V83H342.335V50.456H335.039V43.448H342.335V25.784ZM405.578 83V11.384H405.674L442.058 63.032L438.122 62.264L474.41 11.384H474.602V83H465.386V32.504L465.962 37.208L439.754 74.264H439.562L412.97 37.208L414.602 32.888V83H405.578ZM488.883 62.744C488.883 58.776 489.811 55.192 491.667 51.992C493.587 48.792 496.211 46.264 499.539 44.408C502.867 42.552 506.643 41.624 510.867 41.624C515.219 41.624 519.027 42.552 522.291 44.408C525.555 46.264 528.083 48.792 529.875 51.992C531.667 55.192 532.562 58.776 532.562 62.744C532.562 66.712 531.667 70.328 529.875 73.592C528.083 76.792 525.523 79.32 522.195 81.176C518.931 83.032 515.123 83.96 510.771 83.96C506.547 83.96 502.771 83.096 499.443 81.368C496.179 79.576 493.587 77.112 491.667 73.976C489.811 70.776 488.883 67.032 488.883 62.744ZM497.811 62.84C497.811 65.4 498.387 67.736 499.539 69.848C500.691 71.896 502.227 73.528 504.147 74.744C506.131 75.96 508.307 76.568 510.675 76.568C513.171 76.568 515.379 75.96 517.299 74.744C519.283 73.528 520.819 71.896 521.907 69.848C522.995 67.736 523.539 65.4 523.539 62.84C523.539 60.28 522.995 57.976 521.907 55.928C520.819 53.816 519.283 52.152 517.299 50.936C515.379 49.656 513.171 49.016 510.675 49.016C508.243 49.016 506.035 49.656 504.051 50.936C502.131 52.216 500.595 53.912 499.443 56.024C498.355 58.072 497.811 60.344 497.811 62.84ZM559.56 84.152L537.48 43.256H548.04L563.016 74.84L557.544 74.648L571.272 43.256H581.256L560.04 84.152H559.56ZM590.87 43.256H599.798V83H590.87V43.256ZM590.198 28.856C590.198 27.448 590.742 26.264 591.83 25.304C592.982 24.344 594.23 23.864 595.574 23.864C596.918 23.864 598.102 24.344 599.126 25.304C600.214 26.264 600.758 27.448 600.758 28.856C600.758 30.328 600.214 31.544 599.126 32.504C598.102 33.4 596.918 33.848 595.574 33.848C594.23 33.848 592.982 33.368 591.83 32.408C590.742 31.448 590.198 30.264 590.198 28.856ZM633.677 83.96C629.133 83.96 625.229 83.064 621.965 81.272C618.701 79.416 616.173 76.92 614.381 73.784C612.653 70.584 611.789 66.936 611.789 62.84C611.789 58.936 612.781 55.384 614.765 52.184C616.749 48.984 619.405 46.424 622.733 44.504C626.061 42.584 629.773 41.624 633.869 41.624C639.117 41.624 643.469 43.16 646.925 46.232C650.381 49.304 652.717 53.528 653.933 58.904L621.197 70.424L619.085 65.144L645.965 55.352L644.045 56.6C643.277 54.488 641.997 52.664 640.205 51.128C638.413 49.528 636.077 48.728 633.197 48.728C630.765 48.728 628.589 49.336 626.669 50.552C624.749 51.704 623.245 53.304 622.157 55.352C621.069 57.4 620.525 59.736 620.525 62.36C620.525 65.112 621.101 67.544 622.253 69.656C623.405 71.704 624.973 73.336 626.957 74.552C629.005 75.704 631.309 76.28 633.869 76.28C635.597 76.28 637.261 75.96 638.861 75.32C640.525 74.68 642.061 73.848 643.469 72.824L647.597 79.448C645.613 80.792 643.373 81.88 640.877 82.712C638.445 83.544 636.045 83.96 633.677 83.96Z'
              fill='#fff'
            />

            <path
              d='M0 5.39368V90.6653C0 93.6187 2.44023 96.0589 5.39368 96.0589H116.606C119.56 96.0589 122 93.6187 122 90.6653V5.39368C122 2.44023 119.56 0 116.606 0H5.39368C2.44023 0 0 2.44023 0 5.39368V5.39368ZM21.3181 87.0695H8.98924V74.2274H21.3181V87.0695ZM21.3181 65.367H8.98924V52.5249H21.3181V65.367ZM21.3181 43.5347H8.98924V30.6926H21.3181V43.5347ZM21.3181 21.8323H8.98924V8.99016H21.3181V21.8323ZM73.7139 51.7544L50.3413 66.0091C47.3878 67.807 43.6632 65.752 43.6632 62.2853V33.7759C43.6632 30.3083 47.3869 28.2542 50.3413 30.0521L73.7139 44.3069C76.5392 46.1047 76.5392 50.0856 73.7139 51.7546V51.7544ZM113.011 87.0702H98.1137V74.228H113.011V87.0702ZM113.011 65.3677H98.1137V52.5256H113.011V65.3677ZM113.011 43.5354H98.1137V30.6933H113.011V43.5354ZM113.011 21.833H98.1137V8.99085H113.011V21.833Z'
              fill='#fff'
            />
          </svg>
        </div>

        {movie.posterUrl && (
          <div
            style={{
              display: 'flex',
              border: '1px solid #565656',
              borderRadius: 4,
              marginLeft: gap
            }}
          >
            <img
              src={movie.posterUrl!}
              alt=''
              style={{
                height: '100%',
                maxHeight: '100%'
              }}
            />
          </div>
        )}
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: interRegularFont,
          style: 'normal',
          weight: 400
        },
        {
          name: 'Inter',
          data: interSemiBoldFont,
          style: 'normal',
          weight: 600
        }
      ]
    }
  )
}
