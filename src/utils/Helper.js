import Model from "../models/model";
export default class Helper {
  sortNewestToOldest() {
    return (a, b) => {
        const dateA = new Date(a.askDate);
        const dateB = new Date(b.askDate);
        return dateB - dateA;
    }
  }

  //decision(){
//
  //}


  parseSearchTerm(searchTerm) {
    const tags = [];
    const nonTags = [];
    let buffer = "";

    for (let i = 0; i < searchTerm.length; i++) {
      const char = searchTerm[i];
      if (char === "[") {
        if (buffer) {
          nonTags.push(buffer.trim());
          buffer = "";
        }
        buffer += char;
      } else if (char === "]") {
        buffer += char;
        if (Model.isValidTag(buffer.slice(1, -1).toLowerCase())) {
          tags.push(buffer);
        } else {
          nonTags.push(buffer);
        }
        buffer = "";
      } else {
        buffer += char;
        if (i === searchTerm.length - 1) {
          nonTags.push(buffer.trim());
        }
      }
    }

    return { tags, nonTags };
  }

  formatDate(postTime) {
    const now = new Date();
    const diffInSeconds = (now - postTime) / 1000;

    if (diffInSeconds < 60) {
      return `${Math.round(diffInSeconds)} seconds ago`;
    }
    if (diffInSeconds < 3600) {
      return `${Math.round(diffInSeconds / 60)} minutes ago`;
    }
    if (diffInSeconds < 86400) {
      return `${Math.round(diffInSeconds / 3600)} hours ago`;
    }
    const timeString = postTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    if (diffInSeconds < 31536000) {
      return `${postTime.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })} at ${timeString}`;
    }
    return `${postTime.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })} at ${timeString}`;
  }
}
