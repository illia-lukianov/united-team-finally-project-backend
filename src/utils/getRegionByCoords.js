import axios from 'axios';

export async function getRegionByCoords(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
  const { data } = await axios.get(url);
  return `${data.address.country}, ${data.address.state}`
}