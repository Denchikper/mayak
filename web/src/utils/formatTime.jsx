// Маяк — система управления звуковыми оповещениями
// by Benovich · https://github.com/Denchikper/mayak

export function utcToLocalTime(utcString) {
  if (!utcString) return "";
  const [h, m, s] = utcString.split(":").map(Number);
  const date = new Date();
  date.setUTCHours(h, m, s, 0);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
}

export function localTimeToUTC(localTime) {
  const [h, m] = localTime.split(":").map(Number);
  const date = new Date();
  date.setHours(h, m, 0, 0);
  const utcH = date.getUTCHours().toString().padStart(2, "0");
  const utcM = date.getUTCMinutes().toString().padStart(2, "0");
  return `${utcH}:${utcM}:00`;
}