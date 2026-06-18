const categoryAnswers = [
  {
    name: "beer",
    keywords: ["beer", "brew", "beers"],
    response: "Yes, beer is available. I can take you to our beer page or the DoorDash beer category.",
    href: "beer.html",
    action: {
      label: "DoorDash Beer",
      href: "https://www.doordash.com/convenience/store/24620532/category/beer-1351"
    }
  },
  {
    name: "chips",
    keywords: ["chips"],
    response: "Yes, we have chips. I can take you to our chips page now.",
    href: "chips.html"
  },
  {
    name: "snacks",
    keywords: ["snack", "snacks", "crisps"],
    response: "Yes, snacks are available. I can open the DoorDash snacks category for you.",
    action: {
      label: "DoorDash Snacks",
      href: "https://www.doordash.com/convenience/store/24620532/category/snacks-758"
    }
  },
  {
    name: "soda",
    keywords: ["soda", "coke", "pepsi", "soft drink", "soft drinks", "cold drink"],
    response: "Yes, we carry soda and other cold drinks. Taking you to the soda page now.",
    href: "soda.html"
  },
  {
    name: "drinks",
    keywords: ["drink", "drinks", "mixers"],
    response: "Yes, drinks and mixers are available. I can open that delivery category for you.",
    action: {
      label: "DoorDash Drinks & Mixers",
      href: "https://www.doordash.com/convenience/store/24620532/category/drinks%20%26%20mixers-814473445767577624"
    }
  },
  {
    name: "wine",
    keywords: ["wine"],
    response: "Yes, wine is available for delivery.",
    action: {
      label: "DoorDash Wine",
      href: "https://www.doordash.com/convenience/store/24620532/category/wine-1163"
    }
  },
  {
    name: "tequila",
    keywords: ["tequila"],
    response: "Yes, tequila is available for delivery.",
    action: {
      label: "DoorDash Tequila",
      href: "https://www.doordash.com/convenience/store/24620532/category/tequila-30355"
    }
  },
  {
    name: "vodka",
    keywords: ["vodka"],
    response: "Yes, vodka is available for delivery.",
    action: {
      label: "DoorDash Vodka",
      href: "https://www.doordash.com/convenience/store/24620532/category/vodka-30358"
    }
  },
  {
    name: "seltzers",
    keywords: ["seltzer", "seltzers", "hard seltzer"],
    response: "Yes, seltzers and more are available for delivery.",
    action: {
      label: "DoorDash Seltzers & More",
      href: "https://www.doordash.com/convenience/store/24620532/category/seltzers%20%26%20more-830869023863603230"
    }
  },
  {
    name: "whiskey",
    keywords: ["whiskey", "whisky"],
    response: "Yes, whiskey is available for delivery.",
    action: {
      label: "DoorDash Whiskey",
      href: "https://www.doordash.com/convenience/store/24620532/category/whiskey-30361"
    }
  },
  {
    name: "gin",
    keywords: ["gin"],
    response: "Yes, gin is available for delivery.",
    action: {
      label: "DoorDash Gin",
      href: "https://www.doordash.com/convenience/store/24620532/category/gin-30353"
    }
  },
  {
    name: "rum",
    keywords: ["rum"],
    response: "Yes, rum is available for delivery.",
    action: {
      label: "DoorDash Rum",
      href: "https://www.doordash.com/convenience/store/24620532/category/rum-30357"
    }
  },
  {
    name: "liqueur",
    keywords: ["liqueur", "liquor"],
    response: "Yes, liqueur options are available for delivery.",
    action: {
      label: "DoorDash Liqueur",
      href: "https://www.doordash.com/convenience/store/24620532/category/liqueur-3040"
    }
  },
  {
    name: "grocery",
    keywords: ["grocery", "groceries", "food"],
    response: "Yes, grocery items are available for delivery.",
    action: {
      label: "DoorDash Grocery",
      href: "https://www.doordash.com/convenience/store/24620532/category/grocery-753"
    }
  },
  {
    name: "household",
    keywords: ["household", "cleaning", "supplies"],
    response: "Yes, household items are available for delivery.",
    action: {
      label: "DoorDash Household",
      href: "https://www.doordash.com/convenience/store/24620532/category/household-754"
    }
  },
  {
    name: "non-alcoholic",
    keywords: ["non alcoholic", "non-alcoholic", "na drinks", "alcohol free"],
    response: "Yes, non-alcoholic options are available for delivery.",
    action: {
      label: "DoorDash Non-Alcoholic",
      href: "https://www.doordash.com/convenience/store/24620532/category/non-alcoholic-1516"
    }
  },
  {
    name: "rtd cocktails",
    keywords: ["rtd", "cocktail", "cocktails", "ready to drink"],
    response: "Yes, ready-to-drink cocktails are available for delivery.",
    action: {
      label: "DoorDash RTD Cocktails",
      href: "https://www.doordash.com/convenience/store/24620532/category/rtd%20cocktails-2000000000000000136"
    }
  }
];

