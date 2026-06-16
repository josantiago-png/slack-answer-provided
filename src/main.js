import './styles.css';

const app = document.querySelector('#app');

const questionIntro =
  'I am trying to figure out how to resolve this issue, but I cannot figure out if this is the right approach. Can you please review it and confirm?';

const questionTitle = 'Should we resolve the service mesh timeout issue by increasing retries?';

const aiSuggestedAnswer =
  'Increasing retries can help with short transient failures, but it should not be the only fix. The safer approach is to validate timeout budgets, add circuit breaker limits, and only raise retries after confirming the upstream service can absorb the extra load.';

const correctQuestionIntro =
  'I need a review on this rollout plan before I share it with the incident response group. Does this look like the right sequence?';

const correctQuestionTitle =
  'What is the recommended plan for migrating the Cloud Infra alert pipeline without missing critical pages?';

const correctSuggestedAnswer =
  'Use a staged migration: freeze alert rule edits before the window, export the current PagerDuty routing rules and service ownership map, run the new pipeline in shadow mode, compare events for at least two business days, and only cut over after confirming parity with the incident response leads.';

const sources = [
  { title: 'Cloud Infra service mesh retry guidance', meta: 'Google Docs' },
  { title: '#infra thread: service mesh timeout budget', meta: 'Slack' },
  { title: 'Envoy circuit breaker rollout notes', meta: 'Google Docs' },
  { title: 'Platform reliability review: retry storms', meta: 'Slack' },
  { title: 'Cloud Infra ownership map', meta: 'Stack Internal' },
  { title: 'Incident response runbook', meta: 'Google Docs' },
  { title: '#platform conversation: upstream saturation', meta: 'Slack' },
  { title: 'Service mesh production defaults', meta: 'Stack Internal' },
  { title: 'Retry policy migration checklist', meta: 'Google Docs' },
  { title: 'Cloud Infra weekly capacity notes', meta: 'Slack' },
];

const answerSources = sources.slice(0, 6);

const channels = [
  'announcements',
  'general',
  'engineering',
  'backend',
  'frontend',
  'platform',
  'infra',
  'security',
  'product',
  'design',
  'data-engineering',
  'ml-ai',
  'sales',
  'marketing',
  'hr',
  'watercooler',
];

const generalMessages = [
  {
    author: 'Rina Patel',
    time: '9:42 AM',
    avatar: 'RP',
    tone: 'blue',
    text: 'Morning. I moved the customer escalation notes into the shared launch doc and tagged the support leads.',
  },
  {
    author: 'Alex Chen',
    time: '9:48 AM',
    avatar: 'AC',
    tone: 'green',
    text: 'Thanks. I am going to use the same doc for the handoff checklist so everyone has one place to look.',
  },
  {
    author: 'Maya Torres',
    time: '10:03 AM',
    avatar: 'MT',
    tone: 'purple',
    text: 'Can someone from platform confirm whether the deploy freeze starts at noon or after the metrics review?',
  },
  {
    author: 'Drew Meacham',
    time: '10:08 AM',
    avatar: 'DM',
    tone: 'orange',
    text: 'After the metrics review. We still have one config validation to complete before the freeze window starts.',
  },
];

const drewAnswer = `To answer your question directly: No, we shouldn't just increase retries as a standalone fix. While cranking up retries is a tempting quick-fix for transient blips, doing it in isolation can accidentally trigger a "retry storm"—essentially DDoS'ing our own upstream services when they are already struggling.
Your proposed multi-layered approach is exactly the right engineering direction. Here is how we should proceed with it:
1. Validate Timeout Budgets First
Before we touch retries, we need to ensure our end-to-end deadlines are aligned. If a downstream service has a 5-second timeout, but the upstream dependencies total up to 8 seconds of potential processing time, the connection will drop anyway. We need to audit the Envoy/mesh configuration to make sure the budget flows logically down the stack.
2. Implement Circuit Breaking
We must protect the upstream service. Let's configure a circuit breaker in the service mesh to trip if the error rate spikes. This fails-fast, gives the struggling service a chance to recover, and prevents cascading failures across the platform.
3. Gradual Retry Adjustments (with Jitter)
Once the circuit breakers and timeouts are validated, we can selectively increase retries, but we must ensure they use exponential backoff and randomized jitter. This spreads out the load so the upstream service doesn't get hammered by perfectly synchronized retry requests.
Next Steps: Let's spin up a quick dev environment to test the circuit breaker thresholds. Can you share the specific Envoy/Mesh YAML file you are looking at? I’ll gladly jump in and co-author the updated configuration with you.`;

