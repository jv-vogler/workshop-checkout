import type { JSX } from 'react'

const headingLevelClasses = {
  1: 'text-4xl font-extrabold tracking-tight text-balance',
  2: 'border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
  3: 'text-2xl font-semibold tracking-tight',
  4: 'text-xl font-semibold tracking-tight',
}

export function TypographyHeading({
  children,
  level = 1,
  className = '',
}: {
  children?: React.ReactNode
  level?: 1 | 2 | 3 | 4
  className?: string
}) {
  if (!children) return null

  const Tag = `h${level}` as keyof JSX.IntrinsicElements
  const baseClass = 'scroll-m-20'
  const levelClass = headingLevelClasses[level] || ''

  return (
    <Tag className={`${baseClass} ${levelClass} ${className}`}>{children}</Tag>
  )
}

export function TypographyP({
  children,
  className = '',
}: {
  children?: React.ReactNode
  className?: string
}) {
  return (
    <p className={`leading-7 [&:not(:first-child)]:mt-6 ${className}`}>
      {children}
    </p>
  )
}

export function TypographyBlockquote({
  children,
  className = '',
}: {
  children?: React.ReactNode
  className?: string
}) {
  return (
    <blockquote className={`mt-6 border-l-2 pl-6 italic ${className}`}>
      {children}
    </blockquote>
  )
}

export function TypographyList({
  children,
  className = '',
}: {
  children?: React.ReactNode
  className?: string
}) {
  return (
    <ul className={`my-6 ml-6 list-disc [&>li]:mt-2 ${className}`}>
      {children}
    </ul>
  )
}

export function TypographyMuted({
  children,
  className = '',
}: {
  children?: React.ReactNode
  className?: string
}) {
  return (
    <p className={`text-muted-foreground text-sm ${className}`}>{children}</p>
  )
}

export function TypographyH1({
  children,
  className = '',
}: {
  children?: React.ReactNode
  className?: string
}) {
  return (
    <h1
      className={`scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance ${className}`}
    >
      {children}
    </h1>
  )
}

export function TypographyH2({
  children,
  className = '',
}: {
  children?: React.ReactNode
  className?: string
}) {
  return (
    <h2
      className={`scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 ${className}`}
    >
      {children}
    </h2>
  )
}

export function TypographyH3({
  children,
  className = '',
}: {
  children?: React.ReactNode
  className?: string
}) {
  return (
    <h3
      className={`scroll-m-20 text-2xl font-semibold tracking-tight ${className}`}
    >
      {children}
    </h3>
  )
}

export function TypographyH4({
  children,
  className = '',
}: {
  children?: React.ReactNode
  className?: string
}) {
  return (
    <h4
      className={`scroll-m-20 text-xl font-semibold tracking-tight ${className}`}
    >
      {children}
    </h4>
  )
}
