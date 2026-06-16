(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))l(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const c of o.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&l(c)}).observe(document,{childList:!0,subtree:!0});function r(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function l(n){if(n.ep)return;n.ep=!0;const o=r(n);fetch(n.href,o)}})();const q=document.querySelector("#app"),$="I am trying to figure out how to resolve this issue, but I cannot figure out if this is the right approach. Can you please review it and confirm?",p="Should we resolve the service mesh timeout issue by increasing retries?",k="Increasing retries can help with short transient failures, but it should not be the only fix. The safer approach is to validate timeout budgets, add circuit breaker limits, and only raise retries after confirming the upstream service can absorb the extra load.",T="I need a review on this rollout plan before I share it with the incident response group. Does this look like the right sequence?",C="What is the recommended plan for migrating the Cloud Infra alert pipeline without missing critical pages?",L="Use a staged migration: freeze alert rule edits before the window, export the current PagerDuty routing rules and service ownership map, run the new pipeline in shadow mode, compare events for at least two business days, and only cut over after confirming parity with the incident response leads.",g=[{title:"Cloud Infra service mesh retry guidance",meta:"Google Docs"},{title:"#infra thread: service mesh timeout budget",meta:"Slack"},{title:"Envoy circuit breaker rollout notes",meta:"Google Docs"},{title:"Platform reliability review: retry storms",meta:"Slack"},{title:"Cloud Infra ownership map",meta:"Stack Internal"},{title:"Incident response runbook",meta:"Google Docs"},{title:"#platform conversation: upstream saturation",meta:"Slack"},{title:"Service mesh production defaults",meta:"Stack Internal"},{title:"Retry policy migration checklist",meta:"Google Docs"},{title:"Cloud Infra weekly capacity notes",meta:"Slack"}],D=g.slice(0,6),P=["announcements","general","engineering","backend","frontend","platform","infra","security","product","design","data-engineering","ml-ai","sales","marketing","hr","watercooler"],E=[{author:"Rina Patel",time:"9:42 AM",avatar:"RP",tone:"blue",text:"Morning. I moved the customer escalation notes into the shared launch doc and tagged the support leads."},{author:"Alex Chen",time:"9:48 AM",avatar:"AC",tone:"green",text:"Thanks. I am going to use the same doc for the handoff checklist so everyone has one place to look."},{author:"Maya Torres",time:"10:03 AM",avatar:"MT",tone:"purple",text:"Can someone from platform confirm whether the deploy freeze starts at noon or after the metrics review?"},{author:"Drew Meacham",time:"10:08 AM",avatar:"DM",tone:"orange",text:"After the metrics review. We still have one config validation to complete before the freeze window starts."}],M=`To answer your question directly: No, we shouldn't just increase retries as a standalone fix. While cranking up retries is a tempting quick-fix for transient blips, doing it in isolation can accidentally trigger a "retry storm"—essentially DDoS'ing our own upstream services when they are already struggling.
Your proposed multi-layered approach is exactly the right engineering direction. Here is how we should proceed with it:
1. Validate Timeout Budgets First
Before we touch retries, we need to ensure our end-to-end deadlines are aligned. If a downstream service has a 5-second timeout, but the upstream dependencies total up to 8 seconds of potential processing time, the connection will drop anyway. We need to audit the Envoy/mesh configuration to make sure the budget flows logically down the stack.
2. Implement Circuit Breaking
We must protect the upstream service. Let's configure a circuit breaker in the service mesh to trip if the error rate spikes. This fails-fast, gives the struggling service a chance to recover, and prevents cascading failures across the platform.
3. Gradual Retry Adjustments (with Jitter)
Once the circuit breakers and timeouts are validated, we can selectively increase retries, but we must ensure they use exponential backoff and randomized jitter. This spreads out the load so the upstream service doesn't get hammered by perfectly synchronized retry requests.
Next Steps: Let's spin up a quick dev environment to test the circuit breaker thresholds. Can you share the specific Envoy/Mesh YAML file you are looking at? I’ll gladly jump in and co-author the updated configuration with you.`,v=[{id:"service-mesh-timeout-answer",time:"10:32 AM",blocks:[{type:"section",style:"body",text:{type:"mrkdwn",text:`By you: ${$}`}},{type:"section",style:"question",text:{type:"mrkdwn",text:`*${p}*`}},{type:"section",style:"body",text:{type:"mrkdwn",text:k}},{type:"sources",sourceList:D},{type:"answered",text:"Answered by Drew"},{type:"replySummary",channel:"infra",label:"1 reply",time:"Today at 9:37 AM"}]},{id:"cloud-infra-alert-pipeline-correct",time:"10:44 AM",blocks:[{type:"section",style:"body",text:{type:"mrkdwn",text:`By you: ${T}`}},{type:"section",style:"question",text:{type:"mrkdwn",text:`*${C}*`}},{type:"section",style:"body",text:{type:"mrkdwn",text:L}},{type:"status",text:"User marked this answer as correct"}]}],s=e=>e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),y=e=>s(e).replace(/\*([^*]+)\*/g,"<strong>$1</strong>").replace(/&lt;@([^>]+)&gt;/g,'<span class="mention">@$1</span>'),u=e=>e.type==="mrkdwn"?y(e.text):s(e.text),i=(e="")=>`
  <svg class="stack-mark" viewBox="0 0 256 256" aria-hidden="true">
    <rect width="256" height="256" rx="52" fill="#ff5a00"></rect>
    <path fill="#1d1c1d" transform="scale(4)" d="m44.92 32.93.06.03-.02.02za27 27 0 0 0-3.6 6.07l-.05.1a27 27 0 0 0-1.88 6.75v.04a27 27 0 0 0-.07 7.11H12.39v-7.15h23.38l.15-.87-22.52-5.96 1.87-6.91 22.8 6.03.33-.68L17.93 25.8l3.62-6.2 20.77 11.85q.24-.3.5-.58l-17.01-16.8 5.12-5.06 17.29 17.07 1.82 1.8a28 28 0 0 0-5.12 5.05"></path>
  </svg>
  ${e?`<span>${e}</span>`:""}
`,t=(e,a="ui-icon")=>`
    <svg class="${a}" viewBox="0 0 24 24" aria-hidden="true">
      ${{home:'<path d="M4 10.7 12 4l8 6.7v8.05A1.25 1.25 0 0 1 18.75 20h-4.5v-5.5h-4.5V20h-4.5A1.25 1.25 0 0 1 4 18.75z"></path>',dms:'<path d="M7.5 6.5h7A4.5 4.5 0 0 1 19 11v.25a4.5 4.5 0 0 1-4.5 4.5H12l-4.25 3v-3h-.25A4.5 4.5 0 0 1 3 11.25V11a4.5 4.5 0 0 1 4.5-4.5Z"></path><path d="M8 10h8M8 13h5.5"></path>',activity:'<path d="M6.25 9.5a5.75 5.75 0 0 1 11.5 0v3.75l1.5 2.5H4.75l1.5-2.5z"></path><path d="M9.5 17.75a2.5 2.5 0 0 0 5 0"></path>',files:'<path d="M6 3.75h7.25L18 8.5v11.75H6z"></path><path d="M13.25 3.75V8.5H18"></path><path d="M8.75 12h6.5M8.75 15.25h6.5"></path>',later:'<path d="M7 4.5h10v15l-5-3.25-5 3.25z"></path>',moreHorizontal:'<path d="M5.25 12h.5M11.75 12h.5M18.25 12h.5"></path>',moreVertical:'<path d="M12 5.25v.5M12 11.75v.5M12 18.25v.5"></path>',chevronDown:'<path d="M6.5 9 12 14.5 17.5 9"></path>',star:'<path d="m12 3.75 2.4 4.86 5.36.78-3.88 3.78.92 5.34L12 16l-4.8 2.52.92-5.34-3.88-3.78 5.36-.78z"></path>',target:'<path d="M12 4v3M12 17v3M4 12h3M17 12h3"></path><circle cx="12" cy="12" r="6.25"></circle><circle cx="12" cy="12" r="2.25"></circle>',compose:'<path d="M5 5.5h9.5v4"></path><path d="M12 19H5V5.5"></path><path d="M14.25 14.75H19M16.625 12.375v4.75"></path>',search:'<circle cx="10.75" cy="10.75" r="5.75"></circle><path d="m15.25 15.25 4 4"></path>',bell:'<path d="M6.25 9.5a5.75 5.75 0 0 1 11.5 0v4.25l1.25 2H5l1.25-2z"></path><path d="M9.5 18a2.5 2.5 0 0 0 5 0"></path>',newChat:'<path d="M6 5.75h9.5A3.5 3.5 0 0 1 19 9.25v2A3.5 3.5 0 0 1 15.5 14.75H12l-4.25 3v-3H6A3.5 3.5 0 0 1 2.5 11.25v-2A3.5 3.5 0 0 1 6 5.75Z"></path><path d="M10.75 8.75v3.25M9.125 10.375h3.25"></path>',plus:'<path d="M12 5.25v13.5M5.25 12h13.5"></path>',smile:'<circle cx="12" cy="12" r="7.25"></circle><path d="M8.75 10h.01M15.25 10h.01M8.75 13.5a4 4 0 0 0 6.5 0"></path>',mention:'<circle cx="12" cy="12" r="7.25"></circle><path d="M14.75 15.5c-.85.6-1.77.75-2.75.75a4.25 4.25 0 1 1 4.25-4.25v.85c0 1.05.5 1.65 1.35 1.65.9 0 1.65-.85 1.65-2.5"></path><circle cx="12" cy="12" r="1.85"></circle>',send:'<path d="M4 4.75 19 12 4 19.25v-5.7L13.25 12 4 10.45z"></path>',comment:'<path d="M6.25 5.75h11.5A2.25 2.25 0 0 1 20 8v5.5a2.25 2.25 0 0 1-2.25 2.25H12l-4.5 3v-3H6.25A2.25 2.25 0 0 1 4 13.5V8a2.25 2.25 0 0 1 2.25-2.25Z"></path>',forward:'<path d="M13.5 6.5 19 12l-5.5 5.5"></path><path d="M18.5 12H9.75A5.75 5.75 0 0 0 4 17.75v.75"></path>',bookmark:'<path d="M7 4.5h10v15l-5-3.25-5 3.25z"></path>',close:'<path d="M6.25 6.25 17.75 17.75M17.75 6.25 6.25 17.75"></path>'}[e]}
    </svg>
  `,H=e=>t("dms","sidebar-icon"),A=e=>e.type==="header"?`<div class="bk-block bk-header">${u(e.text)}</div>`:e.type==="section"?`<div class="bk-block bk-section" data-style="${e.style||"body"}">${u(e.text)}</div>`:e.type==="context"?`<div class="bk-block bk-context">${e.elements.map(a=>`<span>${u(a)}</span>`).join("")}</div>`:e.type==="sources"?x(e.sourceList||g):e.type==="answered"?`<div class="bk-block bk-answered">${s(e.text)}</div>`:e.type==="replySummary"?`
      <button class="thread-summary thread-summary--answer" type="button" data-open-answer-thread>
        <span class="thread-summary-stack" aria-hidden="true">${i()}</span>
        <span>${s(e.label)}</span>
        <span>${s(e.time)}</span>
      </button>
    `:e.type==="status"?`
      <div class="bk-block bk-status">
        <span class="bk-status__icon" aria-hidden="true">
          <svg viewBox="0 0 16 16">
            <path d="M3.25 8.25 6.5 11.5l6.25-7"></path>
          </svg>
        </span>
        <span>${s(e.text)}</span>
      </div>
    `:"",B=e=>`
  <article class="answer-message" id="${e.id}">
    ${i()}
    <div class="answer-message__content">
      <div class="message-meta">
        <span class="message-author">Stack Internal</span>
        <span class="app-badge">APP</span>
        <span>${e.time}</span>
      </div>
      <div class="block-kit-message" aria-label="Stack Internal answer">
        ${e.blocks.map(A).join("")}
      </div>
    </div>
  </article>
`,d=e=>`<span class="format-control format-control--${e}">${{link:`
      <svg viewBox="0 0 20 20">
        <path d="M8.25 11.75 11.75 8.25"></path>
        <path d="M8.9 5.7 10.35 4.25a3.25 3.25 0 0 1 4.6 4.6l-1.45 1.45"></path>
        <path d="M11.1 14.3 9.65 15.75a3.25 3.25 0 0 1-4.6-4.6L6.5 9.7"></path>
      </svg>
    `,ordered:`
      <svg viewBox="0 0 20 20">
        <path d="M7.75 6h8"></path>
        <path d="M7.75 14h8"></path>
        <path d="M3.6 4.75v3.5"></path>
        <path d="M3.1 12.25h1.25c.5 0 .9.4.9.9 0 .34-.18.62-.45.78L3.1 15.25h2.25"></path>
      </svg>
    `,bulleted:`
      <svg viewBox="0 0 20 20">
        <path d="M8 6h8"></path>
        <path d="M8 14h8"></path>
        <path d="M4.5 6h.01"></path>
        <path d="M4.5 14h.01"></path>
      </svg>
    `,code:`
      <svg viewBox="0 0 20 20">
        <path d="M7.25 5.75 3.5 10l3.75 4.25"></path>
        <path d="M11.65 5.25 8.35 14.75"></path>
        <path d="M12.75 5.75 16.5 10l-3.75 4.25"></path>
      </svg>
    `}[e]}</span>`,S=e=>`
  <footer class="composer" aria-label="${s(e)} composer">
    <div class="composer-toolbar" aria-hidden="true">
      <span class="format-control format-control--bold">B</span>
      <span class="format-control format-control--italic">I</span>
      <span class="format-control format-control--strike">S</span>
      ${d("link")}
      ${d("ordered")}
      ${d("bulleted")}
      ${d("code")}
    </div>
    <div class="composer-input">
      <span data-composer-placeholder>${s(e)}</span>
      <span class="composer-send" aria-hidden="true">${t("send","composer-send-icon")}</span>
    </div>
    <div class="composer-footer" aria-hidden="true">
      <span class="composer-footer-control">${t("plus","composer-footer-icon")}</span>
      <span class="composer-footer-control">${t("smile","composer-footer-icon")}</span>
      <span class="composer-footer-control">${t("mention","composer-footer-icon")}</span>
    </div>
  </footer>
`,x=(e=g)=>`
  <details class="sources-dropdown">
    <summary>
      <span class="sources-toggle" aria-hidden="true">
        <svg viewBox="0 0 16 16">
          <path d="M4.2 6.2 8 10l3.8-3.8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>
      </span>
      <span>${e.length} sources</span>
    </summary>
    <div class="sources-list">
      ${e.map(a=>`
            <div class="source-row">
              <span class="source-title">${s(a.title)}</span>
              <span class="source-meta">${s(a.meta)}</span>
            </div>
          `).join("")}
    </div>
  </details>
`,z=()=>`
  <article class="channel-message">
    ${i()}
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
        <p>${s($)}</p>
        <p><strong>${s(p)}</strong></p>
        <p>${s(k)}</p>
      </div>
      ${x()}
      <p class="answered-in-thread">Drew Meacham answered in thread</p>
      <button class="thread-summary thread-summary--channel" type="button" data-open-thread>
        <span class="thread-avatar">☺</span>
        <span>1 reply</span>
        <span>Today at 10:12 AM</span>
      </button>
      <div class="message-hover-actions" aria-hidden="true">
        ${i()}
        <span class="hover-reaction">👀</span>
        <span class="hover-reaction">🙌</span>
        <span class="hover-control">${t("comment","hover-icon")}</span>
        <span class="hover-control">${t("forward","hover-icon")}</span>
        <span class="hover-control">${t("bookmark","hover-icon")}</span>
        <span class="hover-control">${t("moreVertical","hover-icon")}</span>
      </div>
    </div>
  </article>
`,m=e=>`
  <article class="company-message">
    <div class="user-avatar user-avatar--${e.tone}" aria-hidden="true">${s(e.avatar)}</div>
    <div class="company-message__content">
      <div class="message-meta">
        <span class="message-author">${s(e.author)}</span>
        <span>${s(e.time)}</span>
      </div>
      <p>${s(e.text)}</p>
    </div>
  </article>
`,j=()=>`
  <div class="channel-date-line"><span>Today</span></div>
  <div class="company-chat">
    ${E.map(m).join("")}
  </div>
`,V=e=>`
  <div class="channel-date-line"><span>Today</span></div>
  <div class="company-chat">
    ${m({author:"Sam Rivera",time:"9:15 AM",avatar:"SR",tone:"blue",text:`No urgent updates in #${e} yet today.`})}
    ${m({author:"Nina Woods",time:"9:22 AM",avatar:"NW",tone:"green",text:"I will add notes here if anything needs broader visibility."})}
  </div>
