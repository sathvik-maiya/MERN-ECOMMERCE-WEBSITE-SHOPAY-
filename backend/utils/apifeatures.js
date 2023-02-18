class apifeatures {
  constructor(query, querystr) {
    this.query = query;
    this.querstr = querystr;
  }
  search() {
    const keyword = this.querstr.keyword
      ? {
          name: {
            $regex: this.querstr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }
  filter() {
    const queryCopy = { ...this.querstr };

    //removing some fields for category
    const removefields = ["keyword", "page", "limit"];
    removefields.forEach((key) => delete queryCopy[key]);

    // filter for price and rating
    let querstr = JSON.stringify(queryCopy);
    querstr = querstr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(querstr));
    return this;
  }

  pagination(resultperpage) {
    const currentpage = Number(this.querstr.page) || 1;

    const skip = resultperpage * (currentpage - 1);

    this.query = this.query.limit(resultperpage).skip(skip);
    return this;
  }
}
module.exports = apifeatures;
