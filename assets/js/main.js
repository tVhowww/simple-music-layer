
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'MUSIC_PLAYER'

const player = $('.player')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const app = {
    currentIndex: 0,
    arrayIndexRandom: [],
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Đừng làm trái tim anh đau',
            singer: 'Sơn Tùng M-TP',
            path: './assets/music/dung-lam-trai-tim-anh-dau.mp3',
            image: './assets/img/dung-lam-trai-tim-anh-dau.jpg'
        },
        {
            name: 'Xoay một vòng',
            singer: 'HIEUTHUHAI ft Phương Ly',
            path: './assets/music/Xoay-Mot-Vong-HIEUTHUHAI-Phuong-Ly.mp3',
            image: './assets/img/Xoay-Mot-Vong-HIEUTHUHAI-Phuong-Ly.jpg'
        },
        {
            name: 'Chúng ta của tương lai',
            singer: 'Sơn Tùng M-TP',
            path: './assets/music/Chung-Ta-Cua-Tuong-Lai-Son-Tung-MTP.mp3',
            image: './assets/img/Chung-Ta-Cua-Tuong-Lai-Son-Tung-MTP.jpg'
        },
        {
            name: 'Dân chơi sao phải khóc',
            singer: 'Andree Right Hand ft Rhyder',
            path: './assets/music/Dan-Choi-Sao-Phai-Khoc-Andree-Right-Hand-RHYDER.mp3',
            image: './assets/img/Dan-Choi-Sao-Phai-Khoc-Andree-Right-Hand-RHYDER.jpg'
        },
        {
            name: 'My Humps',
            singer: 'The black eyed peas',
            path: './assets/music/The-Black-Eyed-Peas-Remix-My-Humps.mp3',
            image: './assets/img/The-Black-Eyed-Peas-Remix-My-Humps.jpg'
        },
        {
            name: 'Die for you',
            singer: 'The Weekends ft Ariana Grande',
            path: './assets/music/Die-For-You-Remix-The-Weeknd-x-Ariana-Grande.mp3',
            image: './assets/img/Die-For-You-Remix-The-Weeknd-x-Ariana-Grande.jpg'
        },
        {
            name: 'Dance the night',
            singer: 'Dua Lipa',
            path: './assets/music/Dance-The-Night-Dua-Lipa.mp3',
            image: './assets/img/Dance-The-Night-Dua-Lipa.jpg'
        },
        {
            name: 'Vụ nổ lớn - Không quan trọng',
            singer: 'MCK ft Justatee',
            path: './assets/music/Vu-No-Lon-Khong-Quan-Trong-MCK-Justatee.mp3',
            image: './assets/img/Vu-No-Lon-Khong-Quan-Trong-MCK-Justatee.jpg'
        },
        {
            name: 'Everything will be okay',
            singer: 'HIEUTHUHAI',
            path: './assets/music/Everything-Will-Be-Okay-HIEUTHUHAI.mp3',
            image: './assets/img/Everything-Will-Be-Okay-HIEUTHUHAI.jpg'
        },

    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                    <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                        <div class="thumb"
                            style="background-image: url('${song.image}')">
                        </div>
                        <div class="body">
                            <h3 class="title">${song.name}</h3>
                            <p class="author">${song.singer}</p>
                        </div>
                        <div class="option">
                            <i class="fas fa-ellipsis-h"></i>
                        </div>
                    </div>
                `
        })
        playlist.innerHTML = htmls.join('')
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function () {
        const _this = this
        const cdWidth = cd.offsetWidth

        // Xử lý CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000, // 10 seconds
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        // Xử lý phóng to / thu nhỏ CD
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth

        }

        // Xử lý khi click play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }

        // Khi bài hát được play
        audio.onplay = function () {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        // Khi bài hát được pause
        audio.onpause = function () {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }

        // Xử lý khi tua song
        progress.oninput = function (e) {
            const seekTime = e.target.value / 100 * audio.duration
            audio.currentTime = seekTime
        }

        // Khi next bài
        nextBtn.onclick = function () {
            if (_this.isRandom)
                _this.playRandomSong()
            else
                _this.nextSong()
            audio.play()
        }

        // Khi prev bài
        prevBtn.onclick = function () {
            if (_this.isRandom)
                _this.playRandomSong()
            else
                _this.prevSong()
            audio.play()
        }

        // Khi random bài
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        // Xử lý lặp lại 1 bài hát
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        // Xử lý next song khi audio ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play()
            } else
                nextBtn.click()
        }

        // Lắng nghe hành vi click vào playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode ||
                e.target.closest('.option')) {
                // Xử lý khi click vào song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.handleActivePlaylist()
                    _this.scrollToActiveSong()
                    audio.play()
                }

                // Xử lý khi click vào option
                if (e.target.closest('.option')) {

                }
            }
        }
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path

    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    nextSong: function () {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
        this.handleActivePlaylist()
        this.scrollToActiveSong()
    },
    prevSong: function () {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
        this.handleActivePlaylist()
        this.scrollToActiveSong()
    },
    playRandomSong: function () {
        let newIndex

        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
            if (this.arrayIndexRandom.length === this.songs.length) {
                this.arrayIndexRandom = []
            }
        } while (newIndex === this.currentIndex ||
            this.arrayIndexRandom.includes(newIndex)
        )
        this.arrayIndexRandom.push(newIndex)
        // console.log(this.arrayIndexRandom);
        this.currentIndex = newIndex
        this.loadCurrentSong()
        this.handleActivePlaylist()
        this.scrollToActiveSong()
    },
    // Xử lý active playlist bài hát đang phát
    handleActivePlaylist: function () {
        const allSongs = document.querySelectorAll('.song')
        allSongs.forEach((song, index) => {
            song.classList.remove('active')
            if (index === this.currentIndex) {
                song.classList.add('active')
            }
        })
    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: this.currentIndex === 0 ? 'end' : 'nearest',
            })
        }, 250)
    },
    start: function () {
        // Gán cấu hình từ config vào app
        this.loadConfig()

        // Định nghĩa các thuộc tính cho object
        this.defineProperties()

        // Lắng nghe / xử lý các sự kiện (DOM events)
        this.handleEvents()

        // Tải thông tin bài hát đầu tiền vào UI khi chạy app
        this.loadCurrentSong()

        // Render playlist
        this.render();

        // Hiển thị trạng thái ban đầu của button repeat và random
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
    }
}

app.start();