`,_=()=>`
  <div class="channel-date-line"><span>Today</span></div>
  ${z()}
`,I=e=>e==="infra"?_():e==="general"?j():V(e),N=()=>`
  <article class="thread-parent thread-parent--app">
    ${i()}
    <div class="thread-message-content">
      <div class="message-meta">
        <span class="message-author">Stack Internal</span>
        <span class="app-badge">APP</span>
        <span>${v[0].time}</span>
      </div>
      <div class="block-kit-message" aria-label="Stack Internal answer thread parent">
        ${v[0].blocks.filter(e=>e.type!=="replySummary").map(A).join("")}
      </div>
    </div>
  </article>
`,G=()=>`
  <article class="thread-parent">
    ${i()}
    <div class="thread-message-content">
      <div class="message-meta">
        <span class="message-author">Stack Internal</span>
        <span class="app-badge">APP</span>
        <span>10:12 AM</span>
      </div>
      <p>This question from <span class="mention">@Alex Chen</span> was forwarded for anyone in this channel to answer.</p>
      <div class="thread-question">
        <strong>${s(p)}</strong>
      </div>
    </div>
  </article>
`,w=({appThread:e=!1}={})=>`
  <aside class="thread-panel ${e?"app-thread-panel":""}" aria-label="Thread">
    <header class="thread-header">
      <h2>Thread</h2>
      <button class="thread-close" type="button" aria-label="Close thread">
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="M5.25 5.25 14.75 14.75M14.75 5.25 5.25 14.75"></path>
        </svg>
      </button>
    </header>
    <div class="thread-body">
      ${e?N():G()}
      <div class="thread-divider"></div>
      <article class="thread-reply">
        <div class="drew-avatar" aria-hidden="true">☺</div>
        <div class="thread-message-content">
          <div class="message-meta">
            <span class="message-author">Drew Meacham</span>
            <span>10:16 AM</span>
          </div>
          <div class="thread-answer">${y(M)}</div>
        </div>
      </article>
    </div>
    ${S("Reply...")}
  </aside>
