export function orderBysb_name(a, b) {
  if (a.sb_name < b.sb_name) {
    return -1;
  }
  if (a.sb_name > b.sb_name) {
    return 1;
  }
  return 0;
}
