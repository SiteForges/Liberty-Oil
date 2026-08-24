#!/usr/bin/env python3
# Generates all HTML pages for the Liberty Oil Inc redesign from shared fragments.
# Run: python3 build_site.py

import os

NAV_ITEMS = [
    ("index.html", "Home"),
    ("about.html", "About"),
    ("specials.html", "Specials"),
    ("beer-wine.html", "Beer & Wine"),
    ("soda-beverage.html", "Soda & Beverage"),
    ("candy.html", "Candy"),
    ("energy-drinks.html", "Energy Drinks"),
    ("snacks.html", "Snacks"),
]

FUEL_ICON = '''<svg class="brand-mark" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="40" height="40" rx="10" fill="var(--navy-950)"/>
  <path d="M20 8v6" stroke="var(--gold-500)" stroke-width="2" stroke-linecap="round"/>
  <path d="M20 8c-2.4 0-4 1.8-4 3.6 0 2 4 4.4 4 4.4s4-2.4 4-4.4c0-1.8-1.6-3.6-4-3.6Z" fill="var(--gold-500)"/>
  <rect x="17.3" y="15" width="5.4" height="3" rx="0.8" stroke="var(--gold-500)" stroke-width="1.5"/>
  <path d="M18 18v3M22 18v3" stroke="var(--gold-500)" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M14 32V22.5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2V32" stroke="var(--gold-500)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M12 32h16" stroke="var(--gold-500)" stroke-width="2" stroke-linecap="round"/>
</svg>'''

ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'

STAR = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.6 6.2L21 9l-5 4.4L17.4 20 12 16.6 6.6 20 8 13.4 3 9l6.4-.8Z"/></svg>'


def head(title, description):
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>{title}</title>
  <meta name="description" content="{description}">
  <meta name="theme-color" content="#0a1c2e">
  <link rel="icon" href="assets/icons/favicon-32.png" sizes="32x32" type="image/png">
  <link rel="apple-touch-icon" href="assets/icons/apple-touch-icon.png">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <link rel="stylesheet" href="styles.css">
