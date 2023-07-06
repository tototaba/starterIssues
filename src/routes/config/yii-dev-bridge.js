const PARENT_ORIGIN = 'http://cps.test';

// Only active when ?_bridge=true is used
exports.active = /[?&]_bridge=true(&|$)/.test(window.location.search);

exports.connect = () => {
  console.log('[CRA] CRA<->Yii2 development bridge active');
  console.log(
    '[CRA] Ignore webpackHotDevClient.js WebSocket/development server errors'
  );

  // Assume that the list of scripts in the body are the endpoints
  const endpoints = Array.from(document.querySelectorAll('body > script')).map(
    script => script.src
  );

  // Tell the parent that we're ready
  console.log('[CRA] Bridge ready');
  window.parent.postMessage(
    {
      type: 'BRIDGE_READY',
      endpoints,
    },
    PARENT_ORIGIN
  );

  window.addEventListener('beforeunload', e => {
    // On unload (most likely because of a dev server refresh) tell the parent frame to reload
    window.parent.postMessage(
      {
        type: 'UNLOAD',
      },
      PARENT_ORIGIN
    );
  });
};
