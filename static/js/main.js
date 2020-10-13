// !function(e){"function"!=typeof e.matches&&(e.matches=e.msMatchesSelector||e.mozMatchesSelector||e.webkitMatchesSelector||function(e){for(var t=this,o=(t.document||t.ownerDocument).querySelectorAll(e),n=0;o[n]&&o[n]!==t;)++n;return Boolean(o[n])}),"function"!=typeof e.closest&&(e.closest=function(e){for(var t=this;t&&1===t.nodeType;){if(t.matches(e))return t;t=t.parentNode}return null})}(window.Element.prototype);


// document.addEventListener('DOMContentLoaded', function() {
//    var modalButtons = document.querySelectorAll('.js-open-modal'),
//        overlay      = document.querySelector('.js-overlay-modal'),
//        closeButtons = document.querySelectorAll('.js-modal-close');

//    modalButtons.forEach(function(item){
//       item.addEventListener('click', function(e) {
//          e.preventDefault();

//          /* При каждом клике на кнопку мы будем забирать содержимое атрибута data-modal
//             и будем искать модальное окно с таким же атрибутом. */
//          var modalId = this.getAttribute('data-modal'),
//              modalElem = document.querySelector('.modal[data-modal="' + modalId + '"]');


//          /* После того как нашли нужное модальное окно, добавим классы
//             подложке и окну чтобы показать их. */
//          modalElem.parentElement.classList.add('active');
//          modalElem.classList.add('animate__animated','animate__zoomInUp');
//          overlay.classList.add('active');
//       }); 

//    }); 


//    closeButtons.forEach(function(item){
//         item.addEventListener('click', function(e) {
//          var parentModal = this.closest('.modal');
//          parentModal.classList.remove('active','animate__animated','animate__zoomInUp');
//          overlay.classList.remove('active','animate__animated','animate__zoomInUp');
//       });

//    });


//     document.body.addEventListener('keyup', function (e) {
//         var key = e.keyCode;
//         if (key == 27) {

//         document.querySelector('.modal.active').classList.remove('active','animate__animated','animate__zoomInUp');
//         document.querySelector('.overlay').classList.remove('active');
//         };
//     }, false);


//     overlay.addEventListener('click', function() {
//         document.querySelector('.modal__wrapper').classList.remove('active');
//         document.querySelector('.modal').classList.remove('animate__animated','animate__zoomInUp');
//         this.classList.remove('active');
//     });




// });

let windowWidth = window.innerWidth;


/* ---------------------------- GLOBAL FUNCTIONS ---------------------------- */

$.fn.forceNumericOnly = function() {
    return this.each(function() {
        $(this).keydown(function(e) {
            let key = e.charCode || e.keyCode || 0;
            return (
                key == 8 ||
                key == 9 ||
                key == 46 ||
                (key >= 37 && key <= 40) ||
                (key >= 48 && key <= 57) ||
                (key >= 96 && key <= 105)
            );
        });
    });
};


/* ------------------------------- SITE UTILS ------------------------------- */

let util = {};

util.init = function() {
    // $('[name*="phone"]').mask('9 (999) 999-99-99');
    // $('[name*="time"]').mask('с 99:90 по 99:90');
};

util.scrollTo = function(element, offset = 0, padding = 0, contentOffset = 0) {
    let to, handle, handleScroll;
    if (element.attr('href') !== undefined) {
        to = element.attr('href');
    } else {
        if (element.attr('data-href') !== undefined) {
            to = element.attr('data-href');
        } else {
            return false;
        }
    }
    if (element.attr('data-handle') !== undefined) {
        handle = handleScroll = $(element.attr('data-handle'));
    } else {
        handle = $('body');
        handleScroll = $('html, body');
    }
    if (element.attr('data-offset') !== undefined) {
        offset = parseInt(element.attr('data-offset'));
    }
    if (element.attr('data-content') !== undefined) {
        contentOffset = $(element.attr('data-content')).offset().top;
    }
    padding = parseInt(handle.find(to).css('padding-top'));
    if (handle.find(to).length) {
        to = handle.find(to);
        handleScroll.animate({scrollTop: to.offset().top - contentOffset - padding + offset}, 'slow');
    }
    return false;
};

util.getUrlParameters = function(getParams) {
    let urlVariables = getParams.split('&'),
        parameters,
        i;
    for (i = 0; i < urlVariables.length; i++) {
        parameters = urlVariables[i].split('=');
    }
    return parameters;
};

util.parseGetParameters = function() {
    let result = {};
    let gets = window.location.search.replace(/&amp;/g, '&').substring(1).split('&');
    for (let i = 0; i < gets.length; i++) {
        let get = gets[i].split('=');
        result[get[0]] = typeof(get[1]) == 'undefined' ? '' : get[1];
    }
    return result;
};

