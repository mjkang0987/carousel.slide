const mainJS = (_ => {
  const userRedirect = _ => {
    return;
    const MOBILE_PATH = 'https://m.insterior.biz';
    const URL_ORIGIN = location.origin;
    const PATH = location.href.replace(URL_ORIGIN, '');
    const mobileURL = 'http://localhost:8080/views/biz/index.mobile.html';
    if (/Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      window.location.href = `${MOBILE_PATH}${PATH}`;
    }
  };

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

  const createEl = ({tag, attribute}) => {
    const el = document.createElement(tag);
    Object.assign(el, attribute);
    return el;
  };

  const ELEMENT = {
    ACCOUNT_ID   : docSelector({el: '#crema-login-username'}),
    ACCOUNT_NAME : docSelector({el: '#crema-login-name'}),
    BTN_SLIDE_ALL: docSelector({el: '.btn-all-banner'})
  };

  const INFO = {
    PRD_LINK    : '/shop/detail.php?pno=',
    IMG_LOCATION: '//insbizmallcdn.wisacdn.com/_data/product/'
  };

  const ARR_BADGE = {
    all     : '//insbizmallcdn.wisacdn.com/_data/icon/b1152c229d1bc06c24c1f92c62f166d2.jpg',
    build   : '//insbizmallcdn.wisacdn.com/_data/icon/caace9e64bc35a1bebbb30d094aba180.jpg',
    location: '//insbizmallcdn.wisacdn.com/_data/icon/ec958e1ecd3ebeb9871ef2ddb02442c0.jpg'
  };

  const {BTN_SLIDE_ALL, ACCOUNT_ID: ID, ACCOUNT_NAME: NAME} = ELEMENT;
  const {PRD_LINK, IMG_LOCATION} = INFO;
  const isLogin = !(ID === null || NAME === null) && !(ID.textContent === '' || NAME === '');

  const setLayer = ({trigger}) => {
    const elements = {
      target    : trigger,
      el        : null,
      btnClose  : null,
      transition: false
    };

    const elClass = trigger.getAttribute('aria-controls');
    elements.el = docSelector({el: `.${elClass}`});
    elements.btnClose = elements.el.querySelector('.btn-close');
    elements.transition = !!elements.el.dataset.transition;

    const {target, el, btnClose} = elements;

    const windowClickEvent = e => {
      const safetyZone = el.children[0];
      let target = e.target;
      while (target !== undefined && target.parentNode) {
        if (target === safetyZone) {
          return;
        }
        target = target.parentNode;
      }

      close();
    };

    const open = _ => {
      elements.transition = false;
      el.style.display = 'block';

      setTimeout(_ => {
        el.classList.add('on');
        window.addEventListener('click', windowClickEvent);
      }, 0);

      btnClose.addEventListener('click', close);
      el.removeEventListener('transitionend', animate);
    };

    const animate = _ => {
      if (!elements.transition) {
        return;
      }

      el.style.display = 'none';
      el.classList.remove('animate');
      elements.transition = false;
    };

    const close = _ => {
      el.classList.remove('on');
      el.classList.add('animate');
      elements.transition = true;

      el.addEventListener('transitionend', animate);
      btnClose.removeEventListener('click', close);
      window.removeEventListener('click', windowClickEvent);
    };

    target.addEventListener('click', open);
  };

  const topSlide = _ => {
    const $topSlide = $('.slide-top-wrap').slick({
      slidesToShow  : 2,
      slidesToScroll: 2,
      autoplay      : true,
      autoplaySpeed : 3000,
      direction     : true,
      centerPadding : '10px',
      prevArrow     : $('.btn-prev'),
      nextArrow     : $('.btn-next')
    });

    const $pause = $topSlide.siblings('.slide-top-buttons').children('.btn-pause');

    let isPause = false;

    $pause.on('click', _ => {
      $topSlide.slick(isPause ? 'slickPlay' : 'slickPause');
      $pause
        .attr('class', isPause ? 'btn-pause' : 'btn-play')
        .children('span')
        .text(isPause ? '일시정지' : '재생');

      isPause = !isPause;
    });
  };

  const tabEvent = ({type, target, el}) => {
    const elements = {
      tab  : null,
      panel: null,
      slide: null,
      index: 0
    };

    let currentSlide;
    let timer = null;

    const wrap = docSelector({el: `.${type}.curation`});
    const isPopular = type === 'popular';
    const items = isPopular ? BEST_ITEMS : RECOMMEND_ITEMS;
    const title = isPopular ? '🔥 지금 제일 잘 나가는 상품' : 'MD 추천 상품';

    const setUI = _ => {
      const UI = {tab: null, panel: null};
      const panelWrap = createEl({tag: 'div', attribute: {className: `${type}-panels curation-panels`}});

      UI.tab = items.reduce((acc, curr, i) => {
        const markup = `<button
            id="${type}-tab-${i + 1}"
            role="tab"
            class="curation-tab"
            aria-selected="false"
            aria-controls="${type}-panel-${i + 1}"
            data-index="${i}"
            tabindex="-1">
            <span>${curr.category}</span>
          </button>`;
        return acc + markup;
      }, '');

      items.map((prd, i) => {
        const panel = createEl({
          tag      : 'div',
          attribute: {
            id       : `${type}-panel-${i + 1}`,
            className: `curation-panel ${type}-panel`,
            tabIndex : `${i === 0 ? 0 : -1}`,
            hidden   : true
          }
        });
        panel.setAttribute('role', 'tabpanel');

        const UI = prd.products.reduce((acc, curr) => {
          const discount = curr.price.origin - curr.price.sale;
          const percent = (discount / curr.price.origin * 100);
          const price = curr.price.origin.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
          const origin = curr.price.origin.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
          const badge = curr.badge.length > 0 ? curr.badge.reduce((acc, curr) => acc + `<img src="${ARR_BADGE[curr]}" alt="">`, ['']) : '';

          const markup = `<div class="product">
            <a href="${PRD_LINK}${curr.href}">
              <span class="img">
                <span class="img-wrap">
                  <img
                    src="${IMG_LOCATION}${curr.img}"
                    onerror="this.src='//insterior.biz/_skin/insterior/img/etc/transparent.png'"
                    alt="">
                </span>
              </span>
              <div class="info">
                <span class="brand">${curr.brand}</span>
                <strong class="name">${curr.name}</strong>
                <div class="price${!isLogin ? ' visitor' : ''}">
                ${!isLogin
    ? '<span class="visitor-price">사업자회원 특별할인가</span>'
    : `<span class="price-wrap">
          ${curr.price.origin !== 0 && curr.price.origin !== curr.price.sale
    ? `<span class="percent">${Math.trunc(percent)}%</span>
            <span class="origin">
              <em>${origin}</em>
            </span>`
    : ''}
                  <span class="sale">
                    <em>${price}</em><span>원</span>
                  </span>
                </span>`}
                ${curr.badge.length > 0 ? `<div class="badge">${badge}</div>` : ''}
                </div>
              </div>
            </a>
          </div>`;

          return acc + markup;
        }, '');

        panel.innerHTML = '<div class="panel-wrap">' + UI + '</div>';
        panelWrap.insertAdjacentElement('beforeend', panel);
      });

      wrap.innerHTML = `<div class="curation-wrap">
        <h2>${title}</h2>
        <div class="curation-tabs">
          <div class="${type}-tabs tab-wrap">
            ${UI.tab}
          </div>
        </div>
      </div>`;

      wrap.querySelector('.curation-wrap').insertAdjacentElement('beforeend', panelWrap);
    };

    const setTabEvent = _ => {
      const tabs = docSelector({el: `${target} [role="tab"]`, all: true});
      const panels = docSelector({el: `${el} [role="tabpanel"]`, all: true});
      const length = panels.length;
      const timing = 5000;

      const setTab = _ => {
        const tabAttr = {
          'tabIndex'    : 0,
          'ariaSelected': true
        };

        elements.tab = tabs[elements.index];
        elements.panel = panels[elements.index];
        elements.slide = $(el).find('.panel-wrap').eq(elements.index);

        Object.assign(elements.tab, tabAttr);
        elements.panel.removeAttribute('hidden');
      };

      const setSlide = _ => {
        if (currentSlide) {
          currentSlide.slick('unslick');
        }

        currentSlide = $(elements.slide).slick({
          slidesToShow  : 5,
          slidesToScroll: 5,
          infinite      : false,
          dots          : false,
          direction     : true
        });
      };

      const hideElement = _ => {
        const tabAttr = {
          'tabIndex'    : -1,
          'ariaSelected': false
        };

        const panelAttr = {
          'tabindex': -1,
          'hidden'  : true
        };

        Object.assign(elements.tab, tabAttr);
        Object.assign(elements.panel, panelAttr);
      };

      const showElements = _ => {
        const tabAttr = {
          'tabIndex'    : 0,
          'ariaSelected': true
        };

        Object.assign(elements.tab, tabAttr);
        elements.panel.setAttribute('tabindex', 0);
        elements.panel.removeAttribute('hidden');
      };

      const setElements = ({target, panelId}) => {
        elements.tab = target;
        elements.panel = docSelector({el: panelId});
        elements.slide = elements.panel.querySelector('.panel-wrap');
        elements.index = target.getAttribute('data-index');
      };

      const onChange = e => {
        const target = e.target;
        const panelId = `#${target.getAttribute('aria-controls')}`;

        hideElement();
        setElements({target, panelId});
        showElements();
        setSlide();
      };

      const startInterval = _ => {
        elements.index = length - 2 < elements.index ? 0 : Number(elements.index) + 1;

        hideElement();
        setTab();
        setSlide();
      };

      const stopInterval = _ => {
        clearInterval(timer);
      };

      tabs.forEach(tab => {
        tab.addEventListener('click', onChange);
      });

      setTab();
      setSlide();

      timer = setInterval(startInterval, timing);

      wrap.addEventListener('mouseenter', stopInterval);
      wrap.addEventListener('mouseleave', _ => {
        timer = setInterval(startInterval, timing);
      });
    };

    setUI();
    setTabEvent();
  };

  const init = _ => {
    window.addEventListener('touchstart', _ => {});
    userRedirect();
    topSlide();
    tabEvent({type: 'popular', target: '.popular-tabs', el: '.popular-panels'});
    tabEvent({type: 'recommend', target: '.recommend-tabs', el: '.recommend-panels'});
    setLayer({trigger: BTN_SLIDE_ALL});
  };

  return {
    init,
    userRedirect
  };
})();

mainJS.userRedirect();

if (document.readyState === 'complete') {
  mainJS.init();
} else if (document.addEventListener) {
  document.addEventListener('DOMContentLoaded', mainJS.init);
}
