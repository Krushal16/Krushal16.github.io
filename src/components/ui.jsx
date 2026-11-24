import Icon from './Icon.jsx'

const base =
  'group inline-flex items-center justify-center gap-2.5 rounded-full text-[15px] font-medium tracking-[-0.01em] transition-[background-color,color,border-color,transform] duration-300 ease-out-expo focus-visible:outline-none active:scale-[0.98] whitespace-nowrap'

const variants = {
  primary: 'bg-fog text-ink hover:bg-white h-12 px-6',
  secondary: 'border border-line-strong text-fog hover:border-fog/50 hover:bg-white/[0.04] h-12 px-6',
  ghost: 'text-ash hover:text-fog h-10 px-3',
  small: 'border border-line-strong text-fog hover:border-fog/50 hover:bg-white/[0.04] h-9 px-4 text-[14px]',
}

/** Button or link with the site's styles. Pass `href` for a link. `external` opens a new tab. */
export function Button({ href, variant = 'primary', icon, iconRight, external, className = '', children, ...rest }) {
  const cls = `${base} ${variants[variant]} ${className}`
  const content = (
    <>
      {icon && <Icon name={icon} size={17} className="shrink-0" />}
      <span>{children}</span>
      {iconRight && (
        <Icon
          name={iconRight}
          size={16}
          className="shrink-0 transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-px"
        />
      )}
    </>
  )
  if (href) {
    const ext = external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
    return (
      <a href={href} className={cls} {...ext} {...rest}>
        {content}
        {external && <span className="sr-only"> (opens in a new tab)</span>}
      </a>
    )
  }
  return (
    <button type="button" className={cls} {...rest}>
      {content}
    </button>
  )
}

/** Round icon-only link (GitHub, LinkedIn…). */
export function IconLink({ href, icon, label, size = 18, className = '', external = true }) {
  const ext = external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
  return (
    <a
      href={href}
      aria-label={label}
      title={label}
      className={`grid size-10 place-items-center rounded-full text-ash transition-colors duration-300 hover:bg-white/[0.06] hover:text-fog ${className}`}
      {...ext}
    >
      <Icon name={icon} size={size} />
    </a>
  )
}

/** Section scaffold: a quiet label column and a content column, on the shared grid. */
export function Section({ id, label, children, className = '' }) {
  return (
    <section id={id} aria-labelledby={`${id}-label`} className={`relative scroll-mt-24 ${className}`}>
      <div className="container-x">
        <h2 id={`${id}-label`} className="section-label">
          {label}
        </h2>
        {children}
      </div>
    </section>
  )
}

export function Chip({ children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-line px-3 py-1 text-[13px] leading-5 text-ash ${className}`}
    >
      {children}
    </span>
  )
}

export function StatusBadge({ children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-signal/40 bg-signal/10 px-3 py-1 text-[13px] leading-5 text-signal-soft">
      <span className="pulse-dot pulse-dot--current" aria-hidden="true" />
      {children}
    </span>
  )
}
