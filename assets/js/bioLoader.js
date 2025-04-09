/**
 * Biography Markdown Loader
 * Fetches and renders the biography markdown file into HTML
 */

document.addEventListener('DOMContentLoaded', () => {
  // Get the bio text container
  const bioText = document.getElementById('bio-text');
  if (!bioText) return;

  // Initial load based on current language
  // First check the language manager's current language if available
  const initialLang = window.currentLanguage || localStorage.getItem('preferredLanguage') || document.documentElement.lang || 'en';
  loadBioForLanguage(initialLang);
  
  // Listen for language changes
  window.addEventListener('languageChanged', (e) => {
    loadBioForLanguage(e.detail.language);
  });
  
  // Function to load bio for specific language
  function loadBioForLanguage(lang) {
    // Determine which file to load based on language
    const bioFile = lang === 'es' ? '/content/bio_esp.md' : '/content/bio_new.md';
    
    // Fetch the markdown bio file
    fetch(bioFile)
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
        console.error(`Error loading bio markdown for ${lang}:`, error);
        bioText.innerHTML = '<p>Unable to load biography content.</p>';
      });
  }
});

/**
 * Enhanced markdown to HTML converter (fallback if marked.js isn't available)
 * Handles rich markdown syntax
 */
function convertMarkdownToHTML(markdown) {
  const blocks = markdown.split('\n\n');

  return blocks.map(block => {
    // Code blocks
    if (block.startsWith('```')) {
      const lines = block.split('\n');
      const language = lines[0].replace('```', '');
      const code = lines.slice(1, -1).join('\n');
      return `<pre><code class="language-${language}">${escapeHTML(code)}</code></pre>`;
    }

    // Tables
    if (block.includes('|')) {
      const rows = block.split('\n');
      if (rows.length > 2) {
        const headers = rows[0].split('|').filter(cell => cell.trim());
        const tableRows = rows.slice(2);

        const tableHTML = `
          <table class="markdown-table">
            <thead>
              <tr>${headers.map(h => `<th>${h.trim()}</th>`).join('')}</tr>
            </thead>
            <tbody>
              ${tableRows.map(row => `
                <tr>${row.split('|')
                  .filter(cell => cell.trim())
                  .map(cell => `<td>${cell.trim()}</td>`)
                  .join('')}
                </tr>`).join('')}
            </tbody>
          </table>
        `;
        return tableHTML;
      }
    }

    // Task Lists
    if (block.match(/^- \[[ x]\]/m)) {
      return `<ul class="task-list">
        ${block.split('\n')
          .map(line => {
            const checked = line.includes('[x]');
            const text = line.replace(/- \[[ x]\] /, '');
            return `<li>
              <input type="checkbox" ${checked ? 'checked' : ''} disabled>
              <span>${text}</span>
            </li>`;
          })
          .join('')}
      </ul>`;
    }
    
    // Handle badges to prevent stacking
    if (block.match(/\[\!\[.*?\]\(.*?\)\]/g)) {
      // Create a wrapper div for badges
      return `<div class="badge-container flex flex-wrap gap-2 my-3">
        ${block.replace(/\[\!\[(.*?)\]\((.*?)\)\]\((.*?)\)/g, 
          '<a href="$3" class="inline-block m-1" target="_blank"><img src="$2" alt="$1"></a>')}
      </div>`;
    }

    return block
      // Headers with IDs for navigation
      .replace(/^# (.*$)/gm, (_, h1) => `<h1 id="${slugify(h1)}">${h1}</h1>`)
      .replace(/^## (.*$)/gm, (_, h2) => `<h2 id="${slugify(h2)}" class="text-gray-400">${h2}</h2>`)
      // Special handling for encapsulated titles with added spacing
      .replace(/^## --(.*)--$/gm, (_, h2) => 
        `<h2 id="${slugify(h2)}" class="encapsulated-title my-8 py-3 border-y-2 text-gray-400">${h2}</h2>`)
      .replace(/^### --(.*)--$/gm, (_, h3) => 
        `<h3 id="${slugify(h3)}" class="encapsulated-title my-6 py-2 border-y">${h3}</h3>`)
      .replace(/^### (.*$)/gm, (_, h3) => `<h3 id="${slugify(h3)}" class="mt-8 mb-4">${h3}</h3>`)

      // Links and Images - modified to handle badge displays better
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
      .replace(/!\[([^\]]+)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="inline-block">')

      // Inline Code
      .replace(/`([^`]+)`/g, '<code>$1</code>')

      // Strikethrough
      .replace(/~~(.*)~~/g, '<del>$1</del>')

      // Basic formatting
      .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*)\*/g, '<em>$1</em>')
      .replace(/^\- (.*$)/gm, '<li>$1</li>')
      .replace(/^\> (.*$)/gm, '<blockquote>$1</blockquote>')

      // Paragraphs
      .replace(/^(?!<[a-z])/gm, '<p>$&')
      .replace(/^(?!<[a-z].*>)(.*)$/gm, '$1</p>')

      // Lists cleanup
      .replace(/<\/li><li>/g, '</li>\n<li>')
      .replace(/<\/li>(?!<li>)/g, '</li>\n</ul>')
      .replace(/^<li>/gm, '<ul>\n<li>');
  }).join('');
}

function slugify(text) {
  return text.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function escapeHTML(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}