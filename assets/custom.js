console.log("test");

document.addEventListener("DOMContentLoaded", function () {
    const header = document.querySelector('.header__columns.spacing-style');

    if (!header) return;

    // Initial margin (you can adjust if needed)
    header.style.transition = "margin-top 0.3s ease";

    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        header.style.marginTop = "0px";
      } else {
        header.style.marginTop = ""; // Or set to original value like "20px"
      }
    });
  });


  document.addEventListener("DOMContentLoaded", function () {
    const bars = document.querySelectorAll('[class^="ai-bar-fill-"]');

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const finalWidth = bar.getAttribute("data-width");
            console.log(bar);
          if (finalWidth) {
            bar.style.width = finalWidth;
          }
          
          obs.unobserve(bar); // prevent it from triggering again
        }
      });
    }, {
      threshold: 0.5 // element must be at least 50% in view
    });

    bars.forEach(bar => {
      observer.observe(bar);
    });
  });

  // Auto-add IDs to li elements for internal page anchor links
  document.addEventListener("DOMContentLoaded", function () {
    const internalPageContent = document.querySelector('.internal-page-content');

    if (internalPageContent) {
      // Find all li elements in ul within the content
      const listItems = internalPageContent.querySelectorAll('ul li');

      listItems.forEach((li, index) => {
        // Add ID based on index (1-based to match the anchor links)
        const id = (index + 1).toString();
        li.id = id;
      });

      // Handle smooth scrolling for anchor links
      const anchorLinks = document.querySelectorAll('.internal-page-sidebar a[href^="#"]');

      anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
          e.preventDefault();

          const targetId = this.getAttribute('href').substring(1);
          const targetElement = document.getElementById(targetId);

          if (targetElement) {
            const elementPosition = targetElement.offsetTop;
            const offsetPosition = elementPosition - 80; // Отступ 80px сверху

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        });
      });
    }
  });

  // CUSTOM Animated Stats Counter for SP Our Stats Count section in Our-Scientists page
  document.addEventListener("DOMContentLoaded", function () {
    const statNumbers = document.querySelectorAll('.stat-number');

    function parseNumberAndFormat(originalText) {
      // Extract numeric value and preserve formatting
      const numericMatch = originalText.match(/\d+/);
      if (!numericMatch) return null;
      
      let targetValue = parseInt(numericMatch[0]);
      
      // Handle K, M multipliers
      if (originalText.includes('K')) targetValue *= 1000;
      if (originalText.includes('M')) targetValue *= 1000000;
      
      return {
        target: targetValue,
        prefix: originalText.substring(0, numericMatch.index),
        suffix: originalText.substring(numericMatch.index + numericMatch[0].length)
      };
    }

    function animateNumber(element, numberData, duration = 2000) {
      const start = 0;
      const startTime = performance.now();
      
      function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation (ease-out)
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + (numberData.target - start) * easeOutQuart);
        
        element.textContent = numberData.prefix + current.toLocaleString() + numberData.suffix;
        
        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        } else {
          // Ensure we end with the exact original text
          element.textContent = element.dataset.original;
        }
      }
      
      requestAnimationFrame(updateNumber);
    }

    const statsObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const statElement = entry.target;
          const originalText = statElement.dataset.original;
          const numberData = parseNumberAndFormat(originalText);
          
          if (numberData) {
            animateNumber(statElement, numberData);
          }
          
          obs.unobserve(statElement); // prevent it from triggering again
        }
      });
    }, {
      threshold: 0.5 // element must be at least 50% in view
    });

    statNumbers.forEach(stat => {
      statsObserver.observe(stat);
    });
  });

