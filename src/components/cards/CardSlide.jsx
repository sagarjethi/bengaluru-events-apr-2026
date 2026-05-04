// Pure presentational slide. The DOM is rendered at output pixel dimensions
// (1080x1080 etc.) inside a relatively-positioned wrapper; the parent adds
// a CSS transform to scale it down for preview. html-to-image captures the
// inner element 1:1 so PNG output is pixel-accurate.

import { forwardRef } from 'react';
import { CATEGORIES } from '../../data';

const MONTH_SHORTS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function parseIso(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}
function dayLabel(iso) {
  const d = parseIso(iso);
  return `${MONTH_SHORTS[d.getUTCMonth()]} ${d.getUTCDate()}`;
}
function dowLabel(iso) {
  const d = parseIso(iso);
  return ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][d.getUTCDay()];
}

const DOMAIN = 'bengaluru-events.sagarjethi.com';

const CardSlide = forwardRef(function CardSlide({ slide, theme, size }, ref) {
  const w = size.width;
  const h = size.height;

  const baseStyle = {
    width: `${w}px`,
    height: `${h}px`,
    fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    background: '#ffffff',
    color: '#0f172a',
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  };

  // Header padding/typography scales with width so the design works for
  // every aspect ratio.
  const padX = Math.round(w * 0.075);
  const padY = Math.round(w * 0.075);

  return (
    <div ref={ref} style={baseStyle} data-card-slide={slide.kind}>
      {slide.kind === 'cover' && (
        <CoverSlide slide={slide} theme={theme} w={w} h={h} padX={padX} padY={padY} />
      )}
      {slide.kind === 'events' && (
        <EventsSlide slide={slide} theme={theme} w={w} padX={padX} padY={padY} />
      )}
      {slide.kind === 'cta' && (
        <CtaSlide slide={slide} theme={theme} w={w} padX={padX} padY={padY} />
      )}
      {slide.kind === 'longform' && (
        <LongformSlide slide={slide} theme={theme} w={w} h={h} padX={padX} padY={padY} />
      )}
      {slide.kind === 'empty' && (
        <EmptySlide theme={theme} w={w} padX={padX} padY={padY} />
      )}
    </div>
  );
});

export default CardSlide;

// ---------------------------------------------------------------------------

function Footer({ w, padX }) {
  return (
    <div
      style={{
        marginTop: 'auto',
        padding: `${Math.round(w * 0.04)}px ${padX}px`,
        background: '#0f172a',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: `${Math.round(w * 0.022)}px`,
        letterSpacing: '0.04em',
      }}
    >
      <span style={{ fontWeight: 600 }}>{DOMAIN}</span>
      <span style={{ opacity: 0.7 }}>Curated tech events · Bengaluru</span>
    </div>
  );
}

function CoverSlide({ slide, theme, w, h, padX, padY }) {
  const big = Math.round(w * 0.092);
  const eyebrow = Math.round(w * 0.026);
  const subhead = Math.round(w * 0.038);

  return (
    <>
      <div
        style={{
          height: Math.round(h * 0.65),
          background: `linear-gradient(135deg, ${theme.headerFrom} 0%, ${theme.headerTo} 100%)`,
          color: theme.onHeader,
          padding: `${padY}px ${padX}px`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            fontSize: `${eyebrow}px`,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            fontWeight: 700,
            opacity: 0.85,
          }}
        >
          {slide.period.kind === 'week' ? 'Weekly Digest' : 'Monthly Digest'} · Bengaluru
        </div>
        <div>
          <div
            style={{
              fontSize: `${big}px`,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              marginBottom: Math.round(w * 0.025),
            }}
          >
            {slide.period.label}
          </div>
          <div style={{ fontSize: `${subhead}px`, opacity: 0.92, fontWeight: 500 }}>
            {slide.totalCount} {slide.totalCount === 1 ? 'event' : 'events'} happening · in-person
          </div>
        </div>
      </div>
      <div
        style={{
          flex: 1,
          padding: `${Math.round(w * 0.05)}px ${padX}px`,
          display: 'flex',
          alignItems: 'center',
          gap: Math.round(w * 0.02),
          color: '#475569',
          fontSize: `${Math.round(w * 0.028)}px`,
          fontWeight: 500,
        }}
      >
        <span style={{ fontWeight: 700, color: '#0f172a' }}>Swipe →</span>
        <span style={{ opacity: 0.8 }}>The full list of in-person tech events for the period</span>
      </div>
      <Footer w={w} padX={padX} />
    </>
  );
}

