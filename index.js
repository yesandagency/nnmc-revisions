(()=>{
/* Ensures that the box overhang only takes up 50% of the space,
*  as it overhangs below the component by 50%. If JS is disabled
*  then it will use a preset value that should be reasonable in 
*  most cases.*/
document.querySelectorAll('.homepage-header__floating-box').forEach((box) => {
  const updateBounds = () => {
    const height = box.clientHeight;
    if (window.matchMedia("(min-width: 1024px)").matches) {
      box.style.marginBottom = `-${height/2}px`;
    } else {
      box.style.marginBottom = '-200px';
    }
  };

  window.addEventListener('resize', updateBounds);
  updateBounds();
});

/**
 * Allows pausing/playing video
 */
document.querySelectorAll('.homepage-header video').forEach((video) => {
  video.addEventListener('click', () => {
    video.paused ? video.play() : video.pause();
  });
})})();
(()=>{const maps = document.querySelectorAll('.maps__location__area');
const geocoder = new google.maps.Geocoder();

if (maps) {
  maps.forEach((mapElement) => {
    async function initMap() {
      const { Map } = await google.maps.importLibrary("maps");

      const map = new Map(mapElement, {          
        center: { lat: 36.004057, lng: -106.08444 },
        zoom: 8,
      });

      const getLocation = (address, latlng) => {
        if (!latlng) return geocoder.geocode({ address }).then((v) => {
          const location = v.results && Array.isArray(v.results) && v.results[0].geometry ? v.results[0].geometry.location : undefined;
          return location || undefined;
        });
        else return new Promise((res) => {
          const llp = latlng.split(',');
          res({ lat: parseFloat(llp[0]), 
                lng: parseFloat(llp[1]) });
        })
      }
      
      getLocation(
        mapElement.getAttribute('data-address'), 
        mapElement.getAttribute('data-latlng')
      ).then((location) => {
          map.setCenter(location);
          map.setZoom(15);

          new google.maps.Marker({
            position: location,
            map: map,
            title: 'Marker Title',
          });
        });

    }

    initMap();
  });
}})();
(()=>{document.querySelectorAll('.tabs').forEach((tabsBody) => {
  
  const tablist = tabsBody.querySelector('.tabs__tablist');
  const tabs = tabsBody.querySelectorAll('.tabs__tablist__tab');
  const panels = tabsBody.querySelectorAll('.tabs__items__item');
      
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const selectedTab = tab;
      const selectedIndex = parseInt(selectedTab.getAttribute('data-index'));

      tabs.forEach((tab, i) => {
        tab.classList.toggle('tabs__tablist__tab--active', i === selectedIndex);

        if (window.matchMedia('(max-width: 1024px)').matches) {
          const isExpanded = tablist.classList.contains('tabs__tablist--mobile-expanded');
          tablist.classList.toggle('tabs__tablist--mobile-expanded', !isExpanded);
          tablist.classList.toggle('tabs__tablist--mobile-collapsed', isExpanded);
        }
      });

      panels.forEach((panel, i) => {
        panel.classList.toggle('tabs__items__item--active', selectedIndex === i);
      });

    })
  })
})})();
(()=>{const socialFeeds = document.querySelectorAll('.social-feed');

socialFeeds.forEach((feed) => {
  const prev = feed.querySelector('.social-feed__body__carousel__button--prev');
  const next = feed.querySelector('.social-feed__body__carousel__button--next');
  const items = feed.querySelector('.social-feed__body__carousel__items');

  let blockScroll = false;

  const scroll = (dir) => {
    if (blockScroll) return;

    const gap = parseInt(getComputedStyle(items).getPropertyValue('gap'));
    const itemWidth = items.children[0].clientWidth + gap;

    items.scrollBy({ left: itemWidth * dir, behavior: 'smooth' });
    blockScroll = true;
    
    setTimeout(() => { blockScroll = false; }, 300);
  }

  prev.addEventListener('click', () => scroll(-1));
  next.addEventListener('click', () => scroll(1));
})})();
(()=>{document.querySelectorAll('.accordion').forEach((accordion) => {

  const items = accordion.querySelectorAll('.accordion__items__item');

  items.forEach((details) => {
    details.addEventListener('toggle', (e) => {
      const target = e.currentTarget;

      items.forEach((item) => {
        if (!target.attributes.getNamedItem('open')) return;
        if (item !== target && item.attributes.getNamedItem('open')) {
          item.attributes.removeNamedItem('open');
        }
      })
    })
  })
})})();
(()=>{const carousels = document.querySelectorAll('.carousel');

carousels.forEach((feed) => {
  const prev = feed.querySelector('.carousel__items__prev');
  const next = feed.querySelector('.carousel__items__next');
  const itemsHost = feed.querySelector('.carousel__items__image-host');
  const indicators = feed.querySelector('.carousel__indicators__items');
  const accessibility = feed.querySelector('.carousel__indicators__accessible');

  let itemSize = 0;
  let blockScroll = false;

  /** Add select options for accessibility */
  
  const scroll = (dir, to = -1) => {
    if (blockScroll) return;

    const gap = parseInt(getComputedStyle(itemsHost).getPropertyValue('gap'));
    const itemWidth = itemsHost.children[0].clientWidth + gap;

    if (to !== -1) {
      itemsHost.scrollTo({ left: itemWidth * to, behavior: 'smooth' });
    } else {
      itemsHost.scrollBy({ left: itemWidth * dir, behavior: 'smooth' });
    }
    
    blockScroll = true;
    
    setTimeout(() => { blockScroll = false; }, 300);
  }

  const calculateItemWidth = () => {
    itemSize = itemsHost.clientWidth;
  };

  const handleScroll = () => {
    const id = parseInt((itemsHost.scrollLeft + (itemSize/2)) / itemSize - 0.5);

    indicators.childNodes.forEach((node, i) => {
      node.classList.toggle('carousel__indicators__items__item--active', i === id);
      accessibility.value = id;
    });
  }

  indicators.childNodes.forEach((indicator) => {
    const id = parseInt(indicator.getAttribute('data-index'));
    indicator.addEventListener('click', () => scroll(1, id));
  });

  accessibility.addEventListener('change', (i) => {
    scroll(1, parseInt(i.target.value));
  });

  window.addEventListener('resize', calculateItemWidth);
  itemsHost.addEventListener('scroll', handleScroll)
  prev.addEventListener('click', () => scroll(-1));
  next.addEventListener('click', () => scroll(1));

  calculateItemWidth();
});})();
(()=>{document.querySelectorAll('.image-tiles-tile').forEach((tile) => {
  const tilebutton = tile.querySelector('.image-tiles-tile__button');
  const details = tile.querySelector('.image-tiles-tile__details');
  const close = tile.querySelector('.image-tiles-tile__details__close');

  details.toggleAttribute('inert', true);

  const showDetails = (e) => {
    const allTiles = tile.parentNode.querySelectorAll('.image-tiles-tile__details');
    allTiles.forEach((tile) => {
      if (tile !== e.target) {
        tile.classList.remove('image-tiles-tile__details--active');
        tile.classList.add('image-tiles-tile__details--inactive');
        tile.toggleAttribute('inert', false);
      }
    });

    details.classList.remove('image-tiles-tile__details--inactive');
    details.classList.add('image-tiles-tile__details--active');
    details.toggleAttribute('inert', false);
  };
  
  const hideDetails = () => {
    details.classList.remove('image-tiles-tile__details--active');
    details.classList.add('image-tiles-tile__details--inactive');
    details.toggleAttribute('inert', true);
    tilebutton.focus();
  };

  const toggleDetails = (e) => {
    details.classList.contains('image-tiles-tile__details--active')
      ? hideDetails(e)
      : showDetails(e);
  }

  tilebutton.addEventListener('click', toggleDetails);
  close.addEventListener('click', toggleDetails);
});})();
(()=>{document.querySelectorAll('.text-input').forEach((e) => {    
  const placeholder = e.querySelector('.text-input__container__placeholder');
  const input = e.querySelector('.text-input__container__input');

  const updateState = () => {
    placeholder.classList.toggle('text-input__container__placeholder--active', input.value);
  }

  if (input) {
    input.addEventListener('input', updateState);
  }

  updateState();
});})();
(()=>{document.querySelectorAll('#back-to-top').forEach((btt) => {
  btt.addEventListener('click', () => {
    document.scrollingElement.scrollTo({ top: 0, behavior: 'smooth' });
  });
})})();
(()=>{const calendar = document.querySelector('#view-container');

if (calendar) {
  const listView = calendar.querySelector('.event-wrapper');
  const gridView = calendar.querySelector('.grid-wrapper');

  const showListButton = calendar.querySelector('[data-action="show-list"]');
  const showGridButton = calendar.querySelector('[data-action="show-grid"]');

  const monthButton = calendar.querySelector('.fc-dayGridMonth-button');
  const weekButton = calendar.querySelector('.fc-timeGridWeek-button');
  const dayButton = calendar.querySelector('.fc-timeGridDay-button');

  const monthGrid = calendar.querySelector('.fc-daygrid');
  const weekGrid = calendar.querySelector('.fc-timegrid');
  const dateTitle = calendar.querySelector('.fc-toolbar-title');

  const showGridView = () => {
    showListButton.setAttribute('aria-selected', false);
    showGridButton.setAttribute('aria-selected', true);
    listView.classList.add('hide');
    gridView.classList.remove('hide');
  };

  const showListView = () => {
    showListButton.setAttribute('aria-selected', true);
    showGridButton.setAttribute('aria-selected', false);
    listView.classList.remove('hide');
    gridView.classList.add('hide');
  };

  const setView = (target) => {
    const activeButton = monthButton.parentElement.querySelector('.fc-button-active');
    activeButton.classList.remove('fc-button-active');
    activeButton.setAttribute('aria-selected', 'false');
    
    target.classList.add('fc-button-active');
    target.setAttribute('aria-selected', 'true');

    monthGrid.classList.add('hide');
    weekGrid.classList.add('hide');

    if (target === monthButton) {
      monthGrid.classList.remove('hide');
      dateTitle.innerHTML = 'September 2023';
    }

    if (target === weekButton) {
      weekGrid.classList.remove('hide');
      calendar.querySelectorAll('.fc-col-header-cell, .fc-timegrid-col, .fc-daygrid-day').forEach((e) => {
        e.classList.remove('hide');
      });
      dateTitle.innerHTML = 'Sep 17 – 23, 2023';
    }
    if (target === dayButton) {
      weekGrid.classList.remove('hide');
      calendar.querySelectorAll('.fc-col-header-cell:not(.fc-day-today), .fc-timegrid-col:not(.fc-day-today), .fc-daygrid-day:not(.fc-day-today)').forEach((e) => {
        e.classList.add('hide');
      });
      dateTitle.innerHTML = 'September 22, 2023';
    }

    
  }

  monthButton.addEventListener('click', () => setView(monthButton));
  weekButton.addEventListener('click', () => setView(weekButton));
  dayButton.addEventListener('click', () => setView(dayButton));

  showListButton.addEventListener('click', showListView);
  showGridButton.addEventListener('click', showGridView);

  /** Dropdowns */
  calendar.querySelectorAll('.dropdown').forEach((dd) => {
    dd.addEventListener('click', () => {
      calendar.querySelectorAll('.dropdown.is-open').forEach((d) => {
        d.classList.remove('is-open');
        d.querySelector('.dropdown-trigger').setAttribute('aria-expanded', false);
      });

      const isOpen = dd.classList.contains('is-open');
      dd.classList.toggle('is-open', !isOpen);
      dd.querySelector('.dropdown-trigger').setAttribute('aria-expanded', !isOpen);

    })
  })
}})();
(()=>{document.querySelectorAll('.header-host').forEach((headerHost) => {
  const header = headerHost.querySelector('.header');
  const searchBox = header.querySelector('.header__search');
  const searchButton = header.querySelector('#searchButton');
  const menuItems = header.querySelectorAll('.header__menu__item');
  const searchClose = header.querySelector('.header-search__close');

  const mobileMenu = headerHost.querySelector('.header--mobile');
  const mobileSearchButton = mobileMenu.querySelector('#mobileSearchButton');
  const mobileMenuOpen = mobileMenu.querySelector('.header__header__hamburger');
  const mobileMenuClose = mobileMenu.querySelector('.header__header__close');

  searchBox.toggleAttribute('inert', true);

  const toggleSearch = (force) => {
    const isInactive = typeof force === 'boolean' 
                        ? header.classList.toggle('inactive', !force) 
                        : header.classList.toggle('inactive');
    searchBox.toggleAttribute('inert', isInactive);
    searchButton.classList.toggle('active', !isInactive);
  }

  searchClose.addEventListener('click', () => toggleSearch(false));
  searchButton.addEventListener('click', toggleSearch);

  menuItems.forEach((element) => {
    const submenu = element.querySelector('.header__menu__item__submenu');

    const blur = () => {
      element.blur();
    }  
    
    const focus = () => {
      element.focus();
    }

    submenu.addEventListener('mouseleave', blur);
    element.addEventListener('mouseenter', focus);
  });

  const openMobileMenu = () => {
    mobileMenu.classList.add('header--mobile--active');
  }

  const showMobileSearch = () => {
    mobileMenu.classList.add('header--mobile--search-active');
  }

  const closeMobileMenu = () => {
    
    if (mobileMenu.classList.contains('header--mobile--search-active')) {
      mobileMenu.classList.remove('header--mobile--search-active');
    } else {
      mobileMenu.classList.remove('header--mobile--active');
    }
  }

  mobileMenuOpen.addEventListener('click', openMobileMenu);
  mobileMenuClose.addEventListener('click', closeMobileMenu);
  mobileSearchButton.addEventListener('click', showMobileSearch);
})})();
