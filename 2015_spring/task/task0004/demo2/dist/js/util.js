define(function(){function n(n){return"[object Array]"===Object.prototype.toString.call(n)}function t(n,t){var e=n.className;if(!e)return!1;for(var r=e.split(/\s+/),a=0;a<r.length;a++)if(r[a]===t)return!0;return!1}function e(n,t,e){n.addEventListener?n.addEventListener(t,e,!1):n.attachEvent&&n.attachEvent("on"+t,e)}function r(n,t,e){n.removeEventListener?n.removeEventListener(t,e,!1):n.detachEvent&&n.detachEvent("on"+t,e)}function a(n,t){e(n,"click",t)}function c(n,t){r(n,"click",t)}return{hasClass:t,removeClass:function(n,e){if(e&&t(n,e)){for(var r=n.className.split(/\s+/),a=0;a<r.length;a++)r[a]===e&&r.splice(a,1);n.className=r.join(" ")}},addClass:function(n,e){t(n,e)||(n.className?n.className=[n.className,e].join(" "):n.className=e)},click:function(n,t){a(n,t)},unclick:function(n,t){c(n,t)},uniqArray1:function(t){var e,r=[],a={};if(!n(t))return t;if(1===(e=t.length))return t;for(var c=0;c<e;c++)a[t[c]]||(a[t[c]]=!0,r.push(t[c]));return r}}});
//# sourceMappingURL=util.js.map