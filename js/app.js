document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded сработал');

    const authPage = document.getElementById('auth-page');
    const mainPage = document.getElementById('main-page');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const errorMessage = document.getElementById('error-message');
    const registerError = document.getElementById('register-error');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const userRoleBtn = document.getElementById('user-btn'); // Кнопка "Показать карту"
    const authForm = document.getElementById('auth-form');
    const registerFormSubmit = document.getElementById('register-form-submit');
    const mapDiv = document.getElementById('map'); // Элемент карты

    // Проверка авторизации при загрузке
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        console.log('User logged in:', loggedInUser);
        showMainPage();
    }

    // Показать форму входа
    loginBtn.addEventListener('click', () => {
        console.log('Нажата кнопка "Войти"');
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    });

    // Показать форму регистрации
    registerBtn.addEventListener('click', () => {
        console.log('Нажата кнопка "Зарегистрироваться"');
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    });

    // Обработка входа
    authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const users = JSON.parse(localStorage.getItem('users')) || [];
        let user = users.find(u => u.username === username);

        if (user) {
            if (user.password === password) {
                localStorage.setItem('loggedInUser', JSON.stringify(user));
                showMainPage();
            } else {
                errorMessage.innerText = 'Неверный пароль';
            }
        } else {
            errorMessage.innerText = 'Пользователь не найден';
        }
    });

    // Обработка регистрации
    registerFormSubmit.addEventListener('submit', (e) => {
        e.preventDefault();
        const newUsername = document.getElementById('new-username').value;
        const newPassword = document.getElementById('new-password').value;

        const users = JSON.parse(localStorage.getItem('users')) || [];
        let existingUser = users.find(u => u.username === newUsername);

        if (existingUser) {
            registerError.innerText = 'Этот логин уже занят';
        } else {
            const newUser = { username: newUsername, password: newPassword };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('loggedInUser', JSON.stringify(newUser));
            showMainPage();
        }
    });

    // Кнопка выхода
    logoutBtn.addEventListener('click', () => {
        console.log('Нажата кнопка "Выйти"');
        localStorage.removeItem('loggedInUser');
        mainPage.style.display = 'none';
        authPage.style.display = 'block';
    });

    function showMainPage() {
        console.log('Показываю главную страницу');
        authPage.style.display = 'none';
        mainPage.style.display = 'block';
        userRoleBtn.style.display = 'inline-block';
    }

    // Инициализация карты
    function initMap() {
        console.log('Инициализация карты');
        const map = new ymaps.Map("map", {
            center: [55.7558, 37.6173], // Центр Москвы
            zoom: 12
        });

        const boatIcon = {
          iconLayout: 'default#image',
          iconImageHref: 'images/boat-icon.svg', // исправленный путь
          iconImageSize: [40, 40],
          iconImageOffset: [-20, -20]
        };


        const boatLocations = [
    [55.4452, 37.3700], // Кремль (вдоль реки)
    [55.7493, 37.6156], // Зарядье (вдоль реки)
    [55.7483, 37.6252], // Большой Каменный мост (вдоль реки)
    [55.7439, 37.6333], // Парк Горького (вдоль реки)
    [55.7405, 37.6402], // Лужники (вдоль реки)
    [55.7375, 37.6504], // Новодевичий монастырь (вдоль реки)
    [55.7333, 37.6555], // Москва-Сити (вдоль реки)
    [55.7300, 37.6617], // Воробьёвы горы (вдоль реки)
    [55.7267, 37.6675], // Андреевский мост (вдоль реки)
    [55.7233, 37.6732]  // Киевская (вдоль реки)
];



        boatLocations.forEach(coords => {
            map.geoObjects.add(new ymaps.Placemark(coords, {
                balloonContent: "Кораблик"
            }, boatIcon));
        });

        // Добавление геолокации пользователя
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userCoordinates = [position.coords.latitude, position.coords.longitude];
                    map.setCenter(userCoordinates);
                    map.geoObjects.add(new ymaps.Placemark(userCoordinates, {
                        balloonContent: "Ваше текущее местоположение"
                    }, {
                        preset: 'islands#blueDotIcon'
                    }));
                },
                (error) => {
                    console.error("Ошибка при получении геолокации:", error);
                }
            );
        } else {
            console.error("Геолокация не поддерживается браузером");
        }
    }

    // Показ карты по клику на кнопку
    userRoleBtn.addEventListener('click', () => {
        mapDiv.style.display = 'block';
        ymaps.ready(initMap);
    });
});
