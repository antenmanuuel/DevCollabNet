import Model from "../models/model";


/**
 * Parses a given search term into separate arrays for tags and non-tag text.
 **/
  function parseSearchTerm(searchTerm) {
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

  export default parseSearchTerm;