// Pont entre navigator.geolocation (utilisé par l'appli) et le plugin natif
// de géolocalisation en arrière-plan. N'agit que dans l'app Android/iOS ;
// dans le navigateur, la PWA continue d'utiliser le GPS web standard.
(function () {
  var cap = window.Capacitor;
  if (!cap || !cap.isNativePlatform || !cap.isNativePlatform()) return;
  var BG = cap.Plugins && cap.Plugins.BackgroundGeolocation;
  if (!BG) { console.warn('Plugin BackgroundGeolocation introuvable'); return; }

  var seq = 0;
  var watchers = {};

  var shim = {
    watchPosition: function (success, error, options) {
      var localId = ++seq;
      var p = BG.addWatcher({
        backgroundMessage: 'Suivi de position Traqueur Live en cours',
        backgroundTitle: 'Traqueur Live',
        requestPermissions: true,
        stale: false,
        distanceFilter: 0
      }, function (loc, err) {
        if (err) {
          if (error) error({ code: err.code || 2, message: err.message || 'Position indisponible' });
          return;
        }
        if (!loc || !success) return;
        success({
          coords: {
            latitude: loc.latitude,
            longitude: loc.longitude,
            accuracy: loc.accuracy,
            altitude: loc.altitude != null ? loc.altitude : null,
            altitudeAccuracy: null,
            heading: loc.bearing != null ? loc.bearing : null,
            speed: loc.speed != null ? loc.speed : null
          },
          timestamp: loc.time || Date.now()
        });
      });
      watchers[localId] = p;
      return localId;
    },
    clearWatch: function (localId) {
      var p = watchers[localId];
      if (!p) return;
      delete watchers[localId];
      p.then(function (id) { return BG.removeWatcher({ id: id }); }).catch(function () {});
    }
  };

  Object.defineProperty(navigator, 'geolocation', { value: shim, configurable: true });
})();
