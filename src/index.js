import './css/styles.css';

import API from './js/api-service';
import getRefs from './js/get-refs.js';
import countryCardTpl from './templates/country-card.hbs';
import countriesListTpl from './templates/countries-list.hbs';
import debounce from 'lodash.debounce';

import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/PNotify.css';
import { error } from '@pnotify/core';

const refs = getRefs();

refs.searchInput.addEventListener('input', debounce(onSearch, 500));

function onSearch(e) {
  const searchQuery = e.target.value;
  API.fetchCountries(searchQuery).then(isSearchSucces).catch(onFetchError);
}

function onFetchError(error) {
  console.log('все пропало!');
}

function renderCountryCard(country) {
  const markupCard = countryCardTpl(country);
  refs.commonContainer.innerHTML = markupCard;
}

function renderCountriesList(country) {
  const markupList = countriesListTpl(country);
  refs.commonContainer.innerHTML = markupList;
}

function foundTooManyMatches() {
  error({
    text: 'Too many matches found. Please enter a more specific query!',
    delay: 2000,
  });
}

function foundNoMatches() {
  error({
    text: 'No matches found:(',
    delay: 2000,
  });
}

function isSearchSucces(country) {
  if (country.length === 1) {
    renderCountryCard(country);
  } else if (country.length > 1 && country.length <= 10) {
    renderCountriesList(country);
  } else if (country.length > 10) {
    foundTooManyMatches();
  } else {
    foundNoMatches();
  }
}
