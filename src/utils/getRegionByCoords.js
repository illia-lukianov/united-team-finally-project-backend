import axios from "axios";

const API_KEY = process.env.LOCATIONIQ_KEY;

export async function getRegionByCoords(lat, lng) {
  if (lat === undefined || lng === undefined) {
    return null;
  }

  try {
    const { data } = await axios.get("https://us1.locationiq.com/v1/reverse", {
      params: {
        key: API_KEY,
        lat,
        lon: lng,
        format: "json",
        "accept-language": "en",
      },
    });

    return `${data.address.country}, ${data.address.state}`;
  } catch (err) {
    console.error("Reverse geocoding failed:", err.response?.data || err.message);
    return null;
  }
}