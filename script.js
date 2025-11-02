// script.js - hamburger + animated words + AOS init

window.addEventListener('DOMContentLoaded', () => {
  // AOS init (if included)
  if (window.AOS) {
    AOS.init({ duration: 1000, easing: 'ease-in-out', once: true });
  }

  // Hamburger behaviour
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('primary-nav');
  const focusableLinks = nav ? nav.querySelectorAll('a') : [];

  function setOpen(isOpen) {
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.classList.toggle('open', isOpen);
    nav.classList.toggle('open', isOpen);
    if (isOpen) {
      toggle.setAttribute('aria-label', 'Close navigation');
      if (focusableLinks.length) focusableLinks[0].focus();
    } else {
      toggle.setAttribute('aria-label', 'Open navigation');
      toggle.focus();
    }
  }

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    setOpen(!isOpen);
  });

  nav.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') setOpen(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });

  document.addEventListener('click', (e) => {
    if (!nav || !nav.classList.contains('open')) return;
    const insideHeader = e.composedPath().includes(document.querySelector('.site-header'));
    if (!insideHeader) setOpen(false);
  });

  // Animated rotating words
  const words = document.querySelectorAll(".word");
  if (words.length) {
    words.forEach((word) => {
      const letters = word.textContent.trim().split("");
      word.textContent = "";
      letters.forEach((ch) => {
        const span = document.createElement("span");
        span.textContent = ch;
        span.className = "letter";
        word.append(span);
      });
    });

    let currentWordIndex = 0;
    const maxWordIndex = words.length - 1;
    words[currentWordIndex].style.opacity = "1";

    function changeText() {
      const currentWord = words[currentWordIndex];
      const nextWordIndex = currentWordIndex === maxWordIndex ? 0 : currentWordIndex + 1;
      const nextWord = words[nextWordIndex];

      // animate current out (stagger)
      Array.from(currentWord.children).forEach((letter, i) => {
        setTimeout(() => {
          letter.className = "letter out";
        }, i * 80);
      });

      // prepare next word
      nextWord.style.opacity = "1";
      Array.from(nextWord.children).forEach((letter) => {
        letter.className = "letter behind";
      });
      Array.from(nextWord.children).forEach((letter, i) => {
        setTimeout(() => {
          letter.className = "letter in";
        }, 300 + i * 80);
      });

      // clear previous word after animation to avoid overlap
      setTimeout(() => {
        currentWord.style.opacity = "0";
        Array.from(currentWord.children).forEach((letter) => {
          letter.className = "letter";
        });
      }, 700 + currentWord.children.length * 80);

      currentWordIndex = nextWordIndex;
    }

    // kick off
    setTimeout(() => {
      changeText();
      setInterval(changeText, 4000);
    }, 600);
  }
});