const answerItems = [
  {
    id: 'service-mesh-timeout-answer',
    time: '10:32 AM',
    blocks: [
      {
        type: 'section',
        style: 'body',
        text: {
          type: 'mrkdwn',
          text: `By you: ${questionIntro}`,
        },
      },
      {
        type: 'section',
        style: 'question',
        text: {
          type: 'mrkdwn',
          text: `*${questionTitle}*`,
        },
      },
      {
        type: 'section',
        style: 'body',
        text: {
          type: 'mrkdwn',
          text: aiSuggestedAnswer,
        },
      },
      {
        type: 'sources',
        sourceList: answerSources,
      },
      {
        type: 'answered',
        text: 'Answered by Drew',
      },
      {
        type: 'replySummary',
        channel: 'infra',
        label: '1 reply',
        time: 'Today at 9:37 AM',
      },
    ],
  },
  {
    id: 'cloud-infra-alert-pipeline-correct',
    time: '10:44 AM',
    blocks: [
      {
        type: 'section',
        style: 'body',
        text: {
          type: 'mrkdwn',
          text: `By you: ${correctQuestionIntro}`,
        },
      },
      {
        type: 'section',
        style: 'question',
        text: {
          type: 'mrkdwn',
          text: `*${correctQuestionTitle}*`,
        },
      },
      {
        type: 'section',
        style: 'body',
        text: {
          type: 'mrkdwn',
          text: correctSuggestedAnswer,
        },
      },
      {
        type: 'status',
        text: 'User marked this answer as correct',
      },
    ],
  },
];

const escapeHtml = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const renderMrkdwn = (value) =>
  escapeHtml(value)
    .replace(/\*([^*]+)\*/g, '<strong>$1</strong>')
    .replace(/&lt;@([^>]+)&gt;/g, '<span class="mention">@$1</span>');

const renderBlockText = (text) =>
  text.type === 'mrkdwn' ? renderMrkdwn(text.text) : escapeHtml(text.text);

const renderStackMark = (label = '') => `
  <svg class="stack-mark" viewBox="0 0 256 256" aria-hidden="true">
    <rect width="256" height="256" rx="52" fill="#ff5a00"></rect>
    <path fill="#1d1c1d" transform="scale(4)" d="m44.92 32.93.06.03-.02.02za27 27 0 0 0-3.6 6.07l-.05.1a27 27 0 0 0-1.88 6.75v.04a27 27 0 0 0-.07 7.11H12.39v-7.15h23.38l.15-.87-22.52-5.96 1.87-6.91 22.8 6.03.33-.68L17.93 25.8l3.62-6.2 20.77 11.85q.24-.3.5-.58l-17.01-16.8 5.12-5.06 17.29 17.07 1.82 1.8a28 28 0 0 0-5.12 5.05"></path>
  </svg>
  ${label ? `<span>${label}</span>` : ''}
`;

