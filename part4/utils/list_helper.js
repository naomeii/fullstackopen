///

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return null;
    }
    
    const topBlog = blogs.reduce((maxBlog, currentBlog) => {
        return currentBlog.likes > maxBlog.likes ? currentBlog : maxBlog;
    }, blogs[0]); // Initialize maxBlog with the first blog
    
    return {
        title: topBlog.title,
        author: topBlog.author,
        likes: topBlog.likes
    };
}
  
module.exports = {
    dummy, totalLikes, favoriteBlog
}