const generalRoutes = [
  {
    keywords: ["hours", "open", "close", "closing", "time"],
    response: "Liberty Oil Inc is open every day from 7:00 AM to 12:00 AM."
  },
  {
    keywords: ["phone", "call", "number"],
    response: "You can call Liberty Oil Inc at (760) 754-8045.",
    action: { label: "Call Now", href: "tel:+17607548045" }
  },
  {
    keywords: ["address", "location", "directions", "where are you", "map"],
    response: "We are at 1943 S Coast Hwy, Oceanside, CA 92054. I can take you to the contact page or directions.",
    action: { label: "Open Contact Page", href: "contact.html" }
  },
  {
    keywords: ["delivery", "doordash", "bevz", "order"],
    response: "You can order store items through our delivery options. I can take you to the delivery section now.",
    href: "index.html#delivery"
  },
  {
    keywords: ["diesel", "gas", "fuel", "air pump", "air"],
    response: "We offer gas, diesel, a convenience store, and an air pump. Taking you to our services page.",
    href: "services.html"
  }
];

function injectAssistant() {
  const shell = document.createElement("section");
  shell.className = "assistant-shell";
  shell.innerHTML = `
    <button class="assistant-toggle" type="button" aria-expanded="false">
      Ask Liberty Assistant
    </button>
    <div class="assistant-panel" aria-live="polite">
      <h3>Liberty Assistant</h3>
      <p>Ask about store items, hours, delivery, gas, or directions.</p>
      <div class="assistant-chips">
        <button class="assistant-chip" type="button" data-question="Where's the soda?">Where's the soda?</button>
        <button class="assistant-chip" type="button" data-question="Do you have chips?">Do you have chips?</button>
        <button class="assistant-chip" type="button" data-question="What time are you open?">What time are you open?</button>
      </div>
      <form class="assistant-form">
        <input type="text" name="question" placeholder="Ask a question..." aria-label="Ask Liberty Assistant a question">
        <div class="assistant-actions">
          <button class="button button-primary" type="submit">Ask</button>
        </div>
      </form>
      <div class="assistant-response">
        <strong>Ready to help.</strong> Ask something like "Where's the soda?" and I'll point you to the right page.
      </div>
    </div>
  `;
  document.body.appendChild(shell);

  const toggle = shell.querySelector(".assistant-toggle");
  const form = shell.querySelector(".assistant-form");
  const input = shell.querySelector("input");
  const response = shell.querySelector(".assistant-response");

  toggle.addEventListener("click", () => {
    const isOpen = shell.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    if (isOpen) {
      input.focus();
    }
  });

  shell.querySelectorAll(".assistant-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      input.value = chip.dataset.question || "";
      handleAssistantQuestion(input.value, response);
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    handleAssistantQuestion(input.value, response);
  });
}

function handleAssistantQuestion(question, responseEl) {
  const cleanQuestion = question.trim().toLowerCase();
  if (!cleanQuestion) {
    responseEl.innerHTML = "<strong>Try a question.</strong> You can ask about soda, chips, beer, wine, grocery, household items, hours, delivery, or directions.";
    return;
  }

  const categoryMatch = categoryAnswers.find((entry) =>
    entry.keywords.some((keyword) => cleanQuestion.includes(keyword))
  );

  if (categoryMatch) {
    respondWithMatch(categoryMatch, responseEl);
    return;
  }

  if (cleanQuestion.includes("meat") || cleanQuestion.includes("seafood") || cleanQuestion.includes("fish")) {
    responseEl.innerHTML = `
      <strong>Liberty Assistant:</strong> I do not currently see a dedicated meat or seafood category in the listed delivery menu.
      You may still find some items under Grocery, or you can call the store for the current selection.
      <div class="assistant-actions" style="margin-top: 0.8rem;">
        <a class="button button-secondary" href="https://www.doordash.com/convenience/store/24620532/category/grocery-753" target="_blank" rel="noreferrer">DoorDash Grocery</a>
        <a class="button button-secondary" href="tel:+17607548045">Call Store</a>
      </div>
    `;
    return;
  }

  const generalMatch = generalRoutes.find((entry) =>
    entry.keywords.some((keyword) => cleanQuestion.includes(keyword))
  );

  if (generalMatch) {
    respondWithMatch(generalMatch, responseEl);
    return;
  }

  responseEl.innerHTML = "<strong>I can help with store questions.</strong> Try asking about chips, snacks, soda, beer, wine, tequila, vodka, whiskey, rum, grocery, household items, non-alcoholic drinks, delivery, hours, gas, or directions.";
}

function respondWithMatch(match, responseEl) {
  let actionMarkup = "";
  if (match.action) {
    const isExternal = match.action.href.startsWith("http");
    const rel = isExternal ? ' rel="noreferrer"' : "";
    const target = isExternal ? ' target="_blank"' : "";
    actionMarkup = `<div class="assistant-actions" style="margin-top: 0.8rem;"><a class="button button-secondary" href="${match.action.href}"${target}${rel}>${match.action.label}</a></div>`;
  }

  responseEl.innerHTML = `<strong>Liberty Assistant:</strong> ${match.response}${actionMarkup}`;

  if (match.href) {
    window.setTimeout(() => {
      window.location.href = match.href;
    }, 900);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  injectAssistant();
});
