(() => {
    "use strict";
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(webP.height == 2);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = support === true ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let bodyLockStatus = true;
    let bodyLockToggle = (delay = 500) => {
        if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
    };
    let bodyUnlock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                for (let index = 0; index < lock_padding.length; index++) {
                    const el = lock_padding[index];
                    el.style.paddingRight = "0px";
                }
                body.style.paddingRight = "0px";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            for (let index = 0; index < lock_padding.length; index++) {
                const el = lock_padding[index];
                el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            }
            body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function menuInit() {
        if (document.querySelector(".icon-menu")) document.addEventListener("click", (function(e) {
            if (bodyLockStatus && e.target.closest(".icon-menu")) {
                bodyLockToggle();
                document.documentElement.classList.toggle("menu-open");
            }
        }));
    }
    function DynamicAdapt(type) {
        this.type = type;
    }
    DynamicAdapt.prototype.init = function() {
        const _this = this;
        this.оbjects = [];
        this.daClassname = "_dynamic_adapt_";
        this.nodes = document.querySelectorAll("[data-da]");
        for (let i = 0; i < this.nodes.length; i++) {
            const node = this.nodes[i];
            const data = node.dataset.da.trim();
            const dataArray = data.split(",");
            const оbject = {};
            оbject.element = node;
            оbject.parent = node.parentNode;
            оbject.destination = document.querySelector(dataArray[0].trim());
            оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
            оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
            оbject.index = this.indexInParent(оbject.parent, оbject.element);
            this.оbjects.push(оbject);
        }
        this.arraySort(this.оbjects);
        this.mediaQueries = Array.prototype.map.call(this.оbjects, (function(item) {
            return "(" + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
        }), this);
        this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, (function(item, index, self) {
            return Array.prototype.indexOf.call(self, item) === index;
        }));
        for (let i = 0; i < this.mediaQueries.length; i++) {
            const media = this.mediaQueries[i];
            const mediaSplit = String.prototype.split.call(media, ",");
            const matchMedia = window.matchMedia(mediaSplit[0]);
            const mediaBreakpoint = mediaSplit[1];
            const оbjectsFilter = Array.prototype.filter.call(this.оbjects, (function(item) {
                return item.breakpoint === mediaBreakpoint;
            }));
            matchMedia.addListener((function() {
                _this.mediaHandler(matchMedia, оbjectsFilter);
            }));
            this.mediaHandler(matchMedia, оbjectsFilter);
        }
    };
    DynamicAdapt.prototype.mediaHandler = function(matchMedia, оbjects) {
        if (matchMedia.matches) for (let i = 0; i < оbjects.length; i++) {
            const оbject = оbjects[i];
            оbject.index = this.indexInParent(оbject.parent, оbject.element);
            this.moveTo(оbject.place, оbject.element, оbject.destination);
        } else for (let i = оbjects.length - 1; i >= 0; i--) {
            const оbject = оbjects[i];
            if (оbject.element.classList.contains(this.daClassname)) this.moveBack(оbject.parent, оbject.element, оbject.index);
        }
    };
    DynamicAdapt.prototype.moveTo = function(place, element, destination) {
        element.classList.add(this.daClassname);
        if (place === "last" || place >= destination.children.length) {
            destination.insertAdjacentElement("beforeend", element);
            return;
        }
        if (place === "first") {
            destination.insertAdjacentElement("afterbegin", element);
            return;
        }
        destination.children[place].insertAdjacentElement("beforebegin", element);
    };
    DynamicAdapt.prototype.moveBack = function(parent, element, index) {
        element.classList.remove(this.daClassname);
        if (parent.children[index] !== void 0) parent.children[index].insertAdjacentElement("beforebegin", element); else parent.insertAdjacentElement("beforeend", element);
    };
    DynamicAdapt.prototype.indexInParent = function(parent, element) {
        const array = Array.prototype.slice.call(parent.children);
        return Array.prototype.indexOf.call(array, element);
    };
    DynamicAdapt.prototype.arraySort = function(arr) {
        if (this.type === "min") Array.prototype.sort.call(arr, (function(a, b) {
            if (a.breakpoint === b.breakpoint) {
                if (a.place === b.place) return 0;
                if (a.place === "first" || b.place === "last") return -1;
                if (a.place === "last" || b.place === "first") return 1;
                return a.place - b.place;
            }
            return a.breakpoint - b.breakpoint;
        })); else {
            Array.prototype.sort.call(arr, (function(a, b) {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) return 0;
                    if (a.place === "first" || b.place === "last") return 1;
                    if (a.place === "last" || b.place === "first") return -1;
                    return b.place - a.place;
                }
                return b.breakpoint - a.breakpoint;
            }));
            return;
        }
    };
    const da = new DynamicAdapt("max");
    da.init();
    document.addEventListener("DOMContentLoaded", (() => {
        document.addEventListener("click", documentActions);
        function documentActions(e) {
            const targetEl = e.target;
            if (targetEl.closest(".icon-close")) {
                _removeClasses(document.querySelectorAll(".menu-open"), "menu-open");
                _removeClasses(document.querySelectorAll(".lock"), "lock");
            }
            window.addEventListener("resize", (function() {
                if (window.innerWidth > 991.98) {
                    _removeClasses(document.querySelectorAll(".header__menu._open"), "_open");
                    _removeClasses(document.querySelectorAll(".menu-open"), "menu-open");
                    _removeClasses(document.querySelectorAll(".lock"), "lock");
                }
            }));
        }
        const triggerElement = document.querySelector(".action__cart");
        const hiddenElement = document.querySelector(".cart__body");
        triggerElement.addEventListener("mouseover", (function() {
            hiddenElement.style.display = "flex";
        }));
        triggerElement.addEventListener("mouseout", (function() {
            hiddenElement.style.display = "none";
        }));
        new Swiper(".categories-slider__swiper", {
            slidesPerView: 2,
            spaceBetween: 10,
            navigation: {
                nextEl: ".categories-slider__navigation"
            },
            pagination: {
                el: ".swiper-pagination"
            },
            autoHeight: false,
            grid: {
                rows: 2
            },
            loop: true,
            breakpoints: {
                768: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                    grid: {
                        rows: 2
                    }
                },
                1570: {
                    slidesPerView: 4,
                    spaceBetween: 20,
                    grid: {
                        rows: 1
                    }
                }
            }
        });
        new Swiper(".slider-main__swiper", {
            slidesPerView: 2,
            spaceBetween: 9,
            loop: true,
            navigation: {
                nextEl: ".slider-main__navigation"
            },
            breakpoints: {
                1024: {
                    slidesPerView: 2,
                    spaceBetween: 20
                },
                1140: {
                    slidesPerView: 1,
                    spaceBetween: 20
                },
                1520: {
                    slidesPerView: 2,
                    spaceBetween: 20
                }
            }
        });
        new Swiper(".discounts__swiper", {
            slidesPerView: 2,
            spaceBetween: 9,
            loop: true,
            grid: {
                rows: 2
            },
            navigation: {
                nextEl: ".discounts__navigation"
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                    grid: {
                        rows: 2
                    }
                },
                1570: {
                    slidesPerView: 4,
                    spaceBetween: 20,
                    grid: {
                        rows: 1
                    }
                }
            }
        });
    }));
    var myForm = document.getElementById("myForm");
    myForm.addEventListener("submit", (function(e) {
        const phoneInput = document.getElementById("phoneInput").value;
        const phonePattern = /^[+]?[0-9]{1,3}?[-. (]?[0-9]{3}[-. )]?[0-9]{3}[-. ]?[0-9]{4}$/;
        if (phonePattern.test(phoneInput)) alert("Номер телефона введен верно, форма отправлена"); else {
            document.getElementById("phoneValidationMessage").innerText = "Пожалуйста, введите корректный номер телефона";
            e.preventDefault();
        }
    }));
    function _removeClasses(el, class_name) {
        for (let i = 0; i < el.length; i++) el[i].classList.remove(class_name);
    }
    window["FLS"] = true;
    isWebp();
    menuInit();
})();