</head>
<body>'''


def topbar(message, cta_label, cta_href, cta_external=True):
    target = ' target="_blank" rel="noreferrer"' if cta_external else ''
    return f'''  <div class="topbar">
    <div class="container topbar-inner">
      <span class="open-status"><span class="open-dot"></span>{message}</span>
      <div class="topbar-actions">
        <a href="tel:+17607548045">(760) 754-8045</a>
        <a href="{cta_href}"{target}>{cta_label} &rarr;</a>
        <button class="spin-slot" id="spinSlot" type="button"></button>
      </div>
    </div>
  </div>'''


def header(active):
    links = []
    for href, label in NAV_ITEMS:
        cls = ' class="active"' if href == active else ''
        links.append(f'      <a{cls} href="{href}">{label}</a>')
    links_html = "\n".join(links)
    return f'''  <header class="site-header">
    <div class="nav">
      <a class="brand" href="index.html">
        <img class="brand-mark" src="assets/icons/logo-header.png" alt="" width="38" height="38">
        <span class="brand-text">
          <strong>Liberty Oil Inc</strong>
          <small>Oceanside, CA</small>
        </span>
      </a>
      <nav class="nav-links" id="navLinks" aria-label="Primary">
{links_html}
        <a class="btn btn-ghost nav-links-cta" href="https://www.google.com/maps/search/?api=1&query=1943+S+Coast+Hwy+Oceanside+CA+92054" target="_blank" rel="noreferrer">Get Directions</a>
      </nav>
      <div class="nav-cta">
        <a class="btn btn-ghost btn-sm" href="https://www.google.com/maps/search/?api=1&query=1943+S+Coast+Hwy+Oceanside+CA+92054" target="_blank" rel="noreferrer">Get Directions</a>
        <a class="btn btn-primary btn-sm" href="https://www.doordash.com/convenience/store/24620532" target="_blank" rel="noreferrer">Order Now</a>
        <button class="nav-toggle" id="navToggle" aria-label="Menu" aria-expanded="false" aria-controls="navLinks">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
        </button>
      </div>
    </div>
  </header>'''


def footer():
    return '''  <footer class="site-footer">
    <div class="container footer-grid">
      <div>
        <div class="footer-brand">
          <img src="assets/icons/logo-header.png" alt="" width="30" height="30">
          <strong>Liberty Oil Inc</strong>
        </div>
        <p style="max-width:32ch;">A family-run gas station and convenience store on South Coast Highway in Oceanside, CA.</p>
      </div>
      <div class="footer-col">
        <h4>Visit</h4>
        <p>1943 S Coast Hwy<br>Oceanside, CA 92054</p>
        <a href="tel:+17607548045">(760) 754-8045</a>
      </div>
      <div class="footer-col">
        <h4>Hours</h4>
        <p>Sunday &ndash; Saturday</p>
        <p>7:00 AM &ndash; 12:00 AM</p>
      </div>
      <div class="footer-col">
        <h4>Quick Links</h4>
        <a href="about.html">About</a>
        <a href="specials.html">Specials</a>
        <a href="index.html#location">Directions &amp; Location</a>
        <a href="https://www.doordash.com/convenience/store/24620532" target="_blank" rel="noreferrer">Order on DoorDash</a>
      </div>
    </div>
    <div class="footer-bottom">
      <span>&copy; Liberty Oil Inc, Oceanside CA.</span>
      <span>Pier photography: Redideo &amp; Visitor7 via Wikimedia Commons (CC BY-SA)</span>
    </div>
  </footer>

  <div class="wheel-backdrop" id="wheelBackdrop" hidden>
    <div class="wheel-modal" role="dialog" aria-modal="true" aria-label="Spin to win">
      <button class="wheel-close" id="wheelClose" aria-label="Close">&times;</button>
      <p class="eyebrow" style="color:var(--gold-500);">Spin To Win</p>
      <h3>Give it a spin!</h3>
      <p class="wheel-sub" id="wheelSub">Free Welch's Fruit Snacks with any $50+ purchase this week.</p>
      <div class="wheel-stage">
        <div class="wheel-pointer"></div>
        <div class="wheel-disc" id="wheelDisc"></div>
      </div>
      <button class="btn btn-primary" id="wheelSpinBtn" type="button">Spin the Wheel</button>
      <p class="wheel-result" id="wheelResult" hidden></p>
    </div>
  </div>

  <div class="ai-widget" id="aiWidget">
    <div class="ai-panel" id="aiPanel" hidden>
      <div class="ai-panel-head">
        <strong>Liberty Oil AI</strong>
        <button class="ai-close" id="aiClose" aria-label="Close">&times;</button>
      </div>
      <div class="ai-log" id="aiLog"><p class="ai-msg">Hi! Ask me about hours, specials, directions, or what we carry.</p></div>
      <form class="ai-form" id="aiForm">
        <input class="ai-input" id="aiInput" type="text" placeholder="Ask a question&hellip;" autocomplete="off">
        <button class="btn btn-primary btn-sm" type="submit">Ask</button>
      </form>
      <div class="ai-quick">
        <a class="btn btn-ghost btn-sm" href="tel:+17607548045">Call</a>
        <a class="btn btn-ghost btn-sm" href="https://www.google.com/maps/search/?api=1&query=1943+S+Coast+Hwy+Oceanside+CA+92054" target="_blank" rel="noreferrer">Directions</a>
        <a class="btn btn-ghost btn-sm" href="specials.html">Specials</a>
      </div>
    </div>
    <button class="ai-bubble" id="aiBubble" aria-label="Liberty Oil AI" aria-expanded="false">
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 8v6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M20 8c-2.4 0-4 1.8-4 3.6 0 2 4 4.4 4 4.4s4-2.4 4-4.4c0-1.8-1.6-3.6-4-3.6Z" fill="currentColor"/>
        <rect x="17.3" y="15" width="5.4" height="3" rx="0.8" stroke="currentColor" stroke-width="1.5"/>
        <path d="M18 18v3M22 18v3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M14 32V22.5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2V32" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12 32h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </button>
  </div>

  <script src="assets/js/site.js"></script>
