const COMMIT_TIMEOUT = 1500;

const TOOLTIP_CLASS = 'spelltable-life-total-tooltip';
const TOOLTIP_SHOW_CLASS = 'spelltable-life-total-tooltip-show';
let deltaTooltip = null;
let deltaTooltipHideTimeout = null;
let deltaTooltipRemoveTimeout = null;

let lifeDelta = 0;

// finds container and removes overflow-hidden
const prepareContainer = () => {
  // container can be found 2 levels up from decrement button
  const container = document.querySelector(
    '[aria-label="Decrement Life"]'
  ).parentElement.parentElement;

  container.classList.remove('overflow-hidden');
};

const createTooltip = () => {
  if (document.querySelector(`.${TOOLTIP_CLASS}`)) {
    return;
  }

  prepareContainer();

  // add tooltip element to parent of buttons
  const tooltip = document.createElement('div');
  tooltip.classList.add(TOOLTIP_CLASS);
  document.querySelector(
    '[aria-label="Decrement Life"]'
  ).parentElement.appendChild(tooltip);
  deltaTooltip = tooltip;
};

const showTooltip = (content, duration, onHide) => {
  // clear the hide timeout
  deltaTooltipHideTimeout && clearTimeout(deltaTooltipHideTimeout);

  // stop the remove timeout
  deltaTooltipRemoveTimeout && clearTimeout(deltaTooltipRemoveTimeout);

  if (!document.querySelector(`.${TOOLTIP_CLASS}`)) {
    prepareContainer();
    createTooltip();
  }

  // remove any existing content
  deltaTooltip.innerHTML = '';

  // add the content
  if (typeof content === 'string' || typeof content === 'number') {
    deltaTooltip.innerText = content;
  } else {
    deltaTooltip.appendChild(content);
  }

  // if the tooltip is not already showing, show it
  if (!deltaTooltip.classList.contains(TOOLTIP_SHOW_CLASS)) {
    deltaTooltip.classList.add(TOOLTIP_SHOW_CLASS);
  }

  // set a timeout to hide the tooltip
  if (duration) {
    deltaTooltipHideTimeout = setTimeout(() => {
      hideTooltip(onHide);
    }, duration);
  }
};

const hideTooltip = (callback) => {
  if (!document.querySelector(`.${TOOLTIP_CLASS}`)) {
    return;
  }

  // remove the show class
  deltaTooltip.classList.remove(TOOLTIP_SHOW_CLASS);

  // remove the tooltip
  deltaTooltipRemoveTimeout = setTimeout(() => {
    try {
      deltaTooltip.remove();
    } finally {
      callback && callback();
      deltaTooltip = null;
    }
  }, 300);
};

const updateLifeDelta = (delta) => {
  lifeDelta = lifeDelta + delta;

  showTooltip(lifeDelta > 0 ? `+${lifeDelta}` : lifeDelta, COMMIT_TIMEOUT, () => {
    console.debug('Reset Life Delta:', lifeDelta);
    lifeDelta = 0;
  });
};

const LIFE_CHANGE_FORM_HIDE_TIMEOUT_DURATION = 3000;
let lifeChangeFormHideTimeout = null;

