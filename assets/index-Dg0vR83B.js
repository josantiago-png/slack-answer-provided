(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const t of a.addedNodes)t.tagName==="LINK"&&t.rel==="modulepreload"&&n(t)}).observe(document,{childList:!0,subtree:!0});function o(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(s){if(s.ep)return;s.ep=!0;const a=o(s);fetch(s.href,a)}})();const r=document.querySelector("#app");r.innerHTML=`
  <main class="slack-shell" aria-label="Slack workspace prototype">
    <aside class="workspace-rail" aria-label="Workspace switcher">
      <div class="workspace-mark is-active">A</div>
      <div class="workspace-mark">S</div>
      <button class="rail-button" aria-label="Add workspace">+</button>
    </aside>

    <aside class="slack-sidebar" aria-label="Acme workspace navigation">
      <header class="workspace-header">
        <div>
          <div class="workspace-name">Acme Corp</div>
          <div class="workspace-status"><span></span> Enterprise Grid</div>
        </div>
        <button class="icon-button" aria-label="Compose message">
          <span aria-hidden="true">+</span>
        </button>
      </header>

      <nav class="sidebar-section" aria-label="Slack sections">
        <a href="#" class="sidebar-link">Threads</a>
        <a href="#" class="sidebar-link">Mentions & reactions</a>
        <a href="#" class="sidebar-link is-notified">
          Stack Internal
          <span class="unread-count">1</span>
        </a>
      </nav>

      <div class="sidebar-section">
        <div class="section-label">Channels</div>
        <a href="#" class="sidebar-link"># announcements</a>
        <a href="#" class="sidebar-link is-active"># customer-questions</a>
        <a href="#" class="sidebar-link"># security-help</a>
        <a href="#" class="sidebar-link"># team-trust-layer</a>
      </div>

      <div class="sidebar-section">
        <div class="section-label">Apps</div>
        <a href="#" class="sidebar-link app-link is-notified">
          <span class="bot-mini">SI</span>
          Stack Internal
          <span class="unread-dot"></span>
        </a>
      </div>
    </aside>

    <section class="channel-view" aria-label="Channel conversation">
      <header class="channel-header">
        <div>
          <h1># customer-questions</h1>
          <p>Questions routed from customer-facing teams.</p>
        </div>
        <div class="header-actions">
          <button class="soft-button">Canvas</button>
          <button class="soft-button">Huddle</button>
        </div>
      </header>

      <div class="notice-strip" role="status">
        <span class="notice-dot"></span>
        Stack Internal has a new answer ready for review.
      </div>

      <div class="message-list" aria-label="Messages">
        <article class="message">
          <img class="avatar" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=96&q=80" alt="" />
          <div class="message-body">
            <div class="message-meta">
              <span class="message-author">Maya Chen</span>
              <span>10:39 AM</span>
            </div>
            <p>Does anyone know whether the SAML certificate rotation window changed for enterprise customers this quarter?</p>
          </div>
        </article>

        <article class="message">
          <img class="avatar" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=96&q=80" alt="" />
          <div class="message-body">
            <div class="message-meta">
              <span class="message-author">Theo Martin</span>
              <span>10:41 AM</span>
            </div>
            <p>I remember seeing a runbook update, but I do not want to guess. Looping in Stack Internal.</p>
          </div>
        </article>

        <article id="answer-message" class="message bot-message is-new" tabindex="-1">
          <div class="bot-avatar" aria-hidden="true">SI</div>
          <div class="message-body">
            <div class="message-meta">
              <span class="message-author">Stack Internal</span>
              <span class="app-badge">APP</span>
              <span>Just now</span>
            </div>

            <section class="answer-card" aria-label="Stack Internal answer">
              <div class="answer-header">
                <span class="answer-status">Answer provided</span>
                <span class="confidence-pill">High confidence</span>
              </div>
              <p class="answer-copy">
                Enterprise SAML certificate rotation remains on a 90-day window. The updated runbook only changes the reminder cadence: admins now receive notices at 30, 14, and 3 days before expiration.
              </p>
              <div class="answer-source">
                <span class="source-label">Source</span>
                Security admin runbook · Updated Jun 12
              </div>
              <div class="answer-actions">
                <button class="primary-button">Open source</button>
                <button class="soft-button">Mark helpful</button>
              </div>
            </section>
          </div>
        </article>
      </div>

      <footer class="composer" aria-label="Message composer">
        <div class="composer-box">
          <span>Message #customer-questions</span>
          <div class="composer-tools" aria-hidden="true">
            <span>B</span>
            <span>I</span>
            <span>@</span>
          </div>
        </div>
      </footer>
    </section>

    <aside class="details-panel" aria-label="Stack Internal notification details">
      <div class="panel-card">
        <div class="panel-card-header">
          <div class="bot-avatar bot-avatar-large" aria-hidden="true">SI</div>
          <div>
            <h2>Stack Internal</h2>
            <p>Answer delivery status</p>
          </div>
        </div>
        <div class="status-stack">
          <div class="status-row is-complete">
            <span></span>
            Question matched to trusted source
          </div>
          <div class="status-row is-complete">
            <span></span>
            Answer posted in channel
          </div>
          <div class="status-row">
            <span></span>
            Waiting for teammate feedback
          </div>
        </div>
      </div>
    </aside>

    <section id="incoming-notification" class="incoming-notification" aria-label="Incoming Slack notification">
      <div class="notification-topline">
        <span class="slack-symbol" aria-hidden="true">#</span>
        <span>Slack</span>
        <span>now</span>
      </div>
      <div class="notification-body">
        <div class="bot-avatar" aria-hidden="true">SI</div>
        <div>
          <div class="notification-title">Stack Internal</div>
          <p>Answer provided in #customer-questions</p>
        </div>
      </div>
      <div class="notification-actions">
        <button id="open-answer" class="notification-link">Open</button>
        <button id="dismiss-notification" class="notification-link">Dismiss</button>
      </div>
    </section>
  </main>
`;document.querySelector("#dismiss-notification")?.addEventListener("click",()=>{document.querySelector("#incoming-notification")?.classList.add("is-dismissed")});document.querySelector("#open-answer")?.addEventListener("click",()=>{const e=document.querySelector("#answer-message");e?.scrollIntoView({behavior:"smooth",block:"center"}),e?.focus({preventScroll:!0}),e?.classList.add("is-highlighted"),setTimeout(()=>e?.classList.remove("is-highlighted"),1600)});
