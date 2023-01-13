import './css/styles.css';
import Notiflix from 'notiflix';;
import debounce from 'lodash.debounce';

import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const ulElement = document.querySelector('.country-list');
const divElement = document.querySelector('.country-info');

// поиск данных в  input:
inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

// обработка события INPUT по вводу в input:
function onInput() {
  if (!inputEl.value.trim()) {
    divElement.innerHTML = '';
    ulElement.innerHTML = '';
    return;
  }
  fetchCountries(inputEl.value.trim())
    .then(countries => {
      if (countries.length === 1) {
        createCountryInfo(countries);
        // console.log(countries);
        ulElement.innerHTML = '';
      } else if (countries.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        ulElement.innerHTML = '';
        divElement.innerHTML = '';
      } else if (countries.length >= 2 && countries.length <= 10) {
        createCountryList(countries);
        divElement.innerHTML = '';
      }
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      divElement.innerHTML = '';
      ulElement.innerHTML = '';
    });
}


function createCountryInfo(countries) {
  const markup = countries.map(country => {
      return `
    <div>
    <img src="${country.flags.svg}" alt="flag of ${country.name.official}" height="40">
    <h2 class="text">${country.name.official}</h2>
    <p><span class="text">Capital: </span>${country.capital}</p>
    <p><span class="text">Population: </span>${country.population}</p>
    <p><span class="text">Languages: </span>${Object.values(country.languages)}</p>
    </div>`;
    })
    .join('');
  divElement.innerHTML = markup;
}


function createCountryList(countries) {
  const markup = countries
    .map(country => {
      return `<li>
    <img src="${country.flags.svg}" alt="flag of ${country.name.official}" height="40">
    <p class="flag-text">${country.name.official}</p>
    </li>`;
    })
    .join('');
  ulElement.innerHTML = markup;
}