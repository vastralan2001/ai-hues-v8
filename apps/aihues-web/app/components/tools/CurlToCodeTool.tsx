'use client';

import { useMemo, useState } from 'react';

import { type Locale } from '@/lib/dict';

import { CopyButton, Panel, ToolGrid, ToolHeader, TOOL_WRAP } from './_kit';

interface CurlToCodeToolProps {
  locale: Locale;
}

type Lang = 'python' | 'javascript' | 'go' | 'php';

interface ParsedCurl {
  method: string;
  url: string;
  headers: [string, string][];
  data: string;
  auth: string | null;
}

const SAMPLE = `curl -X POST https://api.example.com/v1/users \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer sk-123" \\
  -d '{"name":"Ada","role":"engineer"}'`;

/* ── tokenizer: respects quotes + backslash-newline continuation ── */
function tokenize(input: string): string[] {
  const text = input.replace(/\\\r?\n/g, ' ').trim();
  const tokens: string[] = [];
  let i = 0;
  const n = text.length;
  while (i < n) {
    while (i < n && /\s/.test(text[i])) i++;
    if (i >= n) break;
    let tok = '';
    while (i < n && !/\s/.test(text[i])) {
      const ch = text[i];
      if (ch === "'") {
        i++;
        while (i < n && text[i] !== "'") tok += text[i++];
        i++;
      } else if (ch === '"') {
        i++;
        while (i < n && text[i] !== '"') {
          if (text[i] === '\\' && i + 1 < n) {
            const nx = text[i + 1];
            if (nx === '"' || nx === '\\') {
              tok += nx;
              i += 2;
              continue;
            }
          }
          tok += text[i++];
        }
        i++;
      } else if (ch === '\\' && i + 1 < n) {
        tok += text[i + 1];
        i += 2;
      } else {
        tok += ch;
        i++;
      }
    }
    tokens.push(tok);
  }
  return tokens;
}

const VALUE_FLAGS = new Set([
  '-H',
  '--header',
  '-d',
  '--data',
  '--data-raw',
  '--data-binary',
  '--data-ascii',
  '--data-urlencode',
  '-u',
  '--user',
  '-b',
  '--cookie',
  '-e',
  '--referer',
  '-A',
  '--user-agent',
  '--url',
  '-X',
  '--request',
  '-o',
  '--output',
  '-x',
  '--proxy',
  '-T',
  '--upload-file',
  '-F',
  '--form',
]);

function parseCurl(input: string): ParsedCurl | null {
  const tokens = tokenize(input);
  if (tokens.length === 0) return null;
  if (tokens[0] === 'curl') tokens.shift();

  let method = '';
  let url = '';
  const headers: [string, string][] = [];
  const dataParts: string[] = [];
  let auth: string | null = null;
  let hasData = false;

  for (let i = 0; i < tokens.length; i++) {
    let tok = tokens[i];
    let inlineVal: string | null = null;

    // --flag=value
    if (tok.startsWith('--') && tok.includes('=')) {
      const eq = tok.indexOf('=');
      inlineVal = tok.slice(eq + 1);
      tok = tok.slice(0, eq);
    } else if (
      /^-[A-Za-z]/.test(tok) &&
      tok.length > 2 &&
      !tok.startsWith('--')
    ) {
      // short flag glued to value, e.g. -XPOST
      if (VALUE_FLAGS.has(tok.slice(0, 2))) {
        inlineVal = tok.slice(2);
        tok = tok.slice(0, 2);
      }
    }

    const takeVal = () => {
      if (inlineVal !== null) return inlineVal;
      return tokens[++i] ?? '';
    };

    switch (tok) {
      case '-X':
      case '--request':
        method = takeVal().toUpperCase();
        break;
      case '-H':
      case '--header': {
        const h = takeVal();
        const idx = h.indexOf(':');
        if (idx > -1)
          headers.push([h.slice(0, idx).trim(), h.slice(idx + 1).trim()]);
        break;
      }
      case '-d':
      case '--data':
      case '--data-raw':
      case '--data-binary':
      case '--data-ascii':
      case '--data-urlencode':
        dataParts.push(takeVal());
        hasData = true;
        break;
      case '-u':
      case '--user':
        auth = takeVal();
        break;
      case '-b':
      case '--cookie':
        headers.push(['Cookie', takeVal()]);
        break;
      case '-e':
      case '--referer':
        headers.push(['Referer', takeVal()]);
        break;
      case '-A':
      case '--user-agent':
        headers.push(['User-Agent', takeVal()]);
        break;
      case '--url':
        url = takeVal();
        break;
      case '-I':
      case '--head':
        if (!method) method = 'HEAD';
        break;
      case '-G':
      case '--get':
        method = 'GET';
        break;
      case '-o':
      case '--output':
      case '-x':
      case '--proxy':
      case '-T':
      case '--upload-file':
      case '-F':
      case '--form':
        takeVal();
        break;
      default:
        if (!tok.startsWith('-') && !url) url = tok;
        break;
    }
  }

  if (!method) method = hasData ? 'POST' : 'GET';
  return { method, url, headers, data: dataParts.join('&'), auth };
}

