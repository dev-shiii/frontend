let googleMapsPromise = null;

export default function loadGoogleMaps(apiKey) {
  if (googleMapsPromise) return googleMapsPromise;

  googleMapsPromise = new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve(window.google.maps);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;

    script.onload = () => resolve(window.google.maps);
    script.onerror = (err) => reject(err);

    document.head.appendChild(script);
  });

  return googleMapsPromise;
}