</body>
</html>'''


def page_hero(eyebrow, h1, lede, actions_html, note=None):
    note_html = f'\n        <div class="inventory-note">{note}</div>' if note else ''
    return f'''    <section class="page-hero">
      <div class="container">
        <p class="eyebrow">{eyebrow}</p>
        <h1>{h1}</h1>
        <p class="lede">{lede}</p>{note_html}
        <div class="page-actions">
{actions_html}
        </div>
      </div>
    </section>'''


def write(path, content):
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("wrote", path)


CAT_ICONS = {
    "beer-wine": '<path d="M8 3h8l1 5H7l1-5Z"/><path d="M7 8v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V8"/><path d="M10 13h4"/>',
    "soda-beverage": '<path d="M9 2h6l.6 3.3a5 5 0 0 1-.8 3.7L12 12l-2.8-3a5 5 0 0 1-.8-3.7L9 2Z"/><path d="M12 12v8"/><path d="M8.5 20h7"/>',
    "snacks": '<path d="M4 9.5C4 7 8 6 12 6s8 1 8 3.5S16.5 14 12 14 4 12 4 9.5Z"/><path d="M4 9.5v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',
    "candy": '<rect x="4" y="9" width="16" height="6" rx="3" transform="rotate(-8 12 12)"/><circle cx="8.3" cy="11" r="1"/><circle cx="15.7" cy="13" r="1"/>',
    "energy-drinks": '<path d="M13 2 5 14h5l-1 8 8-12h-5l1-8Z"/>',
    "specials": '<path d="M12 3l2.3 5.4L20 9l-4.6 4 1.4 6-4.8-3-4.8 3 1.4-6L4 9l5.7-.6L12 3Z"/>',
    "fuel": '<rect x="8" y="3" width="7" height="18" rx="2"/><path d="M8 10h7"/><path d="M11.5 3V1.5"/>',
}

SPECIALS_ITEMS = [
    {"name": "Celsius Cans", "price": "$3.79", "note": "Assorted flavors", "img": "celsius.webp", "w": 402, "h": 497},
    {"name": "Ghost Energy", "price": "$2.99", "note": "12oz, with tax", "img": "ghost.webp", "w": 215, "h": 235},
    {"name": "Calypso Lemonade", "price": "2 for $5", "note": "Assorted flavors", "img": "calypso.webp", "w": 375, "h": 500},
    {"name": "Snapple", "price": "2 for $3", "note": "Assorted flavors", "img": "snapple.webp", "w": 461, "h": 500},
    {"name": "Takis", "price": "$2.69", "note": "each &mdash; or 2 for $5", "img": "takis.webp", "w": 500, "h": 500},
    {"name": "Sun Hot Spicy Chips", "price": "Best Seller", "note": "Get in for a good deal", "img": "sun.webp", "w": 371, "h": 500},
    {"name": "Kozed Gummy Candy", "price": "Best Seller", "note": "Get in for a good deal", "img": "kozed.webp", "w": 500, "h": 413},
    {"name": "Welch's Fruit Snacks", "price": "Free", "note": "With any purchase of $50 or more", "img": "welchs.webp", "w": 500, "h": 500},
]


def specials_grid():
    cards = []
    for item in SPECIALS_ITEMS:
        cards.append(f'''        <div class="special-item reveal">
          <div class="special-media"><img src="assets/specials/{item["img"]}" alt="{item["name"]}" width="{item["w"]}" height="{item["h"]}" loading="lazy"></div>
          <h3>{item["name"]}</h3>
          <div class="special-price">{item["price"]}</div>
          <p class="note">{item["note"]}</p>
        </div>''')
    return "\n\n".join(cards)

CATEGORIES = [
    ("beer-wine", "Beer & Wine", "Cold beer picks and wine options for easy stop-ins and quick orders."),
    ("soda-beverage", "Soda & Beverage", "Cooler favorites, bottled drinks, and easy beverage grabs."),
    ("snacks", "Snacks", "Chips, salty favorites, and fast snack-stop picks."),
    ("candy", "Candy", "Sweet quick-pick items for checkout, cravings, and road trips."),
    ("energy-drinks", "Energy Drinks", "High-energy cooler options for workdays, long drives, and late nights."),
    ("specials", "Specials", "Store picks, grocery-style grabs, and featured convenience items."),
]

CAT_IMG = {
    "beer-wine": "assets/optimized/beer-wine.webp",
    "soda-beverage": "assets/optimized/soda-beverage.webp",
    "snacks": "assets/optimized/snacks.webp",
    "candy": "assets/optimized/candy.webp",
    "energy-drinks": "assets/optimized/energy-drinks.webp",
    "specials": "assets/optimized/specials.webp",
}


def category_grid():
    cards = []
    for slug, name, blurb in CATEGORIES:
        href = "specials.html" if slug == "specials" else f"{slug}.html"
        arrow_label = "See this week's" if slug == "specials" else "Browse aisle"
        cards.append(f'''        <a class="cat-card reveal" href="{href}">
          <div class="cat-icon-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">{CAT_ICONS[slug]}</svg>
          </div>
          <div>
            <h3>{name}</h3>
            <p>{blurb}</p>
          </div>
          <span class="cat-arrow">{arrow_label} {ARROW}</span>
        </a>''')
    return "\n\n".join(cards)


def stars_block():
    return f'<div class="stars" aria-label="5 out of 5 stars">{STAR * 5}</div>'


# ---------------------------------------------------------------------------
# INDEX
# ---------------------------------------------------------------------------
index_html = head(
    "Liberty Oil Inc | Home",
    "Liberty Oil Inc in Oceanside, CA offers gas, drinks, snacks, candy, beer and wine, energy drinks, and weekly store picks."
) + "\n" + topbar(
    "Open now &middot; 7:00 AM &ndash; 12:00 AM, every day", "See this week's specials", "specials.html", cta_external=False
) + "\n" + header("index.html") + f'''
<main>
  <section class="hero">
    <div class="container hero-inner">
      <div class="hero-copy">
        <p class="eyebrow">Fast Stop &middot; Local Feel &middot; South Coast Highway</p>
        <h1>Your everyday stop on South Coast Highway.</h1>
        <p class="lede">Liberty Oil Inc is a family-run gas station and convenience store in Oceanside &mdash; low prices at the pump, a cooler stocked with the drinks people actually want, and the kind of friendly service that keeps people coming back.</p>
        <div class="hero-cta-row">
          <a class="btn btn-primary" href="https://www.doordash.com/convenience/store/24620532" target="_blank" rel="noreferrer">Order on DoorDash</a>
          <a class="btn btn-ghost btn-on-dark" href="https://www.google.com/maps/search/?api=1&query=1943+S+Coast+Hwy+Oceanside+CA+92054" target="_blank" rel="noreferrer">Get Directions</a>
        </div>
      </div>
      <aside class="signpost">
        <div class="signpost-inner">
          <div class="sign-row">
            <svg class="sign-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 22s7-6.4 7-12a7 7 0 1 0-14 0c0 5.6 7 12 7 12Z"/><circle cx="12" cy="10" r="2.6"/></svg>
            <div>
              <div class="sign-label">Address</div>
              <div class="sign-value">1943 S Coast Hwy<br>Oceanside, CA 92054</div>
            </div>
          </div>
          <div class="sign-row">
            <svg class="sign-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>
            <div>
              <div class="sign-label">Hours</div>
              <div class="sign-value">Sunday &ndash; Saturday<br>7:00 AM &ndash; 12:00 AM</div>
            </div>
          </div>
          <div class="sign-row highlight">
            <svg class="sign-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">{CAT_ICONS['specials']}</svg>
            <div>
              <div class="sign-label">Known For</div>
              <div class="sign-value">Low prices, cold drinks, and quick grab-and-go convenience</div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </section>

  <div class="trust-strip">
    <div class="container trust-grid reveal-group">
      <div class="trust-item reveal">
        <svg class="trust-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M8.5 12.5l2.3 2.3L16 10"/></svg>
        <div><strong>Open until midnight</strong><span>Every day, all year</span></div>
      </div>
      <div class="trust-item reveal">
        <svg class="trust-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 12l1.5-5.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 12"/><rect x="4" y="12" width="16" height="6" rx="1.5"/><circle cx="7.5" cy="18" r="1.3"/><circle cx="16.5" cy="18" r="1.3"/></svg>
        <div><strong>Lowest area gas prices</strong><span>Straight from our regulars</span></div>
      </div>
      <div class="trust-item reveal">
        <svg class="trust-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3l7 3.5v5c0 4.7-3 8.3-7 9.5-4-1.2-7-4.8-7-9.5v-5L12 3Z"/></svg>
        <div><strong>Family-run</strong><span>Owners on-site, not a franchise</span></div>
      </div>
      <div class="trust-item reveal">
        <svg class="trust-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">{CAT_ICONS['specials']}</svg>
        <div><strong>5-star service</strong><span>What our regulars say</span></div>
      </div>
    </div>
  </div>

  <section class="section" id="categories">
    <div class="container">
      <div class="section-heading reveal">
        <div>
          <p class="eyebrow">In The Store</p>
          <h2>Everything you'd grab on the way through.</h2>
        </div>
        <p class="sub">Six aisles worth checking &mdash; browse what we keep stocked, then swing by or order ahead.</p>
      </div>
      <div class="category-grid reveal-group">
{category_grid()}
      </div>
    </div>
  </section>

  <section class="section-tight" id="specials">
    <div class="container">
      <div class="ribbon reveal">
        <div>
          <p class="eyebrow" style="color:var(--gold-500);">This Week</p>
          <h2>New specials go up in-store every week.</h2>
          <p>Grocery-style grabs and featured convenience picks &mdash; ask at the counter or check DoorDash for what's currently discounted.</p>
        </div>
        <div class="ribbon-cta">
          <a class="btn btn-invert" href="specials.html">See Current Deals</a>
        </div>
      </div>
    </div>
  </section>

  <section class="section-tight">
    <div class="container">
      <div class="delivery-single reveal">
        <div>
          <span class="badge">DoorDash</span>
          <h3>Order the full store without making the trip.</h3>
          <p>Every category we carry, delivered &mdash; drinks, snacks, candy, and specials in one order.</p>
        </div>
        <a class="btn btn-primary" href="https://www.doordash.com/convenience/store/24620532" target="_blank" rel="noreferrer">Order on DoorDash</a>
      </div>
    </div>
  </section>

  <section class="section" id="about">
    <div class="container about-wrap">
      <div class="about-visual reveal">
        <img src="assets/optimized/beer-wine.webp" alt="Beer and wine lineup at Liberty Oil Inc" loading="lazy">
      </div>
      <div class="about-copy reveal">
        <p class="eyebrow">About Liberty Oil</p>
        <h2>Run by a family, not a franchise.</h2>
        <p>Liberty Oil Inc has been Oceanside's fast, friendly stop on South Coast Highway &mdash; the kind of place where the owners know your order and the gas prices don't punish you for filling up close to home.</p>
        <p>Alongside the pumps, the store is stocked with what people actually reach for on a quick stop: cold beer and wine, soda and bottled drinks, chips and snacks, candy, and energy drinks &mdash; plus rotating weekly specials.</p>
        <div style="margin-top:26px;">
          <a class="btn btn-ghost" href="about.html">More About Us</a>
        </div>
      </div>
    </div>
  </section>

  <section class="section-tight location" id="location">
    <div class="container location-wrap">
      <div class="location-media reveal">
        <img src="assets/optimized/pier-drone.webp" alt="Aerial view of Oceanside Pier stretching into the Pacific" loading="lazy">
      </div>
      <div class="location-copy reveal">
        <p class="eyebrow">Right By The Coast</p>
        <h2>Minutes from Oceanside Pier.</h2>
        <p>Liberty Oil Inc sits just up South Coast Highway from the pier &mdash; a quick stop before the beach, a fill-up on the way home, or a snack run between waves.</p>
        <div class="location-address">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 22s7-6.4 7-12a7 7 0 1 0-14 0c0 5.6 7 12 7 12Z"/><circle cx="12" cy="10" r="2.6"/></svg>
          <div>
            <strong>1943 S Coast Hwy, Oceanside, CA 92054</strong>
          </div>
        </div>
        <div class="location-actions">
          <a class="btn btn-primary" href="https://www.google.com/maps/search/?api=1&query=1943+S+Coast+Hwy+Oceanside+CA+92054" target="_blank" rel="noreferrer">Get Directions</a>
          <a class="btn btn-ghost btn-on-dark" href="tel:+17607548045">Call the Store</a>
        </div>
      </div>
    </div>
  </section>

  <section class="section-tight" id="reviews" style="background:var(--sand-50);border-top:1px solid var(--line);border-bottom:1px solid var(--line);">
    <div class="container">
      <div class="section-heading reveal">
        <div>
          <p class="eyebrow">Reviews</p>
          <h2>Friendly service still stands out.</h2>
        </div>
      </div>
      <div class="review-grid reveal-group">
        <blockquote class="review-card reveal">
          {stars_block()}
          <p>&ldquo;Always lowest price in area &amp; friendly staff.&rdquo;</p>
          <div class="review-author">Anonymous, Oceanside</div>
        </blockquote>
        <blockquote class="review-card reveal">
          {stars_block()}
          <p>&ldquo;The friendliest gas station and you really can't beat the gas prices.&rdquo;</p>
          <div class="review-author">Anonymous, Oceanside</div>
        </blockquote>
        <blockquote class="review-card reveal">
          {stars_block()}
          <p>&ldquo;Very friendly owners who run the place!&rdquo;</p>
          <div class="review-author">Anonymous, Oceanside</div>
        </blockquote>
      </div>
    </div>
  </section>
