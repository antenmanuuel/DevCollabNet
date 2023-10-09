function sortNewestToOldest(a, b) {
    const dateA = new Date(a.askDate);
    const dateB = new Date(b.askDate);
    return dateB - dateA;
  }

  export default sortNewestToOldest;