`,O=()=>`
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
            ${i()}
            <div class="thread-message-content">
              <div class="message-meta">
                <span class="message-author">Stack Internal</span>
                <span class="app-badge">APP</span>
                <span>10:12 AM</span>
              </div>
              <p>This question from <span class="mention">@Alex Chen</span> was forwarded for anyone in this channel to answer.</p>
              <div class="thread-question">
                <strong>${s(p)}</strong>
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
              <div class="thread-answer">${y(M)}</div>
            </div>
          </article>
        </div>
      </article>
    </div>
  </section>
`;q.innerHTML=`
  <main class="slack-shell" aria-label="Slack Stack Internal prototype">
    <aside class="workspace-rail" aria-label="Slack rail">
      <div class="workspace-avatar">A</div>
      <button class="rail-item is-active" type="button" aria-label="Home">
        <span class="rail-icon">${t("home","rail-svg")}</span>
        <span>Home</span>
      </button>
      <button class="rail-item" type="button" aria-label="DMs">
        <span class="rail-icon">${t("dms","rail-svg")}</span>
        <span>DMs</span>
      </button>
      <button class="rail-item" type="button" aria-label="Activity">
        <span class="rail-icon">${t("activity","rail-svg")}</span>
        <span>Activity</span>
      </button>
      <button class="rail-item" type="button" aria-label="Files">
        <span class="rail-icon">${t("files","rail-svg")}</span>
        <span>Files</span>
      </button>
      <button class="rail-item" type="button" aria-label="Later">
        <span class="rail-icon">${t("later","rail-svg")}</span>
        <span>Later</span>
      </button>
      <button class="rail-item" type="button" aria-label="More">
        <span class="rail-icon">${t("moreHorizontal","rail-svg")}</span>
        <span>More</span>
      </button>
    </aside>

    <aside class="slack-sidebar" aria-label="Acme Demo navigation">
      <header class="workspace-header">
        <button class="workspace-name" type="button">Acme Demo ${t("chevronDown","chevron-icon")}</button>
        <div class="workspace-tools" aria-hidden="true">
          <span class="workspace-tool">${t("target","workspace-tool-icon")}</span>
          <span class="workspace-tool">${t("compose","workspace-tool-icon")}</span>
        </div>
      </header>

      <nav class="sidebar-nav" aria-label="Slack sections">
        <a href="#" class="sidebar-link sidebar-link--muted threads-link" data-nav-target="threads">
          ${H()}
          <span>Threads</span>
          <span class="unread-count">1</span>
        </a>

        <div class="sidebar-group">
          <div class="section-label">${t("chevronDown","section-chevron")}<span>Apps</span></div>
          <a href="#" class="sidebar-link app-link" data-nav-target="app">
            ${i("Stack Internal")}
            <span class="unread-count">1</span>
          </a>
        </div>

        <div class="sidebar-group">
          <div class="section-label">${t("chevronDown","section-chevron")}<span>Channels</span></div>
          ${P.map(e=>`<a href="#" class="sidebar-link channel-link ${e==="general"?"is-active":""}" data-channel="${e}" ${e==="general"?'aria-current="page"':""}># ${e}</a>`).join("")}
        </div>
      </nav>
    </aside>

    <section class="app-view is-hidden is-app-thread-closed" data-surface="app" aria-label="Stack Internal app">
      <section class="app-main" aria-label="Stack Internal app content">
        <header class="app-header">
          <div class="app-title">
            <span class="star" aria-hidden="true">${t("star","star-icon")}</span>
            ${i()}
            <h1>Stack Internal</h1>
          </div>
          <div class="app-actions">
            <button class="new-chat-button" type="button">
              <span aria-hidden="true">${t("newChat","button-icon")}</span>
              New Chat
            </button>
            <button class="icon-action" type="button" aria-label="Search">${t("search","app-action-icon")}</button>
            <button class="icon-action" type="button" aria-label="Notifications">${t("bell","app-action-icon")}</button>
            <button class="icon-action" type="button" aria-label="More">${t("moreVertical","app-action-icon")}</button>
          </div>
        </header>

        <nav class="app-tabs" aria-label="Stack Internal tabs">
          <button class="tab-button is-active" type="button" data-tab="answers">Answers</button>
          <button class="tab-button" type="button" data-tab="chat">Chat</button>
        </nav>

        <section class="tab-panel is-active" data-panel="answers" aria-label="Provided answers">
          <div class="answer-list">
            ${v.map(B).join("")}
          </div>
        </section>

        <section class="tab-panel" data-panel="chat" aria-label="Chat with Stack Internal">
          <div class="chat-empty">
            ${i()}
            <h2>Start a chat with Stack Internal</h2>
            <p>Ask a question or paste a thread to search trusted company context.</p>
            <button class="new-chat-button" type="button">
              <span aria-hidden="true">${t("newChat","button-icon")}</span>
              New Chat
            </button>
          </div>
        </section>
      </section>
      ${w({appThread:!0})}
    </section>

    <section class="channel-workspace is-thread-closed" data-surface="channel" data-current-channel="general" aria-label="Channel">
      <section class="channel-view" aria-label="General channel">
        <header class="channel-header">
          <h1 data-channel-heading>#general</h1>
        </header>
        <div class="channel-body" data-channel-body>
          ${I("general")}
        </div>
        ${S("Message #general")}
      </section>
      ${w()}
    </section>

    ${O()}
  </main>
