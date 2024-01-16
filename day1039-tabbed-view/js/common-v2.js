function animate(animations) {
  let i = 0;
  let nextTransformerMustCancelTransition = false;

  function execAnimation() {
    const [elemList, transformer, options] = animations[i++];

    const noTransition = options && options.noTransition;
    const doNotWait = options && options.doNotWait;
    if (nextTransformerMustCancelTransition && !noTransition) {
      console.warn("this transformer cannot have transition due to previous transformer settings",
        transformer,
        animations);
    }
    nextTransformerMustCancelTransition = noTransition && doNotWait;

    if (noTransition) {
      elemList.forEach(elem => elem.style.transition = "none");
      transformer(elemList);
      setTimeout(() => elemList.forEach(elem => elem.style.transition = ""), 0);
    } else {
      transformer(elemList);
    }

    if (i >= animations.length) {
      return;
    }
    if (options && options.doNotWait) {
      execAnimation();
    } else {
      if (noTransition) {
        setTimeout(execAnimation, 0);
      } else {
        listenEvent(elemList[0], "transitionend", execAnimation, { once: true });
      }
    }
  }

  execAnimation();
}

function IdleTask(taskFn, options = {}) {
  this.options = { idleTimeout: 500, taskInterval: 800, ...options };
  this.intervalHandle = null;
  this.idleTimer = null;
  this.wait = function () {
    clearInterval(this.intervalHandle);
    clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(() => {
      this.intervalHandle = setInterval(taskFn, this.options.taskInterval);
    }, this.options.idleTimeout);
  };
  this.wait();
}

function listenEvent(elem, event, callback, ...args) {
  let unlisten = null;
  if (elem.addEventListener) {
    elem.addEventListener(event, callback, ...args);
    unlisten = function () {
      elem.removeEventListener(event, callback);
    };
  } else {
    // IE 9
    elem.attachEvent("on" + event);
    unlisten = function () {
      elem.detachEvent("on" + event, callback);
    };
  }
  return unlisten;
}

function nodeIndexOf(node) {
  const siblings = node.parentNode.children;
  for (let i = 0; i < siblings.length; i++) {
    if (node === siblings[i]) {
      return i;
    }
  }
  return -1;
}