/* ── string escaping per language ── */
const jsStr = (s: string) => JSON.stringify(s);
const pyStr = (s: string) => JSON.stringify(s);
const phpStr = (s: string) =>
  `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
const goStr = (s: string) =>
  s.includes('`') || s.includes('\n') ? JSON.stringify(s) : '`' + s + '`';

function genPython(r: ParsedCurl): string {
  const lines = ['import requests', ''];
  lines.push(`url = ${pyStr(r.url)}`);
  if (r.headers.length) {
    lines.push('headers = {');
    r.headers.forEach(([k, v]) => lines.push(`    ${pyStr(k)}: ${pyStr(v)},`));
    lines.push('}');
  }
  if (r.data) lines.push(`data = ${pyStr(r.data)}`);
  const args = ['url'];
  if (r.headers.length) args.push('headers=headers');
  if (r.data) args.push('data=data');
  if (r.auth) {
    const [u, p = ''] = r.auth.split(':');
    args.push(`auth=(${pyStr(u)}, ${pyStr(p)})`);
  }
  lines.push('');
  lines.push(
    `response = requests.${r.method.toLowerCase()}(${args.join(', ')})`
  );
  lines.push('print(response.text)');
  return lines.join('\n');
}

function genJs(r: ParsedCurl): string {
  const opts: string[] = [`  method: ${jsStr(r.method)}`];
  const headerEntries = r.headers.map(
    ([k, v]) => `    ${jsStr(k)}: ${jsStr(v)}`
  );
  if (r.auth) {
    headerEntries.push(
      `    "Authorization": \`Basic \${btoa(${jsStr(r.auth)})}\``
    );
  }
  if (headerEntries.length) {
    opts.push(`  headers: {\n${headerEntries.join(',\n')}\n  }`);
  }
  if (r.data) opts.push(`  body: ${jsStr(r.data)}`);
  return (
    `fetch(${jsStr(r.url)}, {\n${opts.join(',\n')}\n})\n` +
    `  .then((res) => res.text())\n` +
    `  .then((data) => console.log(data));`
  );
}

function genGo(r: ParsedCurl): string {
  const imports = ['"fmt"', '"io"', '"net/http"'];
  if (r.data) imports.push('"strings"');
  const lines = [
    'package main',
    '',
    'import (',
    ...imports.map((s) => `\t${s}`),
    ')',
    '',
  ];
  lines.push('func main() {');
  const bodyArg = r.data ? `strings.NewReader(${goStr(r.data)})` : 'nil';
  lines.push(
    `\treq, _ := http.NewRequest(${goStr(r.method)}, ${goStr(r.url)}, ${bodyArg})`
  );
  r.headers.forEach(([k, v]) =>
    lines.push(`\treq.Header.Set(${goStr(k)}, ${goStr(v)})`)
  );
  if (r.auth) {
    const [u, p = ''] = r.auth.split(':');
    lines.push(`\treq.SetBasicAuth(${goStr(u)}, ${goStr(p)})`);
  }
  lines.push('');
  lines.push('\tresp, err := http.DefaultClient.Do(req)');
  lines.push('\tif err != nil {');
  lines.push('\t\tpanic(err)');
  lines.push('\t}');
  lines.push('\tdefer resp.Body.Close()');
  lines.push('\tbody, _ := io.ReadAll(resp.Body)');
  lines.push('\tfmt.Println(string(body))');
  lines.push('}');
  return lines.join('\n');
}