</main>
''' + footer()

write("index.html", index_html)

# ---------------------------------------------------------------------------
# ABOUT
# ---------------------------------------------------------------------------
about_html = head(
    "Liberty Oil Inc | About",
    "Learn about Liberty Oil Inc, a family-run gas station and convenience store in Oceanside, CA."
) + "\n" + topbar(
    "Family-run convenience in Oceanside", "This week's specials", "specials.html", cta_external=False
) + "\n" + header("about.html") + f'''
<main>
{page_hero(
    "About",
    "Local, welcoming, and built around quick convenience.",
    "Liberty Oil Inc is a family-run stop where fuel, drinks, snacks, and everyday convenience all come together in one easy location.",
    '          <a class="btn btn-primary" href="https://www.doordash.com/convenience/store/24620532" target="_blank" rel="noreferrer">Order on DoorDash</a>\n          <a class="btn btn-ghost btn-on-dark" href="https://www.google.com/maps/search/?api=1&query=1943+S+Coast+Hwy+Oceanside+CA+92054" target="_blank" rel="noreferrer">Get Directions</a>'
)}

  <section class="section">
    <div class="container about-wrap">
      <div class="about-copy reveal">
        <h2>We keep the stop simple and useful.</h2>
        <p>People come to Liberty Oil Inc for low gas prices, a friendly local feel, and a store stocked with the things they actually want to grab quickly. From beer and wine to soda, candy, energy drinks, and snacks, the focus is on speed, convenience, and a welcoming stop every time.</p>
        <p>Our store is set up to help customers get in, get what they need, and get moving &mdash; whether that's a morning commute, an afternoon drink stop, or a late-night snack run.</p>
        <div style="margin-top:26px;">
          <a class="btn btn-ghost" href="https://www.google.com/maps/search/?api=1&query=1943+S+Coast+Hwy+Oceanside+CA+92054" target="_blank" rel="noreferrer">Get Directions</a>
        </div>
      </div>
      <div class="about-panel reveal">
        <h3>Why people stop here</h3>
        <ul class="check-list">
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>Friendly neighborhood service</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>Quick drink and snack runs</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>Reliable beer, wine, and beverage picks</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>Open every day until midnight</li>
        </ul>
      </div>
    </div>
  </section>

  <section class="section-tight location">
    <div class="container location-wrap">
      <div class="location-media reveal">
        <img src="assets/optimized/pier-palms.webp" alt="Palm-lined view of Oceanside Pier from the boardwalk" loading="lazy">
      </div>
      <div class="location-copy reveal">
        <p class="eyebrow">Right By The Coast</p>
        <h2>A short drive from Oceanside Pier.</h2>
        <p>Fuel up or grab a cold drink on your way to the beach &mdash; we're just up South Coast Highway from the pier, the boardwalk, and the harbor.</p>
        <div class="location-address">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 22s7-6.4 7-12a7 7 0 1 0-14 0c0 5.6 7 12 7 12Z"/><circle cx="12" cy="10" r="2.6"/></svg>
          <div>
            <strong>1943 S Coast Hwy, Oceanside, CA 92054</strong>
          </div>
        </div>
        <div class="location-actions">
          <a class="btn btn-primary" href="https://www.google.com/maps/search/?api=1&query=1943+S+Coast+Hwy+Oceanside+CA+92054" target="_blank" rel="noreferrer">Get Directions</a>
        </div>
      </div>
    </div>
  </section>

  <section class="section-tight" style="background:var(--sand-50);border-top:1px solid var(--line);border-bottom:1px solid var(--line);">
    <div class="container">
      <div class="section-heading reveal">
        <div>
          <p class="eyebrow">Browse</p>
          <h2>Find what you're after.</h2>
        </div>
      </div>
      <div class="category-grid reveal-group">
{category_grid()}
      </div>
    </div>
  </section>
