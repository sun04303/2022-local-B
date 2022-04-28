let nameReg = /([가-힣A-Z]){2,50}/gi

if(location.pathname.includes('sub3')) {
    let photoNum = 1
    let rating = 0

    $('.write-btn').on('click', e => {
        $('#write').modal('show')

        $('#name').val('')
        $('#goods').val('')
        $('#place').val('')
        $('#date').val('')
        $('#content').val('')

        rating = 0
        document.querySelectorAll('.rate-box input').forEach(item => {
            item.checked = false
        })

        document.querySelector('#rating0').checked = true

        document.querySelectorAll('.photo-node').forEach(item => {
            item.remove()
        })

        let input = `<div class="mb-3 photo-node">
                        <label for="photo" class="form-label">사진</label>
                        <input type="file" name="photo" id="photo" class="form-control" accept=".jpg">
                    </div>`
        document.querySelector('form').insertBefore(makeElem(input), document.querySelector('.photo-add'))
    })

    $('#write .cl').on('click', () => {
        $('#write').modal('hide')
    })

    $('.photo-add').on('click', e => {
        e.preventDefault()
        let input = `<div class="mb-3 photo-node">
                        <label for="photo${photoNum}" class="form-label">사진</label>
                        <input type="file" name="photo" id="photo${photoNum}" class="form-control" accept=".jpg">
                    </div>`
        document.querySelector('form').insertBefore(makeElem(input), e.target)
        photoNum++
    })

    $('#content').on('keyup', e => {
        $('.str-count').html(`${e.target.value.length}자`)
    })

    document.querySelectorAll('.rate-box input').forEach(item => {
        item.addEventListener('click', e => {
            rating = e.target.value
        })
    })

    $('.chk').on('click', e => {
        let imgList = []
        let jpg = 0

        document.querySelectorAll('input[type="file"]').forEach(item => {
            if (item.files.length) {
                imgList.push(item.files)
                if(item.value.slice(item.value.lastIndexOf(".") + 1).toLowerCase() == 'jpg') jpg++
            }
        })

        let nameChk = nameReg.test($('#name').val())

        if (!$('#name').val() || !$('#goods').val() || !$('#place').val() || !$('#date').val() || !$('#content').val() || !imgList.length) {
            alert('모든 내용을 입력해주세요.')
        } else if (!nameChk) {
            alert('이름은 2자 이상, 50자 이하, 한글 및 영어만 사용할 수 있습니다.')
        } else if ($('#content').val().length < 100) {
            alert('내용은 100자 이상 작성해야합니다.')
        } else if(imgList.length != jpg) {
            alert('파일은 jpg 형식만 업로드 할 수 있습니다.')
        } else {
            let data = {
                name: $('#name').val(),
                goods: $('#goods').val(),
                place: $('#place').val(),
                date: $('#date').val(),
                content: $('#content').val(),
            }
            
            $('#write').modal('hide')
            alert('구매 후기가 등록되었습니다.')
        }
    })
} else if (location.pathname.includes("sub2")) {
    const AREA_LIST = [
        { name: '창원시', img: './resource/img/special/창원시_풋고추.jpg' },
        { name: '진주시', img: './resource/img/special/진주시_고추.jpg' },
        { name: '통영시', img: './resource/img/special/통영시_굴.jpg' },
        { name: '사천시', img: './resource/img/special/사천시_멸치.jpg' },
        { name: '김해시', img: './resource/img/special/김해시_단감.jpg' },
        { name: '밀양시', img: './resource/img/special/밀양시_대추.jpg' },
        { name: '거제시', img: './resource/img/special/거제시_유자.jpg' },
        { name: '양산시', img: './resource/img/special/양산시_매실.jpg' },
        { name: '의령군', img: './resource/img/special/의령군_수박.jpg' },
        { name: '함안군', img: './resource/img/special/함안군_곶감.jpg' },
        { name: '창녕군', img: './resource/img/special/창녕군_양파.jpg' },
        { name: '고성군', img: './resource/img/special/고성군_방울토마토.jpg' },
        { name: '남해군', img: './resource/img/special/남해군_마늘.jpg' },
        { name: '하동군', img: './resource/img/special/하동군_녹차.jpg' },
        { name: '산청군', img: './resource/img/special/산청군_약초.jpg' },
        { name: '함양군', img: './resource/img/special/함양군_밤.jpg' },
        { name: '거창군', img: './resource/img/special/거창군_사과.jpg' },
        { name: '합천군', img: './resource/img/special/합천군_돼지고기.jpg' },
    ]

    let showTimeout
    let animationTimeout
    let gameStatus = 'ready'
    let matchCount = 0
    let time = 90
    let cardList = []

    let count = document.querySelector('.cnt')
    let timer = document.querySelector('.time')

    window.onload = () => {
        initCard()
        initTimer()
        initEvent()
        render()
    }

    function initCard() {
        $('.board').html('')

        cardList = new Array(16).fill(1).map(v => ({
            elem: makeElem(
                `<div class="board-item">
                    <div class="back">
                        <img src="./resource/img/slogan.png" alt="뒷면">
                    </div>
                    <div class="front">
                        <img src="" alt="앞면">
                    </div>
                </div>`
            ),
            match: false,
            area: null,
            selected: false
        }))

        let listElem = document.querySelector('.board')
        cardList.forEach(item => {
            listElem.append(item.elem)
        })
    }

    function initTimer() {
        setInterval(() => {
            if (gameStatus == 'playing' && time > 0) {
                time--

                chkGameEnd()
            }
        }, 1000)
    }

    function initEvent() {
        document.querySelector('.btn-start').addEventListener('click', gameStart)
        document.querySelector('.btn-hint').addEventListener('click', showHint)

        cardList.forEach(card => {
            card.elem.addEventListener('click', () => {
                if (gameStatus != 'playing' || animationTimeout || card.match || card.selected)
                    return

                card.selected = true

                let selectedList = cardList.filter(card => card.selected)
                if (selectedList.length < 2) {
                    showTimeout = setTimeout(() => {
                        card.selected = false
                    }, 3000)
                    return
                }

                clearTimeout(showTimeout)
                animationTimeout = setTimeout(() => {
                    animationTimeout = null
                    let matchs = selectedList[0].area.name == selectedList[1].area.name

                    selectedList.forEach(card => {
                        card.match = matchs
                        card.selected = false
                    })

                    if (matchs) {
                        matchCount++
                        let areaname = makeElem(`<div class="area-name">${selectedList[0].area.name}</div>`)
                        selectedList[0].elem.appendChild(areaname)
                        areaname = makeElem(`<div class="area-name">${selectedList[1].area.name}</div>`)
                        selectedList[1].elem.appendChild(areaname)
                    }

                    chkGameEnd()
                }, 1000)
            })
        })

        $('#phone').on('input', e => {
            let str = e.target.value.replace(/[^0-9]/g, '')
            let arr = [
                str.substr(0, 3),
                str.substr(3, 4),
                str.substr(7, 4),
            ]

            e.target.value = arr.filter(v => v.length > 0).join('-')
        })

        document.querySelector('.chk').addEventListener('click', e => {
            let nameChk = nameReg.test($('#name').val())

            if(!$('#name').val() || !$('#phone').val()) {
                alert('모든 정보를 입력해주세요.')
            } else if (!nameChk) {
                alert('이름은 2자 이상, 50자 이하, 한글 및 영어만 사용할 수 있습니다.')
            } else if($('#phone').val().length != 13) {
                alert('전화번호를 확인해주세요. 000-0000-0000 형식이어야 합니다.')
            } else {
                let data = {
                    cnt : matchCount,
                    name : $('#name').val(),
                    phone : $('#phone').val()
                }

                alert('이벤트에 참여해주셔서 감사합니다')
                $('#enrolled').modal('hide')
                document.querySelector('.btn-start').innerText = '게임시작'
                stamp()

                gameStatus = 'ready'
                matchCount = 0
                time = 90
                cardList = []
                initCard()
                initEvent()
                render()
            }
        })

        document.querySelector('.cl').addEventListener('click', e => {
            $('#enrolled').modal('hide')
        })
    }

    async function gameStart() {
        if(gameStatus == 'wait') return

        clearTimeout(showTimeout)
        clearTimeout(animationTimeout)
        showTimeout = null
        animationTimeout = null

        initCard()
        initEvent()

        document.querySelector('.btn-start').innerText = '다시하기'

        gameStatus = 'wait'
        matchCount = 0
        time = 5
        cardList.forEach(item => {
            item.selected = false
            item.match = false
            item.area = null
        })

        let areaList = JSON.parse(JSON.stringify(AREA_LIST))
        let useList = []

        for (let i = 0; i < 8; i++) {
            let idx = parseInt(Math.random() * areaList.length)
            let [area] = areaList.splice(idx, 1)
            useList.push(area)
        }

        useList.forEach(area => {
            for(let i = 0; i < 2; i++) {
                let list = cardList.filter(card => !card.area)
                let idx = parseInt(Math.random() * list.length)
                list[idx].area = area
                list[idx].elem.querySelector('.front img').src = area.img
            }
        })

        cardList.forEach(card => {
            card.selected = true
        })

        for(let i = 5; i > 0; i--) {
            await toastCount(i)
            time--
        }

        cardList.forEach(card => {
            card.selected = false
            time = 90
        })

        gameStatus = 'playing'
    }

    function chkGameEnd() {
        if(time > 0 && matchCount == 8 || time == 0) {
            gameStatus = 'end'

            cardList.forEach(card => {
                if(!card.match) {
                    let areaname = makeElem(`<div class="area-name">${card.area.name}</div>`)
                    card.elem.appendChild(areaname)
                }
            })

            $('.result').html(`${matchCount}개`)
            $('#enrolled').modal('show')
        }
    }

    function render() {
        let min = Math.floor(time / 60)
        let sec = String(time % 60).padStart(2, '0')

        timer.innerHTML = `<b>Time</b> ${min}:${sec}`

        count.innerHTML = `<b>Hit</b> ${matchCount}개`

        cardList.forEach(card => {
            if (gameStatus == 'end') {
                card.elem.classList.add('active')

                if(card.match) {
                    card.elem.classList.add('match')
                } else {
                    card.elem.classList.add('unmatch')
                }
            } else {
                if(card.match || card.selected) {
                    card.elem.classList.add('active')
                } else {
                    card.elem.classList.remove('active')
                }

                card.elem.classList.remove('match')
                card.elem.classList.remove('unmatch')
            }
        })

        requestAnimationFrame(() => render())
    }

    let hint = false
    async function showHint() {
        if(hint || gameStatus != 'playing' || animationTimeout) return

        clearTimeout(showTimeout)
        clearTimeout(animationTimeout)
        showTimeout = null
        animationTimeout = null

        hint = true
        cardList.forEach(item => {
            item.selected = true
        })

        for(let i = 3; i > 0; i--) {
            await toastCount(i)
        }

        cardList.forEach(card => {
            card.selected = false
        })
        hint = false
    }

    function stamp() {
        let arr = document.querySelectorAll('.att div')

        for(let i = 0; i < 3; i++) {
            if(!arr[i].classList.contains('stamped')) {
                let toDay = new Date()
                arr[i].classList.add('stamped')
                arr[i].innerHTML = `
                    <img src="./resource/img/stamp.png" alt="스탬프">
                    <span class="date">${toDay.getMonth()+1}월 ${toDay.getDate()}일</span>`

                break
            }
        }
    }
}

function makeElem(textHTML) {
    let parent = document.createElement('div')
    parent.innerHTML = textHTML
    return parent.firstElementChild
}

async function toastCount(number) {
    await wait(850)
}

function wait(ms) {
    return new Promise((res) => {
        setTimeout(() => {
            res()
        }, ms)
    })
}