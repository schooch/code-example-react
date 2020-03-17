export function matchYoutubeUrl(url) {
  var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  if (url.match(p)) {
    return url.match(p)[1];
  }
  return false;
}

export function matchSpotifyUrl(url) {
  return /^(spotify:|https:\/\/[a-z]+\.spotify\.com\/)/.test(url);
}

export function informApp(method, param) {
  if (typeof window.SKUTEAPP !== "undefined" && window.SKUTEAPP !== null) {
    const parameter = param === undefined ? true : param;
    window.SKUTEAPP[method](parameter);
  }

  if (typeof window.webkit !== "undefined" && window.webkit !== null) {
    const parameter = param === undefined ? { status: "ok" } : param;
    window.webkit.messageHandlers[method].postMessage(parameter);
  }
}

export function embedSpotifyUrl(url) {
  return url.includes("/embed/")
    ? url
    : url.replace(
        "https://open.spotify.com/",
        "https://open.spotify.com/embed/"
      );
}
