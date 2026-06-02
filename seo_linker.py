import os
import re

blog_dir = r"C:\Users\Dell\Downloads\LOTERIA\lotteryx-landing\blog"

replacements = {
    r'(?<!<a href="https://www.lnb.gob.pa/" target="_blank" rel="noopener noreferrer">)(Lotería Nacional de Beneficencia)(?!</a>)': r'<a href="https://www.lnb.gob.pa/" target="_blank" rel="noopener noreferrer">\1</a>',
    r'(?<!<a href="https://www.lnb.gob.pa/" target="_blank" rel="noopener noreferrer">)(Lotería de Panamá)(?!</a>)': r'<a href="https://www.lnb.gob.pa/" target="_blank" rel="noopener noreferrer">\1</a>',
    r'(?<!<a href="https://www.telemetro.com/" target="_blank" rel="noopener noreferrer">)(Telemetro)(?!</a>)': r'<a href="https://www.telemetro.com/" target="_blank" rel="noopener noreferrer">\1</a>',
    r'(?<!<a href="https://www.tvn-2.com/" target="_blank" rel="noopener noreferrer">)(TVN)(?!</a>)': r'<a href="https://www.tvn-2.com/" target="_blank" rel="noopener noreferrer">\1</a>',
    r'(?<!<a href="https://www.laestrella.com.pa/" target="_blank" rel="noopener noreferrer">)(La Estrella de Panamá)(?!</a>)': r'<a href="https://www.laestrella.com.pa/" target="_blank" rel="noopener noreferrer">\1</a>',
    r'(?<!<a href="https://www.laestrella.com.pa/" target="_blank" rel="noopener noreferrer">)(La Estrella)(?! de Panamá)(?!</a>)': r'<a href="https://www.laestrella.com.pa/" target="_blank" rel="noopener noreferrer">\1</a>',
    r'(?<!")(app\.digitalboxstore\.site)(?!")(?![^<]*</a>)': r'<a href="https://app.digitalboxstore.site/" target="_blank" rel="noopener noreferrer">\1</a>'
}

# The regex for app.digitalboxstore.site is tricky because it appears in meta tags, script tags, href attributes, etc.
# Actually, the safest way using regex to only replace text content (not within tags) is to split by tags.

def replace_in_text(text):
    for pattern, replacement in replacements.items():
        text = re.sub(pattern, replacement, text)
    return text

for root, dirs, files in os.walk(blog_dir):
    for file in files:
        if file == "index.html":
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Split by tags to only apply replacements on text nodes
            # A simple approach: split by > and < to isolate text nodes
            # But we must skip text inside <title>, <meta>, <style>, <script>, <a>, <h1>...<h6>
            
            parts = re.split(r'(</?[^>]+>)', content)
            
            inside_skip_tag = False
            skip_tags = ['title', 'meta', 'style', 'script', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img', 'noscript']
            
            new_parts = []
            for part in parts:
                if part.startswith('<'):
                    # Check if it's an opening or closing tag
                    match = re.match(r'</?([a-zA-Z0-9]+)', part)
                    if match:
                        tag_name = match.group(1).lower()
                        if tag_name in skip_tags:
                            if not part.startswith('</'):
                                # Opening tag
                                # Handle self-closing tags like <meta>, <img>
                                if not part.endswith('/>') and tag_name not in ['meta', 'img']:
                                    inside_skip_tag = True
                            else:
                                # Closing tag
                                inside_skip_tag = False
                    new_parts.append(part)
                else:
                    if not inside_skip_tag and part.strip():
                        # This is a text node we can safely modify
                        new_parts.append(replace_in_text(part))
                    else:
                        new_parts.append(part)
            
            new_content = "".join(new_parts)
            
            with open(path, 'w', encoding='utf-8') as f:
                f.write(new_content)

print("Replacement complete.")