function genPhp(r: ParsedCurl): string {
  const lines = ['<?php', `$ch = curl_init(${phpStr(r.url)});`];
  lines.push('curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);');
  lines.push(`curl_setopt($ch, CURLOPT_CUSTOMREQUEST, ${phpStr(r.method)});`);
  if (r.headers.length) {
    lines.push('curl_setopt($ch, CURLOPT_HTTPHEADER, [');
    r.headers.forEach(([k, v]) => lines.push(`    ${phpStr(`${k}: ${v}`)},`));
    lines.push(']);');
  }
  if (r.data)
    lines.push(`curl_setopt($ch, CURLOPT_POSTFIELDS, ${phpStr(r.data)});`);
  if (r.auth)
    lines.push(`curl_setopt($ch, CURLOPT_USERPWD, ${phpStr(r.auth)});`);
  lines.push('');
  lines.push('$response = curl_exec($ch);');
  lines.push('curl_close($ch);');
  lines.push('echo $response;');
  return lines.join('\n');
}

const GENERATORS: Record<Lang, (r: ParsedCurl) => string> = {
  python: genPython,
  javascript: genJs,
  go: genGo,
  php: genPhp,
};

export default function CurlToCodeTool({ locale }: CurlToCodeToolProps) {
  const zh = locale === 'zh';
  const [input, setInput] = useState(SAMPLE);
  const [lang, setLang] = useState<Lang>('python');

  const parsed = useMemo(() => parseCurl(input), [input]);
  const output = useMemo(() => {
    if (!parsed || !parsed.url) return '';
    return GENERATORS[lang](parsed);
  }, [parsed, lang]);

  const seg =
    'h-8 rounded-[7px] px-3 text-[12px] font-semibold transition-colors';
  const segOn = 'bg-accent text-white';
  const segOff = 'text-secondary hover:text-foreground';

  const langs: { v: Lang; label: string }[] = [
    { v: 'python', label: 'Python' },
    { v: 'javascript', label: 'JavaScript' },
    { v: 'go', label: 'Go' },
    { v: 'php', label: 'PHP' },
  ];

  return (
    <div className={TOOL_WRAP}>
      <ToolHeader
        eyebrow={zh ? '开发者工具' : 'Developer'}
        title={zh ? 'cURL 转代码' : 'cURL to Code'}
        desc={
          zh
            ? '粘贴 curl 命令，立即转换成 Python、JavaScript、Go 或 PHP 代码。'
            : 'Paste a curl command and convert it to Python, JavaScript, Go, or PHP instantly.'
        }
      />

      <ToolGrid>
        <Panel label={zh ? 'cURL 命令' : 'cURL command'}>
          <textarea
            className='min-h-[360px] w-full flex-1 resize-y border-0 bg-transparent p-4 font-mono text-[13px] leading-relaxed text-foreground outline-none placeholder:text-muted'
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              zh ? '在此粘贴 curl 命令…' : 'Paste your curl command here…'
            }
            spellCheck={false}
            value={input}
          />
        </Panel>

        <Panel
          label={zh ? '代码' : 'Code'}
          action={
            <div className='flex items-center gap-2'>
              <div className='inline-flex rounded-[9px] border border-border bg-bg p-1'>
                {langs.map((o) => (
                  <button
                    key={o.v}
                    type='button'
                    onClick={() => setLang(o.v)}
                    className={`${seg} ${lang === o.v ? segOn : segOff}`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
              {output ? <CopyButton text={output} /> : null}
            </div>
          }
        >
          <div className='min-h-[360px] flex-1 overflow-auto p-4'>
            {output ? (
              <pre className='whitespace-pre font-mono text-[13px] leading-relaxed text-foreground'>
                {output}
              </pre>
            ) : (
              <span className='text-[13px] text-muted'>
                {zh
                  ? '等待有效的 curl 命令…'
                  : 'Waiting for a valid curl command…'}
              </span>
            )}
          </div>
        </Panel>
      </ToolGrid>
    </div>
  );
}