const renderIcon = (type, className = 'ui-icon') => {
  const icons = {
    home: '<path d="M4 10.7 12 4l8 6.7v8.05A1.25 1.25 0 0 1 18.75 20h-4.5v-5.5h-4.5V20h-4.5A1.25 1.25 0 0 1 4 18.75z"></path>',
    dms: '<path d="M7.5 6.5h7A4.5 4.5 0 0 1 19 11v.25a4.5 4.5 0 0 1-4.5 4.5H12l-4.25 3v-3h-.25A4.5 4.5 0 0 1 3 11.25V11a4.5 4.5 0 0 1 4.5-4.5Z"></path><path d="M8 10h8M8 13h5.5"></path>',
    activity: '<path d="M6.25 9.5a5.75 5.75 0 0 1 11.5 0v3.75l1.5 2.5H4.75l1.5-2.5z"></path><path d="M9.5 17.75a2.5 2.5 0 0 0 5 0"></path>',
    files: '<path d="M6 3.75h7.25L18 8.5v11.75H6z"></path><path d="M13.25 3.75V8.5H18"></path><path d="M8.75 12h6.5M8.75 15.25h6.5"></path>',
    later: '<path d="M7 4.5h10v15l-5-3.25-5 3.25z"></path>',
    moreHorizontal: '<path d="M5.25 12h.5M11.75 12h.5M18.25 12h.5"></path>',
    moreVertical: '<path d="M12 5.25v.5M12 11.75v.5M12 18.25v.5"></path>',
    chevronDown: '<path d="M6.5 9 12 14.5 17.5 9"></path>',
    star: '<path d="m12 3.75 2.4 4.86 5.36.78-3.88 3.78.92 5.34L12 16l-4.8 2.52.92-5.34-3.88-3.78 5.36-.78z"></path>',
    target: '<path d="M12 4v3M12 17v3M4 12h3M17 12h3"></path><circle cx="12" cy="12" r="6.25"></circle><circle cx="12" cy="12" r="2.25"></circle>',
    compose: '<path d="M5 5.5h9.5v4"></path><path d="M12 19H5V5.5"></path><path d="M14.25 14.75H19M16.625 12.375v4.75"></path>',
    search: '<circle cx="10.75" cy="10.75" r="5.75"></circle><path d="m15.25 15.25 4 4"></path>',
    bell: '<path d="M6.25 9.5a5.75 5.75 0 0 1 11.5 0v4.25l1.25 2H5l1.25-2z"></path><path d="M9.5 18a2.5 2.5 0 0 0 5 0"></path>',
    newChat: '<path d="M6 5.75h9.5A3.5 3.5 0 0 1 19 9.25v2A3.5 3.5 0 0 1 15.5 14.75H12l-4.25 3v-3H6A3.5 3.5 0 0 1 2.5 11.25v-2A3.5 3.5 0 0 1 6 5.75Z"></path><path d="M10.75 8.75v3.25M9.125 10.375h3.25"></path>',
    plus: '<path d="M12 5.25v13.5M5.25 12h13.5"></path>',
    smile: '<circle cx="12" cy="12" r="7.25"></circle><path d="M8.75 10h.01M15.25 10h.01M8.75 13.5a4 4 0 0 0 6.5 0"></path>',
    mention: '<circle cx="12" cy="12" r="7.25"></circle><path d="M14.75 15.5c-.85.6-1.77.75-2.75.75a4.25 4.25 0 1 1 4.25-4.25v.85c0 1.05.5 1.65 1.35 1.65.9 0 1.65-.85 1.65-2.5"></path><circle cx="12" cy="12" r="1.85"></circle>',
    send: '<path d="M4 4.75 19 12 4 19.25v-5.7L13.25 12 4 10.45z"></path>',
    comment: '<path d="M6.25 5.75h11.5A2.25 2.25 0 0 1 20 8v5.5a2.25 2.25 0 0 1-2.25 2.25H12l-4.5 3v-3H6.25A2.25 2.25 0 0 1 4 13.5V8a2.25 2.25 0 0 1 2.25-2.25Z"></path>',
    forward: '<path d="M13.5 6.5 19 12l-5.5 5.5"></path><path d="M18.5 12H9.75A5.75 5.75 0 0 0 4 17.75v.75"></path>',
    bookmark: '<path d="M7 4.5h10v15l-5-3.25-5 3.25z"></path>',
    close: '<path d="M6.25 6.25 17.75 17.75M17.75 6.25 6.25 17.75"></path>',
  };

  return `
    <svg class="${className}" viewBox="0 0 24 24" aria-hidden="true">
      ${icons[type]}
    </svg>
  `;
};

const renderSidebarIcon = (type) => {
  if (type === 'threads') {
    return renderIcon('dms', 'sidebar-icon');
  }

  return renderIcon('send', 'sidebar-icon');
};

