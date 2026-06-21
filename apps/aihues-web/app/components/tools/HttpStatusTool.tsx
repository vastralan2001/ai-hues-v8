'use client';

import { useMemo, useState } from 'react';

import { t, type Locale } from '@/lib/dict';

import { ToolHeader, TOOL_WRAP } from './_kit';

interface HttpStatusToolProps {
  locale: Locale;
}

const STATUS_CODES = [
  {
    code: 100,
    name: 'Continue',
    desc: 'The server has received the request headers and the client should proceed to send the request body.',
  },
  {
    code: 101,
    name: 'Switching Protocols',
    desc: 'The server is switching to a different protocol as requested by the client.',
  },
  { code: 200, name: 'OK', desc: 'The request has succeeded.' },
  {
    code: 201,
    name: 'Created',
    desc: 'The request has succeeded and a new resource has been created.',
  },
  {
    code: 204,
    name: 'No Content',
    desc: 'The server successfully processed the request but is not returning any content.',
  },
  {
    code: 301,
    name: 'Moved Permanently',
    desc: 'The requested resource has been permanently moved to a new URL.',
  },
  {
    code: 302,
    name: 'Found',
    desc: 'The requested resource temporarily resides under a different URL.',
  },
  {
    code: 304,
    name: 'Not Modified',
    desc: 'The resource has not been modified since the version specified by the request headers.',
  },
  {
    code: 400,
    name: 'Bad Request',
    desc: 'The server cannot process the request due to client error.',
  },
  {
    code: 401,
    name: 'Unauthorized',
    desc: 'Authentication is required and has failed or has not been provided.',
  },
  {
    code: 403,
    name: 'Forbidden',
    desc: 'The server understood the request but refuses to authorize it.',
  },
  {
    code: 404,
    name: 'Not Found',
    desc: 'The requested resource could not be found on the server.',
  },
  {
    code: 405,
    name: 'Method Not Allowed',
    desc: 'The request method is not supported for the requested resource.',
  },
  {
    code: 409,
    name: 'Conflict',
    desc: 'The request could not be completed due to a conflict with the current state.',
  },
  {
    code: 422,
    name: 'Unprocessable Entity',
    desc: 'The request was well-formed but contains semantic errors.',
  },
  {
    code: 429,
    name: 'Too Many Requests',
    desc: 'The user has sent too many requests in a given amount of time.',
  },
  {
    code: 500,
    name: 'Internal Server Error',
    desc: 'The server encountered an unexpected condition.',
  },
  {
    code: 502,
    name: 'Bad Gateway',
    desc: 'The server received an invalid response from the upstream server.',
  },
  {
    code: 503,
    name: 'Service Unavailable',
    desc: 'The server is temporarily unable to handle the request.',
  },
  {
    code: 504,
    name: 'Gateway Timeout',
    desc: 'The server did not receive a timely response from the upstream server.',
  },
];

function getStatusColor(code: number): string {
  if (code >= 200 && code < 300) return 'text-green-600 dark:text-green-400';
  if (code >= 300 && code < 400) return 'text-amber-600 dark:text-amber-400';
  if (code >= 400 && code < 500) return 'text-orange-600 dark:text-orange-400';
  return 'text-red-600 dark:text-red-400';
}

function getStatusBg(code: number): string {
  if (code >= 200 && code < 300) return 'bg-green-50 dark:bg-green-950/30';
  if (code >= 300 && code < 400) return 'bg-amber-50 dark:bg-amber-950/30';
  if (code >= 400 && code < 500) return 'bg-orange-50 dark:bg-orange-950/30';
  return 'bg-red-50 dark:bg-red-950/30';
}

export default function HttpStatusTool({ locale }: HttpStatusToolProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return STATUS_CODES;
    return STATUS_CODES.filter(
      (s) =>
        String(s.code).includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.desc.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className={TOOL_WRAP}>
      <ToolHeader
        eyebrow={t(locale, 'cat.developer')}
        title={t(locale, 'tool.httpStatus.title')}
        desc={t(locale, 'tool.httpStatus.desc')}
      />

      <input
        className='mb-6 h-12 w-full rounded-[12px] border border-border bg-surface px-5 text-[15px] text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t(locale, 'tool.httpStatus.search')}
        type='text'
        value={query}
      />

      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
        {filtered.map((status) => (
          <div
            className='card-lift flex items-start gap-4 rounded-[14px] border border-border bg-surface p-4'
            key={status.code}
          >
            <span
              className={`shrink-0 rounded-[10px] px-3 py-1.5 text-[18px] font-extrabold ${getStatusBg(status.code)} ${getStatusColor(status.code)}`}
            >
              {status.code}
            </span>
            <div className='min-w-0'>
              <p className='font-bold text-foreground'>{status.name}</p>
              <p className='mt-1 text-[13px] leading-relaxed text-secondary'>
                {status.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
