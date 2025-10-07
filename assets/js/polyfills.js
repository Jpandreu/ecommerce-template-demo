/**
 * Cross-browser polyfills and compatibility fixes
 * Ensures template works on Chrome, Firefox, Safari, Opera, and Edge
 */

// Polyfill for scroll behavior (older browsers)
(function() {
    'use strict';
    
    // Check if smooth scrolling is supported
    if (!('scrollBehavior' in document.documentElement.style)) {
        // Add polyfill for smooth scrolling
        var smoothScrollPolyfill = function(targetY, duration) {
            var startY = window.pageYOffset;
            var difference = targetY - startY;
            var startTime = performance.now();
            
            function step() {
                var progress = (performance.now() - startTime) / duration;
                progress = Math.min(progress, 1);
                
                // Easing function
                var ease = progress < 0.5 
                    ? 2 * progress * progress 
                    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
                
                window.scrollTo(0, startY + (difference * ease));
                
                if (progress < 1) {
                    requestAnimationFrame(step);
                }
            }
            
            requestAnimationFrame(step);
        };
        
        // Override anchor link behavior
        document.addEventListener('click', function(e) {
            var link = e.target.closest('a[href^="#"]');
            if (link && link.getAttribute('href') !== '#') {
                e.preventDefault();
                var target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    var targetY = target.offsetTop - 80; // Account for fixed header
                    smoothScrollPolyfill(targetY, 800);
                }
            }
        });
    }
})();

// Polyfill for CSS.supports (IE/older browsers)
if (!window.CSS || !CSS.supports) {
    window.CSS = window.CSS || {};
    CSS.supports = function(property, value) {
        var el = document.createElement('div');
        try {
            el.style[property] = value;
            return el.style[property] === value;
        } catch (e) {
            return false;
        }
    };
}

// Polyfill for Object.assign (IE)
if (typeof Object.assign !== 'function') {
    Object.assign = function(target) {
        'use strict';
        if (target == null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }
        
        var to = Object(target);
        
        for (var index = 1; index < arguments.length; index++) {
            var nextSource = arguments[index];
            
            if (nextSource != null) {
                for (var nextKey in nextSource) {
                    if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
        }
        return to;
    };
}

// Polyfill for Array.from (IE)
if (!Array.from) {
    Array.from = function(arrayLike) {
        var items = [];
        for (var i = 0; i < arrayLike.length; i++) {
            items.push(arrayLike[i]);
        }
        return items;
    };
}

// Polyfill for Element.closest (IE)
if (!Element.prototype.closest) {
    Element.prototype.closest = function(selector) {
        var el = this;
        while (el && el.nodeType === 1) {
            if (el.matches && el.matches(selector)) {
                return el;
            }
            el = el.parentNode;
        }
        return null;
    };
}

// Polyfill for Element.matches (IE)
if (!Element.prototype.matches) {
    Element.prototype.matches = 
        Element.prototype.matchesSelector || 
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector || 
        Element.prototype.oMatchesSelector || 
        Element.prototype.webkitMatchesSelector ||
        function(s) {
            var matches = (this.document || this.ownerDocument).querySelectorAll(s);
            var i = matches.length;
            while (--i >= 0 && matches.item(i) !== this) {}
            return i > -1;
        };
}

// Fix for Safari's handling of vh units
(function() {
    function setVH() {
        var vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', vh + 'px');
    }
    
    setVH();
    window.addEventListener('resize', setVH);
})();

// Cross-browser event listener helper
window.addEventListenerSafe = function(element, event, callback, options) {
    if (element.addEventListener) {
        element.addEventListener(event, callback, options || false);
    } else if (element.attachEvent) {
        element.attachEvent('on' + event, callback);
    }
};

// Console polyfill for IE
if (!window.console) {
    window.console = {
        log: function() {},
        error: function() {},
        warn: function() {},
        info: function() {}
    };
}

// Performance.now polyfill
if (!window.performance || !window.performance.now) {
    window.performance = window.performance || {};
    window.performance.now = function() {
        return Date.now();
    };
}

// RequestAnimationFrame polyfill
(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || 
                                     window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
})();

// CSS Grid fallback detection
(function() {
    if (!CSS.supports('display', 'grid')) {
        document.documentElement.classList.add('no-css-grid');
        
        // Add fallback styles for grid layouts
        var fallbackStyles = `
            .no-css-grid .featured-grid,
            .no-css-grid .services-grid,
            .no-css-grid .testimonials-grid {
                display: flex;
                flex-wrap: wrap;
                gap: 1rem;
            }
            
            .no-css-grid .featured-grid > *,
            .no-css-grid .services-grid > *,
            .no-css-grid .testimonials-grid > * {
                flex: 1 1 calc(33.333% - 1rem);
                min-width: 280px;
            }
            
            @media (max-width: 768px) {
                .no-css-grid .featured-grid > *,
                .no-css-grid .services-grid > *,
                .no-css-grid .testimonials-grid > * {
                    flex: 1 1 100%;
                }
            }
        `;
        
        var style = document.createElement('style');
        style.textContent = fallbackStyles;
        document.head.appendChild(style);
    }
})();

console.log('✅ Cross-browser polyfills loaded successfully');