</main>
''' + footer()

write("about.html", about_html)

# ---------------------------------------------------------------------------
# SPECIALS
# ---------------------------------------------------------------------------
specials_html = head(
    "Liberty Oil Inc | Weekly Specials",
    "Browse this week's specials and deals at Liberty Oil Inc in Oceanside, CA."
) + "\n" + topbar(
    "This week's specials, in store now", "DoorDash main store", "https://www.doordash.com/convenience/store/24620532"
) + "\n" + header("specials.html") + f'''
<main>
{page_hero(
    "Weekly Specials",
    "This week's specials at Liberty Oil.",
    "Eight deals in store right now &mdash; from Celsius and Ghost Energy to free Welch's Fruit Snacks on a $50+ purchase.",
    '          <a class="btn btn-primary" href="https://www.doordash.com/convenience/store/24620532" target="_blank" rel="noreferrer">Order on DoorDash</a>',
    note="While supplies last. Prices and availability may vary in store. Discounts do not apply to gas, cigarettes, or liquor."
)}

  <section class="section">
    <div class="container">
      <div class="section-heading reveal">
        <div>
          <p class="eyebrow">This Week</p>
          <h2>This week's deals, updated weekly.</h2>
        </div>
        <p class="sub">New picks go up in-store every week &mdash; here's what's on right now.</p>
      </div>
      <div class="specials-grid reveal-group">
{specials_grid()}
      </div>
    </div>
  </section>

  <section class="section-tight" style="background:var(--sand-50);border-top:1px solid var(--line);border-bottom:1px solid var(--line);">
    <div class="container">
      <div class="ribbon reveal" style="background:linear-gradient(120deg, var(--navy-800), var(--navy-950) 75%);">
        <div>
          <p class="eyebrow" style="color:var(--gold-500);">Every Category</p>
          <h2>Specials rotate &mdash; the full store doesn't.</h2>
          <p>Beer &amp; wine, soda, candy, energy drinks, and snacks are stocked every day, special or not.</p>
        </div>
        <div class="ribbon-cta">
          <a class="btn btn-invert" href="index.html#categories">See All Categories</a>
        </div>
      </div>
    </div>
  </section>