const renderBlock = (block) => {
  if (block.type === 'header') {
    return `<div class="bk-block bk-header">${renderBlockText(block.text)}</div>`;
  }

  if (block.type === 'section') {
    return `<div class="bk-block bk-section" data-style="${block.style || 'body'}">${renderBlockText(block.text)}</div>`;
  }

  if (block.type === 'context') {
    return `<div class="bk-block bk-context">${block.elements
      .map((element) => `<span>${renderBlockText(element)}</span>`)
      .join('')}</div>`;
  }

  if (block.type === 'sources') {
    return renderSourcesDropdown(block.sourceList || sources);
  }

  if (block.type === 'answered') {
    return `<div class="bk-block bk-answered">${escapeHtml(block.text)}</div>`;
  }

  if (block.type === 'replySummary') {
    return `
      <button class="thread-summary thread-summary--answer" type="button" data-open-answer-thread>
        <span class="thread-summary-stack" aria-hidden="true">${renderStackMark()}</span>
        <span>${escapeHtml(block.label)}</span>
        <span>${escapeHtml(block.time)}</span>
      </button>
    `;
  }

  if (block.type === 'status') {
    return `
      <div class="bk-block bk-status">
        <span class="bk-status__icon" aria-hidden="true">
          <svg viewBox="0 0 16 16">
            <path d="M3.25 8.25 6.5 11.5l6.25-7"></path>
          </svg>
        </span>
        <span>${escapeHtml(block.text)}</span>
      </div>
    `;
  }

  return '';
};

const renderAnswerItem = (item) => `
  <article class="answer-message" id="${item.id}">
    ${renderStackMark()}
    <div class="answer-message__content">
      <div class="message-meta">
        <span class="message-author">Stack Internal</span>
        <span class="app-badge">APP</span>
        <span>${item.time}</span>
      </div>
      <div class="block-kit-message" aria-label="Stack Internal answer">
        ${item.blocks.map(renderBlock).join('')}
      </div>
    </div>
  </article>
`;

const renderToolbarIcon = (type) => {
  const icons = {
    link: `
      <svg viewBox="0 0 20 20">
        <path d="M8.25 11.75 11.75 8.25"></path>
        <path d="M8.9 5.7 10.35 4.25a3.25 3.25 0 0 1 4.6 4.6l-1.45 1.45"></path>
        <path d="M11.1 14.3 9.65 15.75a3.25 3.25 0 0 1-4.6-4.6L6.5 9.7"></path>
      </svg>
    `,
    ordered: `
      <svg viewBox="0 0 20 20">
        <path d="M7.75 6h8"></path>
        <path d="M7.75 14h8"></path>
        <path d="M3.6 4.75v3.5"></path>
        <path d="M3.1 12.25h1.25c.5 0 .9.4.9.9 0 .34-.18.62-.45.78L3.1 15.25h2.25"></path>
      </svg>
    `,
    bulleted: `
      <svg viewBox="0 0 20 20">
        <path d="M8 6h8"></path>
        <path d="M8 14h8"></path>
        <path d="M4.5 6h.01"></path>
        <path d="M4.5 14h.01"></path>
      </svg>
    `,
    code: `
      <svg viewBox="0 0 20 20">
        <path d="M7.25 5.75 3.5 10l3.75 4.25"></path>
        <path d="M11.65 5.25 8.35 14.75"></path>
        <path d="M12.75 5.75 16.5 10l-3.75 4.25"></path>
      </svg>
    `,
  };

  return `<span class="format-control format-control--${type}">${icons[type]}</span>`;
};

const renderComposer = (placeholder) => `
  <footer class="composer" aria-label="${escapeHtml(placeholder)} composer">
    <div class="composer-toolbar" aria-hidden="true">
      <span class="format-control format-control--bold">B</span>
      <span class="format-control format-control--italic">I</span>
      <span class="format-control format-control--strike">S</span>
      ${renderToolbarIcon('link')}
      ${renderToolbarIcon('ordered')}
      ${renderToolbarIcon('bulleted')}
      ${renderToolbarIcon('code')}
    </div>
    <div class="composer-input">
      <span data-composer-placeholder>${escapeHtml(placeholder)}</span>
      <span class="composer-send" aria-hidden="true">${renderIcon('send', 'composer-send-icon')}</span>
    </div>
    <div class="composer-footer" aria-hidden="true">
      <span class="composer-footer-control">${renderIcon('plus', 'composer-footer-icon')}</span>
      <span class="composer-footer-control">${renderIcon('smile', 'composer-footer-icon')}</span>
      <span class="composer-footer-control">${renderIcon('mention', 'composer-footer-icon')}</span>
    </div>
  </footer>
`;