util.initFancybox = function(handle = 'body'){
    let autoStart = (windowWidth > 768) ? true : false;
    $(handle).find('[data-fancybox]').fancybox({
        thumbs : {
            autoStart : autoStart
        },
        buttons: [
            "zoom",
            // "share",
            //"slideShow",
            //"fullScreen",
            //"download",
            "thumbs",
            "close"
        ],
        loop: true,
        arrows: true,
        animationEffect: "zoom",
        transitionEffect: "zoom-in-out",
        lang: "ru",
        i18n: {
            ru: {
                CLOSE: "Закрыть",
                NEXT: "Следующая",
                PREV: "Предыдущая",
                ERROR: "Запрошенный контент не может быть загружен.<br/>Повторите попытку позже.",
                PLAY_START: "Начать слайдшоу",
                PLAY_STOP: "Остановить слайдшоу",
                FULL_SCREEN: "Полный экран",
                THUMBS: "Миниатюры",
                DOWNLOAD: "Загрузить",
                SHARE: "Поделиться",
                ZOOM: "Увеличить"
            }
        }
    });
};

util.ajaxForm = function(form) {
    let button = form.find('[type=submit]'),
        answer = form.parent().find('.form-answer'),
        errorClass = '_error';
    form.ajaxSubmit({
        url: form.attr('action'),
        method: 'POST',
        dataType: 'json',
        beforeSubmit: function(){
            button.prop('disabled', true);
            button.addClass('_load');
        },
        complete: function(result){
            if (result.responseJSON === undefined && form.data('success') !== undefined) {
                answer.removeClass(errorClass);
                answer.html(form.data('success'));
                clearForm(form);
            } else if(result.responseJSON === undefined && form.data('popup-success') !== undefined) {
                $('.overlay').fadeIn();
                form.trigger('clear').closest('.popup').removeClass('open');
                $('.' + form.data('popup-success')).addClass('open');
                clearForm(form);
            } else {
                let response = result.responseJSON;
                if (response.success) {
                    if (response.redirect !== undefined) {
                        answer.slideUp(300);
                        document.location.href = response.redirect;
                    } else if (response.popup !== undefined) {
                        $('.overlay').fadeIn();
                        $('.' + form.data('popup-success')).addClass('open');
                    } else {
                        answer.removeClass(errorClass);
                        answer.html(response.message);
                        if (response.hideform !== undefined) {
                            form.slideUp(300);
                        }
                    }
                    clearForm(form);
                } else {
                    answer.addClass(errorClass);
                    answer.html(response.message);
                }
            }
            answer.slideDown(300);
            button.prop('disabled', false);
            button.removeClass('_load');
        }
    });
    return false;
};


$(document).ready(function(){

    util.init();
    // util.initFancybox();

    $(document).on('click', '.js-scroll', function(){
        return util.scrollTo($(this));
    });

    $('.js-form').on('submit', function(){
        return util.ajaxForm($(this));
    });

});


/* ---------------------------------- POPUP --------------------------------- */

var popup = {};

popup.class = {
	overlay: '.popup-overlay',
	show: '_show'
};

popup.getScrollbarWidth = function() {
	if ($(document).height() <= $(window).height()) {
		return 0;
	}
	
	var outer = document.createElement('div');
	var inner = document.createElement('div');
	var widthNoScroll;
	var widthWithScroll;
	
	outer.style.visibility = 'hidden';
	outer.style.width = '100px';
	document.body.appendChild(outer);
	widthNoScroll = outer.offsetWidth;
	outer.style.overflow = 'scroll';
	inner.style.width = '100%';
	outer.appendChild(inner);
	widthWithScroll = inner.offsetWidth;
	outer.parentNode.removeChild(outer);
	
	return widthNoScroll - widthWithScroll;
};

popup.lockScreen = function() {	
	var html = $('html');
	var lockedClass = 'is-locked';
	var paddingRight;
	var body;
	
	if (!html.hasClass(lockedClass)) {
		body = $(document.body);
		paddingRight = parseInt(body.css('padding-right'), 10) + popup.getScrollbarWidth();
		body.css('padding-right', paddingRight + 'px');
		html.addClass(lockedClass);
	}
};

popup.unlockScreen = function() {
	var html = $('html');
	var lockedClass = 'is-locked';
	var paddingRight;
	var body;
	
	if (html.hasClass(lockedClass)) {
		body = $(document.body);
		paddingRight = parseInt(body.css('padding-right'), 10) - popup.getScrollbarWidth();
		body.css('padding-right', paddingRight + 'px');
		html.removeClass(lockedClass);
	}
};

popup.show = function(id) {
	var current = $('[data-popup-id="' + id + '"]');
	
	if (!current.hasClass(popup.class.show)) {
		popup.lockScreen();

		$('[data-popup-id]').removeClass(popup.class.show);
		$(popup.class.overlay).fadeIn(300);
		
		setTimeout(function(){
			current.addClass(popup.class.show);
		}, 200);
	}
};

popup.hide = function(id) {
	$('[data-popup-id="' + id + '"]').removeClass(popup.class.show);
	$(popup.class.overlay).fadeOut(200);
	popup.unlockScreen();
};

$(document).ready(function() {

	$(document).on('click', '[data-popup-target]', function() {
		popup.show($(this).data('popup-target'));
		return false;
	});

	$(document).on('click', '[data-popup-close]', function(e) {
        popup.hide($('.popup.' + popup.class.show).data('popup-id'));
		return false;
	});

	$(document).on('click', popup.class.overlay, function(e) {
        popup.hide($('.popup.' + popup.class.show).data('popup-id'));
		return false;
	});

});