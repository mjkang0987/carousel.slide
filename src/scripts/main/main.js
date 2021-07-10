const mainJS = (_ => {
  const test = _ => {
    console.log('test');
  };
  const init = _ => {
    window.addEventListener('touchstart', _ => {});
    test();
  };

  return {
    init
  };
})();

if (document.readyState === 'complete') {
  mainJS.init();
} else if (document.addEventListener) {
  document.addEventListener('DOMContentLoaded', mainJS.init);
}
