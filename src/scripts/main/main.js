const mainJS = (_ => {
  const docSelector = ({
    el,
    all: isAll
  }) => {
    if (isAll) {
      return document.querySelectorAll(el);
    } else {
      return document.querySelector(el);
    }
  };

  const insertEl = ({
    target,
    position: pos = 'beforebegin',
    el
  }) => {
    target.insertAdjacentElement(pos, el);
  };

  const createEl = ({tag, attribute}) => {
    const el = document.createElement(tag);
    Object.assign(el, attribute);
    return el;
  };

  const carouselSlide = ({el, opts}) => {
    const error = ({msg}) => {
      return console.error(`slide script error: ${msg}`);
    };

    if (!el) {
      return error({msg: 'not found el'});
    }

    const defaultOpts = {
      mode      : 'horizontal',
      wrap      : 'ul',
      slide     : 'li',
      view      : 1,
      space     : 0,
      loop      : false,
      direction : false,
      pagination: false,
      timing     : null
    };

    const slideEl = {
      first     : null,
      last      : null,
      firstClone: null,
      lastClone : null,
      btnPrev   : null,
      btnNext   : null,
      direction : null
    };

    const slideOpt = Object.assign({}, defaultOpts, opts);
    const {mode, wrap, slide, view, loop, direction, pagination} = slideOpt;
    const carousel = docSelector({el: el});
    const slideWrap = carousel.querySelector(wrap);
    const slides = carousel.querySelectorAll(slide);
    const slideLength = slides.length;
    const cloneLength = 2;

    const setInitialElement = _ => {
      slideEl.first = slides[0];
      slideEl.last = slides[slideLength - 1];
    };

    const setInitialClone = _ => {
      slideEl.firstClone = slideEl.first.cloneNode(true);
      slideEl.lastClone = slideEl.last.cloneNode(true);

      insertEl({
        target  : slideWrap,
        position: 'afterbegin',
        el      : slideEl.lastClone
      });

      insertEl({
        target  : slideWrap,
        position: 'beforeend',
        el      : slideEl.firstClone
      });
    };

    const setInitialStyle = _ => {
      const slideWidth = Math.trunc(slideWrap.offsetWidth / view);
      const wrapWidth = slideWidth * slideLength + cloneLength;

      carousel.setAttribute('style', 'position: relative');
      slideWrap.setAttribute('style', `display: flex; width: ${wrapWidth}px; align-items: center`);
      [...slides].map((el, i) => {
        el.setAttribute('style', `flex-shrink: 0; width: ${slideWidth}px;`);
        el.dataset.index = i;
      });
    };

    const onPrevSlide = _ => {
    };

    const onNextSlide = _ => {

    };

    const onThisSlide = _ => {
    };

    const setDirection = _ => {
      slideEl.btnPrev = createEl({
        tag      : 'button',
        attribute: {
          className: 'carouselButton btnPrev',
          style    : 'position: absolute; left: 0; top: 50%; transform: translateY(-50%)'
        }
      });

      slideEl.btnNext = createEl({
        tag      : 'button',
        attribute: {
          className: 'carouselButton btnNext',
          style    : 'position: absolute; right: 0; top: 50%; transform: translateY(-50%)'
        }
      });

      slideEl.btnPrev.textContent = '<';
      slideEl.btnNext.textContent = '>';

      insertEl({
        target: slideWrap,
        el    : slideEl.btnPrev
      });

      insertEl({
        target  : slideWrap,
        position: 'afterend',
        el      : slideEl.btnNext
      });

      slideEl.btnPrev.addEventListener('click', onPrevSlide);
      slideEl.btnNext.addEventListener('click', onNextSlide);
    };

    const setPagination = _ => {
      const paginationWrap = createEl({
        tag      : 'div',
        attribute: {
          className: 'pagination',
          style: 'text-align: center'
        }
      });

      [...slides].map((el, i) => {
        const dot = createEl({
          tag      : 'button',
          attribute: {
            type     : 'button',
            className: 'dot'
          }
        });

        dot.dataset.index = i;
        dot.textContent = i;

        insertEl({
          target  : paginationWrap,
          position: 'beforeend',
          el      : dot
        });
      });

      insertEl({
        target  : carousel,
        position: 'beforeend',
        el      : paginationWrap
      });
    };

    const startInterval = _ => {
      setIndex({index: currentIndex + 1});
    };

    const stopInterval = _ => {
      clearInterval(timer);
    };

    timer = setInterval(startInterval, timing);

    carousel.addEventListener('mouseenter', stopInterval);
    carousel.addEventListener('mouseleave', _ => {
      timer = setInterval(startInterval, timing);
    });


    const setCarousel = _ => {
      setInitialStyle();
      setInitialElement();

      if (loop) {
        setInitialClone();
      }

      if (direction) {
        setDirection();
      }

      if (pagination) {
        setPagination();
      }
    };

    setCarousel();
  };

  const init = _ => {
    window.addEventListener('touchstart', _ => {});
    carouselSlide({
      el: '.slideWrap',
      opts: {
        direction: true,
        pagination: true
      }
    });
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
