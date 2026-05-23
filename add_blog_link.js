const fs = require('fs');
const path = require('path');

const files = ['index.html', 'contacto.html', 'privacidad.html', 'terminos.html'];

files.forEach(file => {
  const filePath = path.join('C:\\Users\\Dell\\Downloads\\LOTERIA\\lotteryx-landing', file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add Blog link
    const targetLink = '<a href="#faq">Preguntas Frecuentes</a>';
    const newLink = '<a href="/blog/">Blog</a>';
    
    // Some pages might not have `#faq` (like privacy), let's search for the App link instead.
    const appLink = '<a href="https://app.digitalboxstore.site/" class="btn-nav-cta" rel="nofollow">Acceder a la App</a>';
    
    if (content.includes(appLink)) {
      if (!content.includes(newLink)) {
         content = content.replace(appLink, newLink + '\n        ' + appLink);
         fs.writeFileSync(filePath, content);
      }
    }
  }
});
