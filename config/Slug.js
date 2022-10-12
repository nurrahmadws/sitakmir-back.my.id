const Slug = (text) => {
    return text.toLowerCase().replace(/ /g,'-').replace(/[-]+/g, '-').replace(/[^\w-]+/g,'').replace(/ +|_/g,'-');
}

export default Slug;