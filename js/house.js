var houses = document.querySelectorAll('.house');

houses.forEach(house => {
    fetch(house.dataset.url).then((response) => {
        return response.json();
    }).then((houseData) => {
        var houseTitle = document.createElement('h1');
        houseTitle.innerHTML = houseData[0].house;
        house.append(houseTitle);
        house.style.backgroundImage = `url(${house.dataset.background})`
    })
})


document.querySelector('#img').addEventListener('click', (el) => {
    el = el.target;
    el.style.filter = 'none';

    if (el.dataset.url) {
        fetch(el.dataset.url).then((response) => {
            return response.json();
        })
        .then((house) => {
            document.querySelector('aside').innerHTML = '';

            var banners = document.querySelectorAll('.house');

            banners.forEach(banner => {
                if (banner != el) {
                    banner.style.filter = 'brightness(65%)';
                }
            })

            house.forEach(character => {
                var url = character.image;
                var http = new XMLHttpRequest();
                http.open('HEAD', url, false);
                http.send();
                if (http.status != 404) {
                    var div = document.createElement('div');
                    div.classList.add('character');
                    div.style.backgroundImage = `url('${character.image}')`;
                    div.addEventListener('click', (el) => {
                        el = el.target;
                        el.innerHTML = '';
                        el.style.filter = 'none';

                        var name = document.createElement('h2');
                        var age = document.createElement('p');
                        var gender = document.createElement('p');
                        var father = document.createElement('p');
                        var actor = document.createElement('p');
                        var detail = document.createElement('div');
                        name.innerHTML = character.name;
                        detail.append(name);
                        actor.innerHTML = `Acteur : ${character.actor}`;
                        detail.append(actor);

                        if (character.age) {
                            if (character.age.age) {
                                age.innerHTML = `Age : ${character.age.age} ans`;
                            }
                            else {
                                age.innerHTML = 'Age : Inconnu'
                            }
                        } else {
                            age.innerHTML = 'Age : Inconnu'
                        }
                        detail.append(age);
                        if (character.gender) {
                            if (character.gender === 'male') {
                                gender.innerHTML = 'Sexe : Homme ';
                            } else {
                                gender.innerHTML = 'Sexe : Femme';
                            }
                        } else {
                            gender.innerHTML = 'Sexe : Inconnu'
                        }

                        detail.append(gender);
                        if (character.father) {
                            father.innerHTML = `Père : ${character.father} `;
                        } else {
                            father.innerHTML = 'Père : Inconnu'
                        }

                        detail.append(father);
                        el.append(detail);
                        var characters = document.querySelectorAll('.character');
                        characters.forEach(character => {
                            if (character !== el) {
                                character.innerHTML = '';
                                character.style.filter = 'brightness(65%)';
                            }
                        })
                    })

                    document.querySelector('aside').append(div);
                    window.scrollTo({
                        top: window.innerHeight,
                        left: 0,
                        behavior: 'smooth'
                    })
                }
            });
        })
    }
})