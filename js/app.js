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
    const mapDiv = document.getElementById('map');  // Элемент карты

    // Проверка авторизации при загрузке
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        console.log('User logged in:', loggedInUser);
        showMainPage();  // Если пользователь уже авторизован, показываем главную страницу
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

        // Получаем пользователей из localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        let user = users.find(u => u.username === username);

        if (user) {
            if (user.password === password) {
                // Сохраняем в localStorage успешного пользователя
                localStorage.setItem('loggedInUser', JSON.stringify(user));
                showMainPage();  // Показываем главную страницу после успешного входа
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

        // Получаем пользователей из localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        let existingUser = users.find(u => u.username === newUsername);

        if (existingUser) {
            registerError.innerText = 'Этот логин уже занят';
        } else {
            const newUser = { username: newUsername, password: newPassword };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));  // Сохраняем всех пользователей
            localStorage.setItem('loggedInUser', JSON.stringify(newUser));  // Сохраняем нового пользователя
            showMainPage();  // Показываем главную страницу после успешной регистрации
        }
    });

    // Кнопка выхода
    logoutBtn.addEventListener('click', () => {
        console.log('Нажата кнопка "Выйти"');
        localStorage.removeItem('loggedInUser');
        mainPage.style.display = 'none';
        authPage.style.display = 'block';
    });

    // Показ главной страницы
    function showMainPage() {
        console.log('Показываю главную страницу');
        authPage.style.display = 'none';
        mainPage.style.display = 'block';
        userRoleBtn.style.display = 'inline-block';  // Отображаем кнопку "Показать карту"
    }

    function initMap() {
    console.log('Инициализация карты');

    // Проверка поддержки геолокации
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userCoordinates = [position.coords.latitude, position.coords.longitude];

                // Создание карты с центром на текущем местоположении
                const map = new ymaps.Map("map", {
                    center: userCoordinates,
                    zoom: 12
                });

                map.geoObjects.add(new ymaps.Placemark(userCoordinates, {
                    balloonContent: "Ваше текущее местоположение"
                }, {
                    preset: 'islands#blueDotIcon'
                }));
            },
            (error) => {
                console.error("Ошибка при получении геолокации:", error);
                // Фолбек на Москву, если доступ к геолокации запрещён
                showDefaultMap();
            }
        );
    } else {
        console.error("Геолокация не поддерживается браузером");
        showDefaultMap();
    }
}

function showDefaultMap() {
    const map = new ymaps.Map("map", {
        center: [55.7558, 37.6173], // Центр Москвы
        zoom: 10
    });
    map.geoObjects.add(new ymaps.Placemark([55.7558, 37.6173], {
        balloonContent: "Местоположение по умолчанию (Москва)"
    }));
}


    // Используем ymaps.ready для инициализации карты только после загрузки API
    userRoleBtn.addEventListener('click', () => {
        mapDiv.style.display = 'block';
        ymaps.ready(initMap);  // Инициализация карты
    });
});
