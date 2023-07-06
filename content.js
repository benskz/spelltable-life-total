console.debug('Initializing Spelltable Life Total.');

const DOM_POLL_INTERVAL = 3000;
const COMMIT_TIMEOUT = 1000;

let decrementButton = null;
let incrementButton = null;

let lifeDelta = 0;
let lifeDeltaCommitTimeout = null;

const updateLifeDelta = (delta) => {
  lifeDelta = lifeDelta + delta;

  // clear the timeout
  lifeDeltaCommitTimeout && clearTimeout(lifeDeltaCommitTimeout);

  // set a timeout to commit the life delta
  lifeDeltaCommitTimeout = setTimeout(() => {
    console.debug('Reset Life Delta:', lifeDelta);

    // reset the life delta
    lifeDelta = 0;

    // clear the timeout
    lifeDeltaCommitTimeout = null;
  }, COMMIT_TIMEOUT);
};

const init = () => {
  // set event listeners
  decrementButton.addEventListener('click', (e) => {
    updateLifeDelta(-1);
  });

  incrementButton.addEventListener('click', (e) => {
    updateLifeDelta(1);
  });

  console.debug('Successfully Initialized Spelltable Life Total.');
};

// Check for decrement and increment buttons
const checkForRequiredElements = () => {
  // find the decrement button by aria-label="Decrement Life"
  const decrementButtonCheck = document.querySelector(
    '[aria-label="Decrement Life"]'
  );
  // find the increment button by aria-label="Increment Life"
  const incrementButtonCheck = document.querySelector(
    '[aria-label="Increment Life"]'
  );

  if (decrementButtonCheck && incrementButtonCheck) {
    decrementButton = decrementButtonCheck;
    incrementButton = incrementButtonCheck;
    init();
  } else {
    console.debug('Could not find required DOM elements for initialization.');
    setTimeout(checkForRequiredElements, DOM_POLL_INTERVAL);
  }
};

// Start polling for required elements
checkForRequiredElements();