const displayLifeChangeInput = () => {
  // start the hide timeout
  lifeChangeFormHideTimeout = setTimeout(() => {
    hideTooltip();
  }, LIFE_CHANGE_FORM_HIDE_TIMEOUT_DURATION);

  // create container
  const container = document.createElement('div');
  container.classList.add('spelltable-life-total-change-form');

  // create subtract button
  const subtractButton = document.createElement('button');
  subtractButton.type = 'button';
  subtractButton.innerText = '-';
  subtractButton.classList.add('spelltable-life-total-change-form-button');
  subtractButton.classList.add('spelltable-life-total-change-form-button-subtract');

  // add click listener
  subtractButton.addEventListener('click', () => {
    const input = container.querySelector('input');

    // get master input by [aria-label="Life Total"] and not disabled
    const masterInput = document.querySelector(
      '[aria-label="Life Total"]:not([disabled])'
    );

    // if no input, master input, do nothing
    if (!input?.value || !masterInput) {
      return;
    }

    console.debug('Subtracting life:', input.value);

    const inputValue = parseInt(input.value);
    const masterValue = parseInt(masterInput.value);
    const newValue = masterValue - inputValue;

    // focus master input
    masterInput.focus();

    // set new value
    masterInput.value = newValue;

    // trigger change event
    const event = new Event('change', { bubbles: true });
    masterInput.dispatchEvent(event);

    // unfocus master input
    masterInput.blur();

    // show delta tooltip
    updateLifeDelta(inputValue * -1);

    // stop the hide timeout
    lifeChangeFormHideTimeout && clearTimeout(lifeChangeFormHideTimeout);

    // clear input
    input.value = '';
  });

  container.appendChild(subtractButton);

  // create the input element in tooltip
  const input = document.createElement('input');
  input.type = 'number';
  input.placeholder = 0;
  input.classList.add('spelltable-life-total-change-form-input');
  container.appendChild(input);

  // create add button
  const addButton = document.createElement('button');
  addButton.type = 'button';
  addButton.innerText = '+';
  addButton.classList.add('spelltable-life-total-change-form-button');
  addButton.classList.add('spelltable-life-total-change-form-button-add');

  // add click listener
  addButton.addEventListener('click', () => {
    const input = container.querySelector('input');

    // get master input by [aria-label="Life Total"] and not disabled
    const masterInput = document.querySelector(
      '[aria-label="Life Total"]:not([disabled])'
    );

    // if no input, master input, do nothing
    if (!input?.value || !masterInput) {
      return;
    }

    console.debug('Adding life:', input.value);

    const inputValue = parseInt(input.value);
    const masterValue = parseInt(masterInput.value);
    const newValue = masterValue + inputValue;

    // focus master input
    masterInput.focus();

    // set new value
    masterInput.value = newValue;

    // trigger change event
    const event = new Event('change', { bubbles: true });
    masterInput.dispatchEvent(event);

    // unfocus master input
    masterInput.blur();

    // show delta tooltip
    updateLifeDelta(inputValue);

    // stop the hide timeout
    lifeChangeFormHideTimeout && clearTimeout(lifeChangeFormHideTimeout);

    // clear input
    input.value = '';
  });

  container.appendChild(addButton);

  // handle hiding the tooltip
  // add mouseenter and mouseleave listeners
  container.addEventListener('mouseenter', () => {
    // clear the hide timeout
    lifeChangeFormHideTimeout && clearTimeout(lifeChangeFormHideTimeout);
  });
  container.addEventListener('mouseleave', () => {
    // if input in focus, do nothing
    if (document.activeElement === input) {
      return;
    }

    // start the hide timeout
    lifeChangeFormHideTimeout = setTimeout(() => {
      hideTooltip();
    }, LIFE_CHANGE_FORM_HIDE_TIMEOUT_DURATION);
  });

  // on blur hide the tooltip if not hovering
  input.addEventListener('blur', () => {
    // if hovering, do nothing
    if (container.matches(':hover')) {
      return;
    }

    // start the hide timeout
    lifeChangeFormHideTimeout = setTimeout(() => {
      hideTooltip();
    }, LIFE_CHANGE_FORM_HIDE_TIMEOUT_DURATION);
  });

  showTooltip(container);
};

const init = () => {
  // set click listeners
  document.addEventListener('click', (event) => {
    const target = event.target;

    if (
      // catch clicks on the decrement button and child svg and line elements
      target.matches('[aria-label="Decrement Life"]') ||
      target.parentElement?.matches('[aria-label="Decrement Life"]') ||
      target.parentElement?.parentElement?.matches('[aria-label="Decrement Life"]')
      ) {
      updateLifeDelta(-1);
    } else if (
      // catch clicks on the increment button and child svg and line elements
      target.matches('[aria-label="Increment Life"]') ||
      target.parentElement?.matches('[aria-label="Increment Life"]') ||
      target.parentElement?.parentElement?.matches('[aria-label="Increment Life"]')
    ) {
      updateLifeDelta(1);
    } else if (
      // catch clicks on non disable life total inputs
      target?.matches('[aria-label="Life Total"]') &&
      !target.disabled
    ) {
      displayLifeChangeInput();
    }
  });

  console.debug('Successfully Initialized Spelltable Life Total.');
};

// Initialize the extension
console.debug('Initializing Spelltable Life Total.');
init();