</main>
''' + footer()

write("specials.html", specials_html)

# ---------------------------------------------------------------------------
# CATEGORY PAGES
# ---------------------------------------------------------------------------
CATEGORY_PAGES = {
    "beer-wine": {
        "title": "Liberty Oil Inc | Beer & Wine",
        "description": "Browse beer and wine selections at Liberty Oil Inc.",
        "topbar_msg": "Beer and wine picks for easy stop-ins",
        "eyebrow": "Beer & Wine",
        "h1": "Convenience-store alcohol picks that are easy to grab fast.",
        "lede": "A clean beer and wine lineup so you can browse the category and head straight to the right delivery link.",
        "img": "assets/optimized/beer-wine.webp",
        "img_alt": "Beer and wine product lineup",
        "links": [
            ("Shop Beer on DoorDash", "https://www.doordash.com/convenience/store/24620532/category/beer-1351"),
            ("Shop Wine on DoorDash", "https://www.doordash.com/convenience/store/24620532/category/wine-1163"),
        ],
        "chips": ["Domestic & import beer", "Red, white & rosé", "Single cans & 6-packs", "Cold and ready to go"],
        "gallery": [
            ("assets/beer.avif", "Cold beer, ready to grab"),
            ("assets/winee.avif", "Wine picks by the bottle"),
        ],
    },
    "soda-beverage": {
        "title": "Liberty Oil Inc | Soda & Beverage",
        "description": "Browse soda and beverage selections at Liberty Oil Inc.",
        "topbar_msg": "Cooler favorites and easy beverage grabs",
        "eyebrow": "Soda & Beverage",
        "h1": "Cooler favorites for every kind of stop.",
        "lede": "Soda, bottled drinks, and everyday beverages &mdash; stocked cold and easy to grab on your way through.",
        "img": "assets/optimized/soda-beverage.webp",
        "img_alt": "Soda and beverage product lineup",
        "links": [
            ("Shop Beverages on DoorDash", "https://www.doordash.com/convenience/store/24620532/category/drinks"),
        ],
        "chips": ["Classic sodas", "Bottled water & juice", "Iced tea & sports drinks", "Always ice cold"],
        "gallery": [
            ("assets/soda.avif", "Soda, chilled and ready"),
            ("assets/beverage.avif", "Bottled beverage favorites"),
        ],
    },
    "snacks": {
        "title": "Liberty Oil Inc | Snacks",
        "description": "Browse snack and chip selections at Liberty Oil Inc.",
        "topbar_msg": "Chips and salty favorites, fast",
        "eyebrow": "Snacks",
        "h1": "Salty, crunchy, and ready for the road.",
        "lede": "Chips and salty favorites for a fast snack-stop pick, whether you're headed to work or the beach.",
        "img": "assets/optimized/snacks.webp",
        "img_alt": "Snacks and chips product lineup",
        "links": [
            ("Shop Snacks on DoorDash", "https://www.doordash.com/convenience/store/24620532/category/snacks-758"),
        ],
        "chips": ["Chips & pretzels", "Single-serve bags", "Family-size options", "Classic & bold flavors"],
        "gallery": [
            ("assets/chips.avif", "Chips, stocked and ready"),
            ("assets/snackk.avif", "Grab-and-go snack picks"),
        ],
    },
    "candy": {
        "title": "Liberty Oil Inc | Candy",
        "description": "Browse candy selections at Liberty Oil Inc.",
        "topbar_msg": "Sweet quick-pick items at checkout",
        "eyebrow": "Candy",
        "h1": "Sweet picks for cravings and road trips.",
        "lede": "Quick-pick candy for checkout, cravings, and the drive ahead.",
        "img": "assets/optimized/candy.webp",
        "img_alt": "Candy product lineup",
        "links": [
            ("Shop Candy on DoorDash", "https://www.doordash.com/convenience/store/24620532/category/snacks-758"),
        ],
        "chips": ["Chocolate favorites", "Gummy & sour candy", "Checkout-line grabs", "Road trip stock-ups"],
        "gallery": [
            ("assets/candy.avif", "Candy, stocked at the counter"),
        ],
    },
    "energy-drinks": {
        "title": "Liberty Oil Inc | Energy Drinks",
        "description": "Browse energy drink selections at Liberty Oil Inc.",
        "topbar_msg": "High-energy cooler options, cold and ready",
        "eyebrow": "Energy Drinks",
        "h1": "Fuel for early mornings and late nights.",
        "lede": "High-energy cooler options for workdays, long drives, and late nights on South Coast Highway.",
        "img": "assets/optimized/energy-drinks.webp",
        "img_alt": "Energy drink product lineup",
        "links": [
            ("Shop Energy Drinks on DoorDash", "https://www.doordash.com/convenience/store/24620532/category/drinks"),
        ],
        "chips": ["Classic & sugar-free", "Single cans", "Cold cooler stock", "Grab-and-go"],
        "gallery": [],
    },
}

for slug, c in CATEGORY_PAGES.items():
    links_html = "\n".join(
        f'            <a class="btn {"btn-primary" if i == 0 else "btn-secondary btn-ghost"}" href="{href}" target="_blank" rel="noreferrer">{label}</a>'
        for i, (label, href) in enumerate(c["links"])
    )
    chips_html = "\n".join(f'          <span class="chip">{chip}</span>' for chip in c["chips"])

    gallery_html = ""
    if c["gallery"]:
        figs = "\n".join(
            f'''        <figure class="reveal">
          <div class="figure-media"><img src="{src}" alt="{alt}" loading="lazy"></div>
          <figcaption>{alt}</figcaption>
        </figure>'''
            for src, alt in c["gallery"]
        )
        gallery_html = f'''
  <section class="section-tight" style="background:var(--sand-50);border-top:1px solid var(--line);border-bottom:1px solid var(--line);">
    <div class="container">
      <div class="section-heading reveal">
        <div>
          <p class="eyebrow">In Store</p>
          <h2>A closer look at the {c["eyebrow"].lower()} aisle.</h2>
        </div>
      </div>
      <div class="mini-gallery reveal-group">
{figs}
      </div>
    </div>
  </section>'''

    page = head(c["title"], c["description"]) + "\n" + topbar(
        c["topbar_msg"], "This week's specials", "specials.html", cta_external=False
    ) + "\n" + header(f"{slug}.html") + f'''