const renderSourcesDropdown = (sourceList = sources) => `
  <details class="sources-dropdown">
    <summary>
      <span class="sources-toggle" aria-hidden="true">
        <svg viewBox="0 0 16 16">
          <path d="M4.2 6.2 8 10l3.8-3.8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>
      </span>
      <span>${sourceList.length} sources</span>
    </summary>
    <div class="sources-list">
      ${sourceList
        .map(
          (source) => `
            <div class="source-row">
              <span class="source-title">${escapeHtml(source.title)}</span>
              <span class="source-meta">${escapeHtml(source.meta)}</span>
            </div>
          `,
        )
        .join('')}
    </div>
  </details>
`;

const renderInfraMessage = () => `
  <article class="channel-message">
    ${renderStackMark()}
    <div class="channel-message__content">
      <div class="message-meta">
        <span class="message-author">Stack Internal</span>
        <span class="app-badge">APP</span>
        <span>10:12 AM</span>
      </div>
      <div class="channel-copy">
        This question from <span class="mention">@Alex Chen</span> was forwarded for anyone in this channel to answer.
      </div>
      <div class="channel-forwarded-content" aria-label="Forwarded question">
        <p>${escapeHtml(questionIntro)}</p>
        <p><strong>${escapeHtml(questionTitle)}</strong></p>
        <p>${escapeHtml(aiSuggestedAnswer)}</p>
      </div>
      ${renderSourcesDropdown()}
      <p class="answered-in-thread">Drew Meacham answered in thread</p>
      <button class="thread-summary thread-summary--channel" type="button" data-open-thread>
        <span class="thread-avatar">☺</span>
        <span>1 reply</span>
        <span>Today at 10:12 AM</span>
      </button>
      <div class="message-hover-actions" aria-hidden="true">
        ${renderStackMark()}
        <span class="hover-reaction">👀</span>
        <span class="hover-reaction">🙌</span>
        <span class="hover-control">${renderIcon('comment', 'hover-icon')}</span>
        <span class="hover-control">${renderIcon('forward', 'hover-icon')}</span>
        <span class="hover-control">${renderIcon('bookmark', 'hover-icon')}</span>
        <span class="hover-control">${renderIcon('moreVertical', 'hover-icon')}</span>
      </div>
    </div>
  </article>
`;

const renderCompanyMessage = (message) => `
  <article class="company-message">
    <div class="user-avatar user-avatar--${message.tone}" aria-hidden="true">${escapeHtml(message.avatar)}</div>
    <div class="company-message__content">
      <div class="message-meta">
        <span class="message-author">${escapeHtml(message.author)}</span>
        <span>${escapeHtml(message.time)}</span>
      </div>
      <p>${escapeHtml(message.text)}</p>
    </div>
  </article>
`;

const renderGeneralChannel = () => `
  <div class="channel-date-line"><span>Today</span></div>
  <div class="company-chat">
    ${generalMessages.map(renderCompanyMessage).join('')}
  </div>
`;

const renderPlaceholderChannel = (channel) => `
  <div class="channel-date-line"><span>Today</span></div>
  <div class="company-chat">
    ${renderCompanyMessage({
      author: 'Sam Rivera',
      time: '9:15 AM',
      avatar: 'SR',
      tone: 'blue',
      text: `No urgent updates in #${channel} yet today.`,
    })}
    ${renderCompanyMessage({
      author: 'Nina Woods',
      time: '9:22 AM',
      avatar: 'NW',
      tone: 'green',
      text: 'I will add notes here if anything needs broader visibility.',
    })}
  </div>
`;

const renderInfraChannel = () => `
  <div class="channel-date-line"><span>Today</span></div>
  ${renderInfraMessage()}
