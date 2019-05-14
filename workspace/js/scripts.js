/*
Memory Game - Code by Zsolt Király
v1.0.3 - 2018-06-27
*/

'use strict';
var memoryGameLogic = function() {

    function signatura() {
        if (window['console']) {
            const text = {
                black: '%c     ',
                blue: '%c   ',
                author: '%c  Zsolt Király  ',
                github: '%c  https://zsoltkiraly.com/'
            }
    
            const style = {
                black: 'background: #282c34',
                blue: 'background: #61dafb',
                author: 'background: black; color: white',
                github: ''
            }
    
            console.log(text.black + text.blue + text.author + text.github, style.black, style.blue, style.author, style.github);
        }
    }
    
    signatura();

    function createRandomPlayground(pG, cParam, dC) {

        pG.classList.add('' + dC + '');

        var a = [],
            i = 0;
        for (; i < cParam.cardNumber; ++i) {
            a[i] = i;
        }

        function shuffle(array) {
            var tmp,
                current,
                top = array.length;

            if (top) {
                while (--top) {
                    current = Math.floor(Math.random() * (top + 1));
                    tmp = array[current];
                    array[current] = array[top];
                    array[top] = tmp;
                }
            }

            return array;
        }

        var randomArray = shuffle(a);

        var a = [],
            k = 0;
        for (; k < randomArray.length; ++k) {
            var random = randomArray[k];

            var table = document.createElement('DIV');
            table.setAttribute('class', 'cards');
            table.setAttribute('data-id', random + 1);

            pG.appendChild(table);
        }

        var cards = document.querySelectorAll('.play-ground .row .cards');

        var c = 0,
            lenC = cards.length;
        for(; c < lenC; c++) {
            var card = cards[c];

            var cardId = card.getAttribute('data-id');

            if(cardId > cParam.cardNumber / 2) {
                var getId = parseInt(card.getAttribute('data-id')) - cParam.cardNumber / 2;

                card.setAttribute('data-id', getId);
            }
        }
    }

    function clickDisabled() {
        var row = document.querySelector('.play-ground .row');

        row.classList.add('disabled');

        setTimeout(function() {
            row.classList.remove('disabled');
        }, 600);
    }

    function createImages(c) {
        c.forEach((card)=> {
            var dataId = card.getAttribute('data-id');

            card.innerHTML = '<div class="hide"></div><img src="images/' + dataId + '.jpg">';
        });
    }

    var sum = 0;

    function summa() {
        sum += 1;

        return sum;
    }

    function click(c, cParam) {

        c.forEach((card)=> {

            var hide = card.querySelector('.hide');

            hide.addEventListener('click', function(e) {
                var obj = this;

                var finish = document.querySelector('.play-ground .finish');

                if(obj.parentElement.classList.contains('active') || obj.parentElement.classList.contains('open')) {
                    e.preventDefault();

                } else {
                    finish.setAttribute('data-click', summa());
                }

                c.forEach(()=> {

                    obj.parentElement.classList.add('open');

                    var open = document.querySelectorAll('.play-ground .row .cards.open');

                    if (open.length == 2) {

                        clickDisabled();

                        open.forEach((openCard)=> {

                            if (obj.parentElement != openCard) {
                                var other = openCard;
                            }

                            if (other != undefined || other != null) {
                                if (obj.parentElement.getAttribute('data-id') != other.getAttribute('data-id')) {

                                    setTimeout(function() {
                                        obj.parentElement.classList.remove('open');
                                        other.classList.remove('open');
                                    }, 500);

                                } else {

                                    var open = document.querySelectorAll('.play-ground .row .cards.open');
                                    open.forEach(()=> {

                                        setTimeout(function() {
                                            obj.parentElement.classList.remove('open');
                                            other.classList.remove('open');
                                            obj.parentElement.classList.add('active');
                                            other.classList.add('active');
                                        }, 50);
                                    });
                                }
                            }
                        });

                        var activeAlls = document.querySelectorAll('.play-ground .row .cards.active');

                        if(activeAlls.length == cParam.cardNumber - 2) {
                            
                            var finish = document.querySelector('.play-ground .finish');

                            var getClick = finish.getAttribute('data-click');

                            if(getClick <= (cParam.cardNumber * 2)) {
                                var message = "Excellent! It's in your blood the game!";

                            } else if(getClick > (cParam.cardNumber * 2) && getClick <= (cParam.cardNumber * 3)) {
                                var message = "Not bad, but not good!";

                            } else if(getClick > (cParam.cardNumber * 3) && getClick <= (cParam.cardNumber * 4)) {
                                var message = "Poor performance, try again!";

                            } else if(getClick > (cParam.cardNumber *4)) {
                                var message = "Very bad, try again!";
                            }

                            setTimeout(function() {

                                finish.classList.add('active');
                                finish.innerHTML = '<h2>Number of clicks: ' + '<span class="click">' + getClick + '</span><span class="message">' + message + '</h2>';
                            
                            }, 500);
                        }
                    }
                });
            }, false);
        });
    }

    function app(dataId, dataCard) {

        var config = {
            cardNumber: dataId,
        };

        var playGround = document.querySelector('.play-ground'),
            playGroundRow = playGround.querySelector('.play-ground .row');

        createRandomPlayground(playGroundRow, config, dataCard);

        var cards = document.querySelectorAll('.play-ground .row .cards');
        createImages(cards);

        var hides = document.querySelectorAll('.play-ground .row .cards .hide');
        click(cards, config);
    };

    return {
        app: app
    }

}();


var memoryGameArea = function() {

    function selectArea() {
        var areas = document.querySelectorAll('ul li');

        areas.forEach((area)=> {

            area.addEventListener('click', function() {
                var obj = this;


                areas.forEach((area)=> {

                    if(obj == area) {
                        area.classList.add('select');
                        
                    } else {
                        area.classList.remove('select');
                    }

                });

            }, false);

        });
    }

    function areaSelect() {
        var playGround = document.querySelector('.play-ground'),
            properties = document.querySelector('.properties'),
            loadingMask = playGround.querySelector('.loading-mask'),
            areaSelect = properties.querySelector('ul.area li.select'),
            alert = properties.querySelector('.alert');

        if(areaSelect) {

            var dataId = areaSelect.getAttribute('data-id');
            var dataCard = areaSelect.getAttribute('data-card');

            memoryGameLogic.app(dataId, dataCard);
            alert.innerHTML = '';

            properties.classList.add('hide');
            playGround.classList.add('show');

            setTimeout(function() {
                loadingMask.classList.add('op-zero');
            }, 50);

            setTimeout(function() {
                loadingMask.classList.add('hide');
            }, 1050)

        } else {
            alert.classList.add('show');

            setTimeout(function() {
                alert.classList.add('op-one');
            }, 50);

            alert.innerHTML = '<span>Choose game area!</span>';

            setTimeout(function() {
                alert.classList.remove('op-one');
                setTimeout(function() {
                    alert.classList.remove('show');
                }, 1000);
            }, 3000);

        }
    }

    function app() {
        selectArea();
    };

    return {
        app: app,
        areaSelect:areaSelect
    }

}();

window.addEventListener('load', function() {
    memoryGameArea.app();
    var start = document.querySelector('.start');

    start.addEventListener('click', function() {
        memoryGameArea.areaSelect();
    }, false);
}, false);