/**
 * Biography Markdown Loader
 * Fetches and renders the biography markdown file into HTML
 */

document.addEventListener('DOMContentLoaded', () => {
  // Get the bio text container
  const bioText = document.getElementById('bio-text');
  if (!bioText) return;

  // Fetch the markdown bio file
  fetch('/content/bio.md')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(markdown => {
      // If marked.js is available, use it to parse markdown
      if (typeof marked !== 'undefined') {
        bioText.innerHTML = marked.parse(markdown);
      } else {
        // Basic fallback formatting if marked.js isn't loaded
        bioText.innerHTML = convertMarkdownToHTML(markdown);
      }
    })
    .catch(error => {
      console.error('Error loading bio markdown:', error);
      bioText.innerHTML = '<p>Unable to load biography content.</p>';
    });
});

/**
 * Simple markdown to HTML converter (fallback if marked.js isn't available)
 * Handles basic markdown syntax
 */
function convertMarkdownToHTML(markdown) {
  return markdown
    // Headers
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    
    // Emphasis
    .replace(/\*\*(.*)\*\*/gm, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gm, '<em>$1</em>')
    
    // Lists
    .replace(/^\- (.*$)/gm, '<li>$1</li>')
    
    // Blockquotes
    .replace(/^\> (.*$)/gm, '<blockquote>$1</blockquote>')
    
    // Paragraphs
    .replace(/^(?!<[a-z])/gm, '<p>$&')
    .replace(/^(?!<[a-z].*>)(.*)$/gm, '$1</p>')
    
    // Clean up
    .replace(/<\/p><p>/g, '</p>\n<p>')
    .replace(/<\/li><li>/g, '</li>\n<li>')
    .replace(/<\/li>(?!<li>)/g, '</li>\n</ul>')
    .replace(/^<li>/gm, '<ul>\n<li>');
}