const fs = require('fs');
const path = require('path');

const indexPath = path.join('C:\\Users\\Dell\\Downloads\\LOTERIA\\lotteryx-landing', 'index.html');
const indexContent = fs.readFileSync(indexPath, 'utf8');

// Extract head (from <!DOCTYPE html> to </style>)
const headMatch = indexContent.match(/<!DOCTYPE html>[\\s\\S]*?<\\/style>/);
let baseHead = headMatch ? headMatch[0] : '';

// Add Blog specific styles before </head>
const blogStyles = `
    /* Blog specific styles */
    .blog-container {
      width: min(1000px, 90%);
      margin: 60px auto;
      padding-top: 40px;
      min-height: 50vh;
    }
    .blog-header {
      text-align: center;
      margin-bottom: 50px;
    }
    .blog-header h1 {
      font-size: clamp(32px, 5vw, 48px);
      font-weight: 800;
      color: var(--primary);
    }
    .blog-header p {
      color: var(--text-muted);
      margin-top: 10px;
      font-size: 18px;
    }
    .blog-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 30px;
    }
    .blog-card {
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: 20px;
      overflow: hidden;
      transition: transform 0.3s ease, border-color 0.3s ease;
      display: flex;
      flex-direction: column;
      text-decoration: none;
    }
    .blog-card:hover {
      transform: translateY(-5px);
      border-color: rgba(16, 185, 129, 0.4);
    }
    .blog-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
      background: #111;
    }
    .blog-content {
      padding: 24px;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }
    .blog-date {
      color: var(--primary);
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    .blog-title {
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 12px;
      line-height: 1.4;
      color: var(--text-main);
    }
    .blog-excerpt {
      color: var(--text-muted);
      font-size: 15px;
      line-height: 1.6;
      margin-bottom: 20px;
      flex-grow: 1;
    }
    .read-more {
      display: inline-block;
      color: var(--primary);
      font-weight: 600;
      font-size: 15px;
      transition: opacity 0.2s;
    }

    /* Pagination */
    .pagination {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin-top: 60px;
      align-items: center;
    }
    .page-btn {
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      color: var(--text-main);
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s;
    }
    .page-btn:hover:not(:disabled) {
      background: rgba(16, 185, 129, 0.1);
      border-color: var(--primary);
    }
    .page-btn.active {
      background: var(--primary);
      color: #000;
      border-color: var(--primary);
    }
    .page-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    @media (max-width: 900px) {
      .blog-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (max-width: 600px) {
      .blog-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>`;

let newHead = baseHead + '\\n' + blogStyles;

// Extract header and footer
const headerMatch = indexContent.match(/<header class="landing-header">[\\s\\S]*?<\\/header>/);
let header = headerMatch ? headerMatch[0] : '';
header = header.replace('href="#how-it-works"', 'href="/#how-it-works"')
               .replace('href="#features"', 'href="/#features"')
               .replace('href="#faq"', 'href="/#faq"');

const footerMatch = indexContent.match(/<footer class="landing-footer">[\\s\\S]*?<\\/footer>/);
const footer = footerMatch ? footerMatch[0] : '';

const scriptContent = `
  <script>
    // ARRAY DE ARTICULOS (Añade nuevos artículos aquí)
    const articles = [
      {
        title: "Cómo ganar la lotería de Panamá usando patrones de brincos",
        url: "/blog/como-ganar-la-loteria-de-panama/",
        excerpt: "Descubre cómo la matemática y el análisis estadístico de los resultados históricos de la Lotería Nacional pueden darte una ventaja real.",
        date: "20 May 2026",
        image: "https://lotteryx.digitalboxstore.site/og-image.png"
      }
      // PLANTILLA PARA NUEVO ARTÍCULO:
      /*
      ,{
        title: "Título de tu artículo",
        url: "/blog/tu-enlace/",
        excerpt: "Un pequeño resumen...",
        date: "21 May 2026",
        image: "URL de tu imagen"
      }
      */
    ];

    const ITEMS_PER_PAGE = 6;
    let currentPage = 1;

    function renderArticles() {
      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      const currentArticles = articles.slice(start, end);

      const grid = document.getElementById('blog-grid');
      grid.innerHTML = '';

      if (currentArticles.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">Pronto publicaremos más artículos.</p>';
        return;
      }

      currentArticles.forEach(article => {
        const card = document.createElement('a');
        card.href = article.url;
        card.className = 'blog-card';
        card.innerHTML = 
          '<img src="' + article.image + '" alt="' + article.title + '" class="blog-image">' +
          '<div class="blog-content">' +
            '<span class="blog-date">' + article.date + '</span>' +
            '<h3 class="blog-title">' + article.title + '</h3>' +
            '<p class="blog-excerpt">' + article.excerpt + '</p>' +
            '<span class="read-more">Leer más &rarr;</span>' +
          '</div>';
        grid.appendChild(card);
      });

      renderPagination();
    }

    function renderPagination() {
      const totalPages = Math.ceil(articles.length / ITEMS_PER_PAGE);
      const pagination = document.getElementById('pagination');
      pagination.innerHTML = '';

      if (totalPages <= 1) return; // Hide pagination if only 1 page

      // Prev button
      const prevBtn = document.createElement('button');
      prevBtn.className = 'page-btn';
      prevBtn.innerHTML = '&larr;';
      prevBtn.disabled = currentPage === 1;
      prevBtn.onclick = function() { currentPage--; renderArticles(); window.scrollTo(0, 0); };
      pagination.appendChild(prevBtn);

      // Page numbers
      for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.className = 'page-btn ' + (i === currentPage ? 'active' : '');
        btn.innerText = i;
        btn.onclick = function() { currentPage = i; renderArticles(); window.scrollTo(0, 0); };
        pagination.appendChild(btn);
      }

      // Next button
      const nextBtn = document.createElement('button');
      nextBtn.className = 'page-btn';
      nextBtn.innerHTML = '&rarr;';
      nextBtn.disabled = currentPage === totalPages;
      nextBtn.onclick = function() { currentPage++; renderArticles(); window.scrollTo(0, 0); };
      pagination.appendChild(nextBtn);
    }

    // Init
    document.addEventListener('DOMContentLoaded', renderArticles);
  </script>
`;

const htmlContent = `
  <div class="blog-container">
    <div class="blog-header">
      <h1>Blog LotteryX</h1>
      <p>Consejos, análisis y estrategias para la Lotería de Panamá</p>
    </div>

    <div class="blog-grid" id="blog-grid">
      <!-- Articles will be injected here via JS -->
    </div>

    <div class="pagination" id="pagination">
      <!-- Pagination will be injected here via JS -->
    </div>
  </div>
`;

const blogHtml = newHead + '\\n' + header + '\\n' + htmlContent + '\\n' + footer + '\\n' + scriptContent + '\\n</body>\\n</html>';

fs.writeFileSync(path.join('C:\\Users\\Dell\\Downloads\\LOTERIA\\lotteryx-landing\\blog', 'index.html'), blogHtml);
