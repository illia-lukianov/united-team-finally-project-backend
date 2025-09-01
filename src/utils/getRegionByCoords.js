import axios from 'axios';

export async function getRegionByCoords(lat, lng) {
  if (lat === undefined && lng === undefined) {
    return null
  } else {
    const { data } = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
    return `${data.address.country}, ${data.address.state}`;
  }}