`;const h=e=>{document.querySelectorAll("[data-surface]").forEach(a=>{a.classList.toggle("is-hidden",a.dataset.surface!==e)}),document.querySelectorAll("[data-nav-target]").forEach(a=>{const r=a.dataset.navTarget===e;a.classList.toggle("is-active",r),r?a.setAttribute("aria-current","page"):a.removeAttribute("aria-current")}),e!=="channel"&&document.querySelectorAll("[data-channel]").forEach(a=>{a.classList.remove("is-active"),a.removeAttribute("aria-current")})},b=(e,{openThread:a=!1}={})=>{const r=document.querySelector(".channel-workspace"),l=document.querySelector("[data-channel-heading]"),n=document.querySelector("[data-channel-body]"),o=document.querySelector(".channel-view [data-composer-placeholder]");r.dataset.currentChannel=e,l.textContent=`#${e}`,n.innerHTML=I(e),o.textContent=`Message #${e}`,document.querySelectorAll("[data-channel]").forEach(c=>{const f=c.dataset.channel===e;c.classList.toggle("is-active",f),f?c.setAttribute("aria-current","page"):c.removeAttribute("aria-current")}),r.classList.toggle("is-thread-closed",e!=="infra"||!a)};document.querySelectorAll("[data-nav-target]").forEach(e=>{e.addEventListener("click",a=>{a.preventDefault(),h(e.dataset.navTarget)})});document.querySelectorAll("[data-channel]").forEach(e=>{e.addEventListener("click",a=>{a.preventDefault(),h("channel"),b(e.dataset.channel)})});document.querySelectorAll("[data-thread-shortcut]").forEach(e=>{e.addEventListener("click",a=>{a.preventDefault(),h("channel"),b(e.dataset.threadShortcut,{openThread:!0}),document.querySelector(".channel-message")?.scrollIntoView({block:"center",behavior:"smooth"})})});document.querySelectorAll("[data-open-channel-thread]").forEach(e=>{e.addEventListener("click",()=>{h("channel"),b(e.dataset.openChannelThread,{openThread:!0})})});document.querySelectorAll(".thread-close").forEach(e=>{e.addEventListener("click",()=>{const a=e.closest(".app-view");if(a){a.classList.add("is-app-thread-closed");return}document.querySelector(".channel-workspace")?.classList.add("is-thread-closed")})});document.addEventListener("click",e=>{e.target.closest("[data-open-thread]")&&document.querySelector(".channel-workspace")?.classList.remove("is-thread-closed"),e.target.closest("[data-open-answer-thread]")&&document.querySelector(".app-view")?.classList.remove("is-app-thread-closed")});document.querySelectorAll(".tab-button").forEach(e=>{e.addEventListener("click",()=>{const a=e.dataset.tab;document.querySelectorAll(".tab-button").forEach(r=>{r.classList.toggle("is-active",r===e)}),document.querySelectorAll(".tab-panel").forEach(r=>{r.classList.toggle("is-active",r.dataset.panel===a)})})});
