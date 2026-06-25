import type { Metadata } from 'next';
import Link from 'next/link';

import Breadcrumb from '@/components/Breadcrumb';
import { PageShell } from '@/components/SiteChrome';
import { toolsHref } from '@/lib/routes';

export const metadata: Metadata = {
  title: 'Pricing',
};

// Pricing plans (static until billing system is integrated)
const plans = [
  {
    name: 'Free',
    description: 'For casual use and quick one-off workflows.',
    price: 'Free',
    cta: 'Get started',
    href: toolsHref,
    featured: false,
    features: [
      'All catalog tools',
      '3 lightweight games',
      '100 credits per month',
      'Basic AI features',
      'Community support',
    ],
  },
  {
    name: 'Pro',
    description: 'For builders, marketers, and creators who use AI daily.',
    price: '$9',
    period: '/month',
    cta: 'Upgrade to Pro',
    href: toolsHref,
    featured: true,
    features: [
      'Everything in Free',
      '2,000 credits per month',
      'Advanced AI models',
      'Priority processing',
      'Export and history',
    ],
  },
  {
    name: 'Team',
    description: 'For teams that want shared usage and consistent outputs.',
    price: '$29',
    period: '/month',
    cta: 'Start team plan',
    href: toolsHref,
    featured: false,
    features: [
      'Everything in Pro',
      '10,000 credits per month',
      'Team workspace',
      'Shared prompt presets',
      'Admin usage controls',
    ],
  },
];

const faqs = [
  {
    question: 'Can I keep using the free tools?',
    answer:
      'Yes. All catalog tools and games remain free to use. Paid plans add higher AI credit limits, saved history, and team features.',
  },
  {
    question: 'How do credits work?',
    answer:
      'Credits are consumed when you run AI-powered writing or generation workflows. Free users receive a monthly allowance; Pro and Team plans include more credits.',
  },
  {
    question: 'Can teams share credits?',
    answer:
      'The Team tier is designed around shared workspaces, pooled credits, and reusable prompt presets.',
  },
];

export default function PricingPage() {
  return (
    <PageShell>
      <div className='mx-auto mt-8 w-full max-w-[1320px] px-6'>
        <Breadcrumb
          items={[{ label: 'Home', href: '/' }, { label: 'Pricing' }]}
        />
      </div>
      <section className='page-hero'>
        <p className='kicker'>Plans</p>
        <h1>
          <span style={{ color: 'var(--color-accent)' }}>Pricing</span>
        </h1>
        <p>
          Simple plans for browsing the tool catalog, running AI-assisted
          workflows, and sharing repeatable outputs with a team.
        </p>
      </section>

      <section className='section section--compact'>
        <div className='pricing-grid'>
          {plans.map((plan) => (
            <article
              className='pricing-card'
              data-featured={plan.featured ? 'true' : 'false'}
              key={plan.name}
            >
              {plan.featured ? (
                <span className='popular-badge'>Most popular</span>
              ) : null}
              <h2>{plan.name}</h2>
              <p>{plan.description}</p>
              <div className='price-line'>
                <strong>{plan.price}</strong>
                {plan.period ? <span>{plan.period}</span> : null}
              </div>
              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <Link
                className={`button ${plan.featured ? 'button--primary' : 'button--secondary'}`}
                href={plan.href}
              >
                {plan.cta}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className='section section--muted'>
        <div className='section__header'>
          <div>
            <p className='kicker'>Credits</p>
            <h2>How Credits Work</h2>
          </div>
        </div>
        <div className='feature-grid'>
          {[
            [
              'AI transforms',
              'Spend credits on generation, rewrite, and analysis workflows.',
            ],
            [
              'Saved history',
              'Keep repeatable outputs and revisit previous runs.',
            ],
            ['Team workflows', 'Share presets and usage across a small team.'],
          ].map(([title, body]) => (
            <article className='feature-card' key={title}>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className='section'>
        <div className='section__header'>
          <div>
            <p className='kicker'>FAQ</p>
            <h2>FAQ</h2>
          </div>
        </div>
        <div className='faq-list'>
          {faqs.map((faq) => (
            <article className='faq-item' key={faq.question}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className='section section--compact'>
        <div className='section__header'>
          <div>
            <p className='kicker'>Start</p>
            <h2>Ready to get started?</h2>
          </div>
          <Link href={toolsHref}>Explore tools</Link>
        </div>
      </section>
    </PageShell>
  );
}