`;

const renderChannelContent = (channel) => {
  if (channel === 'infra') {
    return renderInfraChannel();
  }

  if (channel === 'general') {
    return renderGeneralChannel();
  }

  return renderPlaceholderChannel(channel);
};

const renderAppThreadParent = () => `
  <article class="thread-parent thread-parent--app">
    ${renderStackMark()}
    <div class="thread-message-content">
      <div class="message-meta">
        <span class="message-author">Stack Internal</span>
        <span class="app-badge">APP</span>
        <span>${answerItems[0].time}</span>
      </div>
      <div class="block-kit-message" aria-label="Stack Internal answer thread parent">
        ${answerItems[0].blocks
          .filter((block) => block.type !== 'replySummary')
          .map(renderBlock)
          .join('')}
      </div>
    </div>
  </article>
`;

const renderChannelThreadParent = () => `
  <article class="thread-parent">
    ${renderStackMark()}
    <div class="thread-message-content">
      <div class="message-meta">
        <span class="message-author">Stack Internal</span>
        <span class="app-badge">APP</span>
        <span>10:12 AM</span>
      </div>
      <p>This question from <span class="mention">@Alex Chen</span> was forwarded for anyone in this channel to answer.</p>
      <div class="thread-question">
        <strong>${escapeHtml(questionTitle)}</strong>
      </div>
    </div>
  </article>
`;

const renderThreadPanel = ({ appThread = false } = {}) => `
  <aside class="thread-panel ${appThread ? 'app-thread-panel' : ''}" aria-label="Thread">
    <header class="thread-header">
      <h2>Thread</h2>
      <button class="thread-close" type="button" aria-label="Close thread">
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="M5.25 5.25 14.75 14.75M14.75 5.25 5.25 14.75"></path>
        </svg>
      </button>
    </header>
    <div class="thread-body">
      ${appThread ? renderAppThreadParent() : renderChannelThreadParent()}
      <div class="thread-divider"></div>
      <article class="thread-reply">
        <div class="drew-avatar" aria-hidden="true">☺</div>
        <div class="thread-message-content">
          <div class="message-meta">
            <span class="message-author">Drew Meacham</span>
            <span>10:16 AM</span>
          </div>
          <div class="thread-answer">${renderMrkdwn(drewAnswer)}</div>
        </div>
      </article>
    </div>
    ${renderComposer('Reply...')}
  </aside>
`;

const renderThreadsView = () => `
  <section class="threads-view is-hidden" data-surface="threads" aria-label="Threads">
    <header class="threads-header">
      <h1>Threads</h1>
    </header>
    <div class="threads-body">
      <article class="threads-item">
        <div class="threads-item__meta">
          <button type="button" data-open-channel-thread="infra">#infra</button>
          <span>Today</span>
        </div>
        <div class="threads-item__content">
          <article class="thread-parent">
            ${renderStackMark()}
            <div class="thread-message-content">
              <div class="message-meta">
                <span class="message-author">Stack Internal</span>
                <span class="app-badge">APP</span>
                <span>10:12 AM</span>
              </div>
              <p>This question from <span class="mention">@Alex Chen</span> was forwarded for anyone in this channel to answer.</p>
              <div class="thread-question">
                <strong>${escapeHtml(questionTitle)}</strong>
              </div>
            </div>
          </article>
          <div class="thread-divider"></div>
          <article class="thread-reply">
            <div class="drew-avatar" aria-hidden="true">☺</div>
            <div class="thread-message-content">
              <div class="message-meta">
                <span class="message-author">Drew Meacham</span>
                <span>10:16 AM</span>
              </div>
              <div class="thread-answer">${renderMrkdwn(drewAnswer)}</div>
            </div>
          </article>
        </div>
      </article>
    </div>
  </section>
