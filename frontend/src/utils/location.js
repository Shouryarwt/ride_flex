export const getCurrentLocationDetails = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Location access is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await response.json();

          resolve({
            latitude,
            longitude,
            city: data.city || data.locality || data.principalSubdivision || '',
            pincode: data.postcode || '',
            address: data.localityInfo?.administrative?.[0]?.name || '',
          });
        } catch {
          resolve({ latitude, longitude, city: '', pincode: '', address: '' });
        }
      },
      () => reject(new Error('Please allow location access to fill these details.')),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
    );
  });