function EventsSlide({ slide, theme, w, padX, padY }) {
  const eyebrow = Math.round(w * 0.024);
  const title = Math.round(w * 0.034);
  const venue = Math.round(w * 0.024);
  const date = Math.round(w * 0.026);

  return (
    <>
      <div
        style={{
          padding: `${Math.round(padY * 0.7)}px ${padX}px ${Math.round(w * 0.03)}px`,
          background: `linear-gradient(135deg, ${theme.headerFrom} 0%, ${theme.headerTo} 100%)`,
          color: theme.onHeader,
        }}
      >
        <div
          style={{
            fontSize: `${eyebrow}px`,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            fontWeight: 700,
            opacity: 0.85,
          }}
        >
          {slide.period.short} · {slide.slot}
        </div>
        <div
          style={{
            marginTop: Math.round(w * 0.012),
            fontSize: `${Math.round(w * 0.046)}px`,
            fontWeight: 800,
            letterSpacing: '-0.01em',
          }}
        >
          What's on
        </div>
      </div>

      <div
        style={{
          flex: 1,
          padding: `${Math.round(w * 0.04)}px ${padX}px`,
          display: 'flex',
          flexDirection: 'column',
          gap: Math.round(w * 0.025),
        }}
      >
        {slide.events.map((e) => {
          const cat = CATEGORIES[e.category];
          return (
            <div
              key={e.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: Math.round(w * 0.025),
                padding: `${Math.round(w * 0.022)}px 0`,
                borderBottom: '1px solid #e2e8f0',
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: Math.round(w * 0.13),
                  textAlign: 'center',
                  paddingRight: Math.round(w * 0.02),
                  borderRight: `3px solid ${theme.accent}`,
                }}
              >
                <div
                  style={{
                    fontSize: `${eyebrow}px`,
                    fontWeight: 700,
                    color: theme.accent,
                    letterSpacing: '0.1em',
                  }}
                >
                  {dowLabel(e.startDate)}
                </div>
                <div
                  style={{
                    fontSize: `${date}px`,
                    fontWeight: 800,
                    color: '#0f172a',
                    lineHeight: 1,
                    marginTop: 4,
                  }}
                >
                  {dayLabel(e.startDate)}
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: `${title}px`,
                    fontWeight: 700,
                    color: '#0f172a',
                    lineHeight: 1.2,
                    marginBottom: Math.round(w * 0.008),
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {e.name}
                </div>
                <div
                  style={{
                    fontSize: `${venue}px`,
                    color: '#475569',
                    fontWeight: 500,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {e.venue}
                </div>
                {cat && (
                  <div
                    style={{
                      marginTop: Math.round(w * 0.008),
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: `${Math.round(w * 0.02)}px`,
                      color: theme.accent,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                    }}
                  >
                    {cat.label}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Footer w={w} padX={padX} />
    </>
  );
}

function CtaSlide({ slide, theme, w, padX, padY }) {
  return (
    <>
      <div
        style={{
          flex: 1,
          background: `linear-gradient(135deg, ${theme.headerFrom} 0%, ${theme.headerTo} 100%)`,
          color: theme.onHeader,
          padding: `${padY}px ${padX}px`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: `${Math.round(w * 0.026)}px`,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            fontWeight: 700,
            opacity: 0.85,
            marginBottom: Math.round(w * 0.04),
          }}
        >
          See all {slide.totalCount} events
        </div>
        <div
          style={{
            fontSize: `${Math.round(w * 0.07)}px`,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            marginBottom: Math.round(w * 0.06),
            maxWidth: '85%',
          }}
        >
          Scan or visit the link
        </div>

        {slide.qrSvg && (
          <div
            style={{
              background: '#fff',
              padding: Math.round(w * 0.025),
              borderRadius: Math.round(w * 0.025),
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
            }}
            dangerouslySetInnerHTML={{ __html: slide.qrSvg }}
          />
        )}

        <div
          style={{
            marginTop: Math.round(w * 0.05),
            fontSize: `${Math.round(w * 0.032)}px`,
            fontWeight: 600,
            opacity: 0.95,
            wordBreak: 'break-all',
            maxWidth: '85%',
          }}
        >
          {slide.deepLink}
        </div>
      </div>
      <Footer w={w} padX={padX} />
    </>
  );
}

function LongformSlide({ slide, theme, w, h, padX, padY }) {
  const eyebrow = Math.round(w * 0.022);
  const big = Math.round(w * 0.06);
  const title = Math.round(w * 0.028);
  const venue = Math.round(w * 0.02);

  // Cap items so a 1080x1080 square stays readable. Tall sizes get more.
  const cap = h > 1500 ? 12 : h > 1200 ? 9 : 7;
  const events = slide.events.slice(0, cap);
  const remainder = slide.events.length - events.length;

  return (
    <>
      <div
        style={{
          padding: `${padY}px ${padX}px`,
          background: `linear-gradient(135deg, ${theme.headerFrom} 0%, ${theme.headerTo} 100%)`,
          color: theme.onHeader,
        }}
      >
        <div
          style={{
            fontSize: `${eyebrow}px`,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            fontWeight: 700,
            opacity: 0.85,
          }}
        >
          {slide.period.kind === 'week' ? 'Weekly Digest' : 'Monthly Digest'} · Bengaluru
        </div>
        <div
          style={{
            marginTop: Math.round(w * 0.012),
            fontSize: `${big}px`,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
          }}
        >
          {slide.period.label}
        </div>
        <div
          style={{
            marginTop: Math.round(w * 0.014),
            fontSize: `${Math.round(w * 0.026)}px`,
            opacity: 0.9,
            fontWeight: 500,
          }}
        >
          {slide.events.length} events · in-person
        </div>
      </div>

      <div
        style={{
          flex: 1,
          padding: `${Math.round(w * 0.035)}px ${padX}px`,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {events.map((e) => (
          <div
            key={e.id}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: Math.round(w * 0.022),
              padding: `${Math.round(w * 0.014)}px 0`,
              borderBottom: '1px solid #e2e8f0',
            }}
          >
            <div
              style={{
                flexShrink: 0,
                width: Math.round(w * 0.1),
                textAlign: 'center',
                paddingRight: Math.round(w * 0.015),
                borderRight: `3px solid ${theme.accent}`,
              }}
            >
              <div style={{ fontSize: `${Math.round(w * 0.018)}px`, fontWeight: 700, color: theme.accent, letterSpacing: '0.1em' }}>
                {dowLabel(e.startDate)}
              </div>
              <div style={{ fontSize: `${Math.round(w * 0.022)}px`, fontWeight: 800, color: '#0f172a', lineHeight: 1, marginTop: 3 }}>
                {dayLabel(e.startDate)}
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: `${title}px`,
                  fontWeight: 700,
                  color: '#0f172a',
                  lineHeight: 1.2,
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {e.name}
              </div>
              <div
                style={{
                  fontSize: `${venue}px`,
                  color: '#475569',
                  fontWeight: 500,
                  marginTop: 2,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {e.venue}
              </div>
            </div>
          </div>
        ))}
        {remainder > 0 && (
          <div
            style={{
              marginTop: Math.round(w * 0.02),
              fontSize: `${Math.round(w * 0.024)}px`,
              color: theme.accent,
              fontWeight: 700,
            }}
          >
            + {remainder} more — scan QR or visit the link
          </div>
        )}

        {slide.qrSvg && (
          <div
            style={{
              marginTop: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: Math.round(w * 0.025),
              paddingTop: Math.round(w * 0.025),
              borderTop: '1px solid #e2e8f0',
            }}
          >
            <div
              style={{
                background: '#fff',
                padding: Math.round(w * 0.012),
                borderRadius: Math.round(w * 0.012),
                border: '1px solid #e2e8f0',
              }}
              dangerouslySetInnerHTML={{ __html: slide.qrSvg }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: `${Math.round(w * 0.022)}px`, color: '#475569', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Open the live list
              </div>
              <div style={{ fontSize: `${Math.round(w * 0.022)}px`, color: '#0f172a', fontWeight: 600, marginTop: 4, wordBreak: 'break-all' }}>
                {slide.deepLink}
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer w={w} padX={padX} />
    </>
  );
}

function EmptySlide({ theme, w, padX, padY }) {
  return (
    <>
      <div
        style={{
          flex: 1,
          background: `linear-gradient(135deg, ${theme.headerFrom} 0%, ${theme.headerTo} 100%)`,
          color: theme.onHeader,
          padding: `${padY}px ${padX}px`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: `${Math.round(w * 0.06)}px`, fontWeight: 800, marginBottom: Math.round(w * 0.025) }}>
          No events
        </div>
        <div style={{ fontSize: `${Math.round(w * 0.028)}px`, fontWeight: 500, opacity: 0.9 }}>
          Pick another period or clear the search
        </div>
      </div>
      <Footer w={w} padX={padX} />
    </>
  );
}
