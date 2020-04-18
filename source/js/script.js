// Оживление мобильного меню
var menu = document.getElementById('menu-mobile');
var menuOpenBtn = document.querySelector('.header__icon-menu a');
var menuCloseBtn = menu.querySelector('.menu-mobile__icon-close');
var menuLinks = menu.querySelectorAll('.menu-mobile__link');

// Открытие мобильного меню
menuOpenBtn.addEventListener('click', function (evt) {
  evt.preventDefault();
  menuOpen();
});

// Закрытие мобильного меню кнопкой "Закрыть"
menuCloseBtn.addEventListener('click', function (evt) {
  evt.preventDefault();
  menuClose();
});

// Закрытие мобильного меню после клика по ссылке
var addMenuLinksClickHandler = function (menuLink) {
  menuLink.addEventListener('click', function (evt) {
    evt.preventDefault();
    menuClose();
  });
};

for (var i = 0; i < menuLinks.length; i++) {
  addMenuLinksClickHandler(menuLinks[i]);
}

// Закрытие мобильного меню клавишей ESC
window.addEventListener('keydown', function (evt) {
  if (evt.keyCode === 27) {
    evt.preventDefault();

    // Проверка, открыто ли мобильное меню
    if (menu.classList.contains('menu-mobile--shown')) {
      menuClose();
    }
  }
});

// Открытие мобильного меню
function menuOpen() {
  menu.classList.add('menu-mobile--shown');
}

// Закрытие мобильного меню
function menuClose() {
  // Сброс CSS-анимации
  menu.classList.remove('menu-mobile--shown');
  void menu.offsetWidth;
  menu.classList.add('menu-mobile--shown');

  menu.classList.add('menu-mobile--hide');
  window.setTimeout(function () {
    menu.classList.remove('menu-mobile--shown');
    menu.classList.remove('menu-mobile--hide');
  }, 1000);
}

// Плавная прокрутка к якорю после клика по ссылке
var sections = {
  header: document.getElementById('header'),
  works: document.getElementById('works'),
  about: document.getElementById('about'),
  price: document.getElementById('price'),
  footer: document.getElementById('footer'),
};
var links = {
  header: document.querySelectorAll('a[href="#header"]'),
  works: document.querySelectorAll('a[href="#works"]'),
  about: document.querySelectorAll('a[href="#about"]'),
  price: document.querySelectorAll('a[href="#price"]'),
  footer: document.querySelectorAll('a[href="#footer"]'),
};

var addLinksClickHandler = function (link, section) {
  link.addEventListener('click', function (evt) {
    evt.preventDefault();
    section.scrollIntoView({behavior: 'smooth'});
  });
};

for (var link in links) {
  for (var j = 0; j < links[link].length; j++) {
    addLinksClickHandler(links[link][j], sections[link]);
  }
}

// Оживление блока социальных ссылок и блока пагинации
var social = document.querySelector('.social--vertical');
social.style.opacity = 0;

var pagination = document.querySelector('.pagination');
var paginationLinks = pagination.querySelectorAll('.pagination__link');
paginationLinks[0].classList.add('pagination__link--active');

window.onscroll = function () {
  var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  // Оживление плавающего блока социальных ссылок
  if (scrollTop < 700) {
    (function socialFadeOut() {
      if (social.style.opacity > 0) {
        social.style.opacity -= 0.1;
        setTimeout(socialFadeOut, 50);
      } else {
        social.style.display = 'none';
      }
    })();
  } else {
    social.style.removeProperty('display');

    (function socialFadeIn() {
      var opacityValue = parseFloat(social.style.opacity);

      if (opacityValue < 1) {
        opacityValue += 0.1;
        social.style.opacity = opacityValue;
        setTimeout(socialFadeIn, 50);
      }
    })();
  }

  // Оживление блока пагинации
  if (scrollTop < 600) {
    if (pagination.classList.contains('pagination--right')) {
      pagination.classList.remove('pagination--right');
    }
  } else {
    if (!pagination.classList.contains('pagination--right')) {
      pagination.classList.add('pagination--right');
    }
  }

  // Активные ссылки блока пагинации
  if (isSectionInView(sections.header)) {
    paginationActive(0);
  }
  if (isSectionInView(sections.works)) {
    paginationActive(1);
  }
  if (isSectionInView(sections.about)) {
    paginationActive(2);
  }
  if (isSectionInView(sections.price)) {
    paginationActive(4);
  }
  if (isSectionInView(sections.footer)) {
    paginationActive(5);
  }
};

// Проверка, находится ли блок во вьюпорте
function isSectionInView(elmnt) {
  var scrollY = window.scrollY || window.pageYOffset;
  var sectionPosition = elmnt.getBoundingClientRect().top + scrollY;

  if (scrollY >= sectionPosition && scrollY < sectionPosition + elmnt.clientHeight || scrollY + window.innerHeight >= document.body.clientHeight) {
    return true;
  }

  return false;
}

// Активная ссылка блока пагинации
function paginationActive(n) {
  pagination.querySelector('.pagination__link--active').classList.remove('pagination__link--active');
  paginationLinks[n].classList.add('pagination__link--active');
}