`;

app.innerHTML = `
  <main class="slack-shell" aria-label="Slack Stack Internal prototype">
    <aside class="workspace-rail" aria-label="Slack rail">
      <div class="workspace-avatar">A</div>
      <button class="rail-item is-active" type="button" aria-label="Home">
        <span class="rail-icon">${renderIcon('home', 'rail-svg')}</span>
        <span>Home</span>
      </button>
      <button class="rail-item" type="button" aria-label="DMs">
        <span class="rail-icon">${renderIcon('dms', 'rail-svg')}</span>
        <span>DMs</span>
      </button>
      <button class="rail-item" type="button" aria-label="Activity">
        <span class="rail-icon">${renderIcon('activity', 'rail-svg')}</span>
        <span>Activity</span>
      </button>
      <button class="rail-item" type="button" aria-label="Files">
        <span class="rail-icon">${renderIcon('files', 'rail-svg')}</span>
        <span>Files</span>
      </button>
      <button class="rail-item" type="button" aria-label="Later">
        <span class="rail-icon">${renderIcon('later', 'rail-svg')}</span>
        <span>Later</span>
      </button>
      <button class="rail-item" type="button" aria-label="More">
        <span class="rail-icon">${renderIcon('moreHorizontal', 'rail-svg')}</span>
        <span>More</span>
      </button>
    </aside>

    <aside class="slack-sidebar" aria-label="Acme Demo navigation">
      <header class="workspace-header">
        <button class="workspace-name" type="button">Acme Demo ${renderIcon('chevronDown', 'chevron-icon')}</button>
        <div class="workspace-tools" aria-hidden="true">
          <span class="workspace-tool">${renderIcon('target', 'workspace-tool-icon')}</span>
          <span class="workspace-tool">${renderIcon('compose', 'workspace-tool-icon')}</span>
        </div>
      </header>

      <nav class="sidebar-nav" aria-label="Slack sections">
        <a href="#" class="sidebar-link sidebar-link--muted threads-link" data-nav-target="threads">
          ${renderSidebarIcon('threads')}
          <span>Threads</span>
          <span class="unread-count">1</span>
        </a>

        <div class="sidebar-group">
          <div class="section-label">${renderIcon('chevronDown', 'section-chevron')}<span>Apps</span></div>
          <a href="#" class="sidebar-link app-link" data-nav-target="app">
            ${renderStackMark('Stack Internal')}
            <span class="unread-count">1</span>
          </a>
        </div>

        <div class="sidebar-group">
          <div class="section-label">${renderIcon('chevronDown', 'section-chevron')}<span>Channels</span></div>
          ${channels
            .map(
              (channel) =>
                `<a href="#" class="sidebar-link channel-link ${channel === 'general' ? 'is-active' : ''}" data-channel="${channel}" ${
                  channel === 'general' ? 'aria-current="page"' : ''
                }># ${channel}</a>`,
            )
            .join('')}
        </div>
      </nav>
    </aside>

    <section class="app-view is-hidden is-app-thread-closed" data-surface="app" aria-label="Stack Internal app">
      <section class="app-main" aria-label="Stack Internal app content">
        <header class="app-header">
          <div class="app-title">
            <span class="star" aria-hidden="true">${renderIcon('star', 'star-icon')}</span>
            ${renderStackMark()}
            <h1>Stack Internal</h1>
          </div>
          <div class="app-actions">
            <button class="new-chat-button" type="button">
              <span aria-hidden="true">${renderIcon('newChat', 'button-icon')}</span>
              New Chat
            </button>
            <button class="icon-action" type="button" aria-label="Search">${renderIcon('search', 'app-action-icon')}</button>
            <button class="icon-action" type="button" aria-label="Notifications">${renderIcon('bell', 'app-action-icon')}</button>
            <button class="icon-action" type="button" aria-label="More">${renderIcon('moreVertical', 'app-action-icon')}</button>
          </div>
        </header>

        <nav class="app-tabs" aria-label="Stack Internal tabs">
          <button class="tab-button is-active" type="button" data-tab="answers">Answers</button>
          <button class="tab-button" type="button" data-tab="chat">Chat</button>
        </nav>

        <section class="tab-panel is-active" data-panel="answers" aria-label="Provided answers">
          <div class="answer-list">
            ${answerItems.map(renderAnswerItem).join('')}
          </div>
        </section>

        <section class="tab-panel" data-panel="chat" aria-label="Chat with Stack Internal">
          <div class="chat-empty">
            ${renderStackMark()}
            <h2>Start a chat with Stack Internal</h2>
            <p>Ask a question or paste a thread to search trusted company context.</p>
            <button class="new-chat-button" type="button">
              <span aria-hidden="true">${renderIcon('newChat', 'button-icon')}</span>
              New Chat
            </button>
          </div>
        </section>
      </section>
      ${renderThreadPanel({ appThread: true })}
    </section>

    <section class="channel-workspace is-thread-closed" data-surface="channel" data-current-channel="general" aria-label="Channel">
      <section class="channel-view" aria-label="General channel">
        <header class="channel-header">
          <h1 data-channel-heading>#general</h1>
        </header>
        <div class="channel-body" data-channel-body>
          ${renderChannelContent('general')}
        </div>
        ${renderComposer('Message #general')}
      </section>
      ${renderThreadPanel()}
    </section>

    ${renderThreadsView()}
  </main>
