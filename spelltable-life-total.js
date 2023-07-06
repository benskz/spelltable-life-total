console.debug('Initializing Spelltable Life Total.');

const DOM_POLL_INTERVAL = 3000;
const COMMIT_TIMEOUT = 1500;

const TOOLTIP_CLASS = 'spelltable-life-total-tooltip';
const TOOLTIP_SHOW_CLASS = 'spelltable-life-total-tooltip-show';
let deltaTooltip = null;

let lifeDelta = 0;
let lifeDeltaCommitTimeout = null;

// finds container and removes overflow-hidden
const prepareContainer = () => {
  // container can be found 2 levels up from decrement button
  const container = document.querySelector(
    '[aria-label="Decrement Life"]'
  ).parentElement.parentElement;

  container.classList.remove('overflow-hidden');
};

const createTooltip = () => {
  // add tooltip element to parent of buttons
  const tooltip = document.createElement('div');
  tooltip.classList.add(TOOLTIP_CLASS);
  tooltip.innerText = '0';
  document.querySelector(
    '[aria-label="Decrement Life"]'
  ).parentElement.appendChild(tooltip);
  deltaTooltip = tooltip;
};

const commitLifeDelta = () => {
  console.debug('Reset Life Delta:', lifeDelta);

  // hide the tooltip
  deltaTooltip.classList.remove(TOOLTIP_SHOW_CLASS);

  setTimeout(() => {
    // remove the tooltip
    try {
    deltaTooltip.remove();
    } finally {
      deltaTooltip = null;

      // reset the life delta
      lifeDelta = 0;
    }
  }, 300);
};

const updateLifeDelta = (delta) => {
  lifeDelta = lifeDelta + delta;

  // add tooltip if it doesn't exist
  if (!document.querySelector(`.${TOOLTIP_CLASS}`)) {
    prepareContainer();
    createTooltip();
  }

  // update the tooltip, add + if positive
  deltaTooltip.innerText = lifeDelta > 0 ? `+${lifeDelta}` : lifeDelta;
  // add the show class
  deltaTooltip.classList.add(TOOLTIP_SHOW_CLASS);

  // clear the timeout
  lifeDeltaCommitTimeout && clearTimeout(lifeDeltaCommitTimeout);

  // set a timeout to commit the life delta
  lifeDeltaCommitTimeout = setTimeout(() => {
    commitLifeDelta();

    // clear the timeout
    lifeDeltaCommitTimeout = null;
  }, COMMIT_TIMEOUT);
};

const init = () => {
  // set event listeners
  document.addEventListener('click', (event) => {
    const target = event.target;

    // catch clicks on the button and child svg and line elements
    if (
      target.matches('[aria-label="Decrement Life"]') ||
      target.parentElement.matches('[aria-label="Decrement Life"]') ||
      target.parentElement.parentElement.matches('[aria-label="Decrement Life"]')
      ) {
      updateLifeDelta(-1);
    } else if (
      target.matches('[aria-label="Increment Life"]') ||
      target.parentElement.matches('[aria-label="Increment Life"]') ||
      target.parentElement.parentElement.matches('[aria-label="Increment Life"]')
    ) {
      updateLifeDelta(1);
    }
  });

  console.debug('Successfully Initialized Spelltable Life Total.');
};

// Initialize the extension
init();