<main>
{page_hero(c["eyebrow"], c["h1"], c["lede"], links_html, note="This is a sample of what we carry. There's more in store and on DoorDash.")}

  <section class="section">
    <div class="container showcase">
      <a class="showcase-media reveal" href="{c["links"][0][1]}" target="_blank" rel="noreferrer">
        <img src="{c["img"]}" alt="{c["img_alt"]}" loading="lazy">
      </a>
      <div class="showcase-copy reveal">
        <h2>{c["eyebrow"]}, stocked and ready.</h2>
        <p>Tap the image to jump straight to this category on DoorDash, or stop by 1943 S Coast Hwy &mdash; we're open until midnight, every day.</p>
        <div class="chip-row">
{chips_html}
        </div>
        <div class="showcase-links">
{links_html}
        </div>
      </div>
    </div>
  </section>
{gallery_html}
  <section class="section-tight">
    <div class="container">
      <div class="ribbon reveal">
        <div>
          <p class="eyebrow" style="color:var(--gold-500);">Keep Browsing</p>
          <h2>See what else we've got stocked.</h2>
          <p>Six aisles worth checking &mdash; beer &amp; wine, soda, snacks, candy, energy drinks, and weekly specials.</p>
        </div>
        <div class="ribbon-cta">
          <a class="btn btn-invert" href="index.html#categories">Browse All Categories</a>
        </div>
      </div>
    </div>
  </section>
</main>
''' + footer()

    write(f"{slug}.html", page)

print("\\nAll pages generated.")