`;

const setSurface = (surface) => {
  document.querySelectorAll('[data-surface]').forEach((element) => {
    element.classList.toggle('is-hidden', element.dataset.surface !== surface);
  });

  document.querySelectorAll('[data-nav-target]').forEach((element) => {
    const isActive = element.dataset.navTarget === surface;
    element.classList.toggle('is-active', isActive);
    if (isActive) {
      element.setAttribute('aria-current', 'page');
    } else {
      element.removeAttribute('aria-current');
    }
  });

  if (surface !== 'channel') {
    document.querySelectorAll('[data-channel]').forEach((link) => {
      link.classList.remove('is-active');
      link.removeAttribute('aria-current');
    });
  }
};

const setChannel = (channel, { openThread = false } = {}) => {
  const workspace = document.querySelector('.channel-workspace');
  const heading = document.querySelector('[data-channel-heading]');
  const body = document.querySelector('[data-channel-body]');
  const composerPlaceholder = document.querySelector(
    '.channel-view [data-composer-placeholder]',
  );

  workspace.dataset.currentChannel = channel;
  heading.textContent = `#${channel}`;
  body.innerHTML = renderChannelContent(channel);
  composerPlaceholder.textContent = `Message #${channel}`;

  document.querySelectorAll('[data-channel]').forEach((link) => {
    const isActive = link.dataset.channel === channel;
    link.classList.toggle('is-active', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });

  workspace.classList.toggle('is-thread-closed', channel !== 'infra' || !openThread);
};

document.querySelectorAll('[data-nav-target]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    setSurface(link.dataset.navTarget);
  });
});

document.querySelectorAll('[data-channel]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    setSurface('channel');
    setChannel(link.dataset.channel);
  });
});

document.querySelectorAll('[data-thread-shortcut]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    setSurface('channel');
    setChannel(link.dataset.threadShortcut, { openThread: true });
    document.querySelector('.channel-message')?.scrollIntoView({
      block: 'center',
      behavior: 'smooth',
    });
  });
});

document.querySelectorAll('[data-open-channel-thread]').forEach((button) => {
  button.addEventListener('click', () => {
    setSurface('channel');
    setChannel(button.dataset.openChannelThread, { openThread: true });
  });
});

document.querySelectorAll('.thread-close').forEach((button) => {
  button.addEventListener('click', () => {
    const appView = button.closest('.app-view');
    if (appView) {
      appView.classList.add('is-app-thread-closed');
      return;
    }

    document.querySelector('.channel-workspace')?.classList.add('is-thread-closed');
  });
});

document.addEventListener('click', (event) => {
  if (event.target.closest('[data-open-thread]')) {
    document.querySelector('.channel-workspace')?.classList.remove('is-thread-closed');
  }

  const answerThreadButton = event.target.closest('[data-open-answer-thread]');
  if (answerThreadButton) {
    document.querySelector('.app-view')?.classList.remove('is-app-thread-closed');
  }
});

document.querySelectorAll('.tab-button').forEach((button) => {
  button.addEventListener('click', () => {
    const tab = button.dataset.tab;

    document.querySelectorAll('.tab-button').forEach((tabButton) => {
      tabButton.classList.toggle('is-active', tabButton === button);
    });

    document.querySelectorAll('.tab-panel').forEach((panel) => {
      panel.classList.toggle('is-active', panel.dataset.panel === tab);
    });
  });
});
