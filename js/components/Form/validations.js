import { matchYoutubeUrl, matchSpotifyUrl } from '../../helpers';

export function validateThreeCharacters(value) {
  return !value || value.trim().length < 3 ? 'This field must contain minimum 3 characters' : null;
}

export function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return email && re.test(String(email).toLowerCase()) ? null : 'This field must be a valid email.';
}

export function validateImage(value) {
  return !value || value.type && value.type.split('/')[0] !== 'image' ? 'Image is required' : null;
}

export function validateYoutube(value) {
  return !value || !matchYoutubeUrl(value) ? 'Url must be a valid youtube url.' : null;
}
export function validateSpotify(value) {
  return !value || !matchSpotifyUrl(value) ? 'Url must be a valid spotify url.' : null;
}