function createSimpleElement(tagName, className, textContent) {
  const elem = document.createElement(tagName);
  elem.className = className;
  elem.textContent = textContent;
  return elem;
}

function createCarousel(images) {
  const oContainer = createSimpleElement("div", "carousel-wrap");
  const oSlider = createSimpleElement("ul", "slider");
  const oCarousel = createSimpleElement("ul", "carousel");
  const prevBtn = createSimpleElement("button", "carousel-wrap--btn carousel-wrap--btn__left", "<");
  const nextBtn = createSimpleElement("button", "carousel-wrap--btn carousel-wrap--btn__right", ">");
  oContainer.append(oCarousel, oSlider, prevBtn, nextBtn);

  oSlider.appendChild(images.reduce(
    (slider, _, idx) => {
      const e = document.createElement("li");
      e.textContent = `${idx + 1}`;
      slider.appendChild(e);
      return slider;
    },
    document.createDocumentFragment()
  ));

  oCarousel.appendChild(images.reduce(
    (carousel, img, idx) => {
      const e = document.createElement("img");
      Object.assign(e, img);
      e.alt = `carousel image ${idx + 1}`;
      e.classList.add("carousel--img");
      carousel.appendChild(e);
      return carousel;
    },
    document.createDocumentFragment()
  ));

  const aBtns = oContainer.querySelectorAll(".carousel-wrap>.slider>li");
  const ii = oCarousel.querySelectorAll(".carousel--img");
  ii[ii.length - 1].parentElement.appendChild(ii[0].cloneNode(true));
  const aImg = oCarousel.querySelectorAll(".carousel--img");

  let currentImgIdx = 1;

  const playSlideShow = new IdleTask(function () {
    updateImg(++currentImgIdx);
  }, { taskInterval: 800, idleTimeout: 2000 });

  function setCarouselPos(slotId) {
    aImg.forEach((img) => img.style.left = `-${slotId * oCarousel.offsetWidth}px`);
  }

  function updateImg(i) {
    currentImgIdx = (images.length + i) % images.length;
    const leftOverboard = i < 0;
    const rightOverboard = i >= images.length;
    if (leftOverboard) {
      animate([
        [
          aImg,
          () => setCarouselPos(images.length),
          { noTransition: true }
        ],
        [
          aImg,
          () => setCarouselPos(currentImgIdx)
        ]
      ]);
    } else if (rightOverboard) {
      animate([
        [
          aImg,
          () => setCarouselPos(images.length)
        ],
        [
          aImg,
          () => setCarouselPos(0),
          { noTransition: true }
        ]
      ]);
    } else {
      setCarouselPos(currentImgIdx);
    }
    aBtns.forEach(btn => btn.classList.remove("slider--btn__active"));
    aBtns[currentImgIdx].classList.add("slider--btn__active");
  }

  listenEvent(prevBtn, "click", function () {
    playSlideShow.wait();
    updateImg(--currentImgIdx);
  });

  listenEvent(nextBtn, "click", function () {
    playSlideShow.wait();
    updateImg(++currentImgIdx);
  });

  listenEvent(oSlider, "mouseover", function (e) {
    if (e.target.tagName.toLowerCase() === "li") {
      playSlideShow.wait();
      updateImg(nodeIndexOf(e.target));
    }
  });

  updateImg(currentImgIdx);
  return oContainer;
}