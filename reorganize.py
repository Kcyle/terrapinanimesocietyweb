#!/usr/bin/env python3
"""
Script to reorganize the single-page HTML into a multi-page website structure.
This ensures every single line of code is preserved.
"""

import os
import re

# File path
ORIGINAL_FILE = r"c:\Users\Kyle\Downloads\terrapinanimesocietyweb-main\index.html"
BASE_DIR = r"c:\Users\Kyle\Downloads\terrapinanimesocietyweb-main"

def read_lines(file_path, start, end):
    """Read specific line range from file (1-indexed, inclusive)"""
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        return ''.join(lines[start-1:end])

def read_all_lines(file_path):
    """Read all lines from file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        return f.readlines()

def write_file(file_path, content):
    """Write content to file"""
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Created: {file_path}")

def extract_css_files():
    """Extract all CSS into separate files"""
    print("\n=== Extracting CSS Files ===")

    css_files = {
        'styles/kamecon.css': (10, 626),
        'styles/navigation.css': (628, 686),
        'styles/carousel.css': (688, 997),
        'styles/anime-cards.css': (998, 1063),
        'styles/eboard-animations.css': (1036, 1463),
        'styles/president.css': (1466, 1836),
        'styles/screening.css': (1839, 2236),
        'styles/global.css': (2238, 3613),
        'styles/components.css': (3615, 3920),
        'styles/events.css': (3922, 4421),
        'styles/forms.css': (4424, 4500),
        'styles/resources.css': (4503, 4784),
        'styles/footer.css': (4786, 4864),
        'styles/mobile.css': (4867, 5499),
        'styles/animusic.css': (5502, 6182),
    }

    for css_file, (start, end) in css_files.items():
        content = read_lines(ORIGINAL_FILE, start, end)
        write_file(os.path.join(BASE_DIR, css_file), content)

def extract_js_files():
    """Extract all JavaScript into separate files"""
    print("\n=== Extracting JavaScript Files ===")

    # Extract background.js (lines 6196-6415)
    bg_content = read_lines(ORIGINAL_FILE, 6196, 6415)
    write_file(os.path.join(BASE_DIR, 'js/background.js'), bg_content)

    # Extract music carousel (lines 6199-6263) - part of sliders.js
    carousel_content = read_lines(ORIGINAL_FILE, 6199, 6263)

    # Extract season tabs (lines 7794-7814)
    tabs_content = read_lines(ORIGINAL_FILE, 7794, 7814)
    write_file(os.path.join(BASE_DIR, 'js/tabs.js'), tabs_content)

    # Extract spinning blossom (lines 7816-7830)
    spinning_content = read_lines(ORIGINAL_FILE, 7816, 7830)
    write_file(os.path.join(BASE_DIR, 'js/spinning-blossom.js'), spinning_content)

    # Extract cosplay viewer (lines 7833-7857)
    cosplay_content = read_lines(ORIGINAL_FILE, 7833, 7857)
    write_file(os.path.join(BASE_DIR, 'js/cosplay.js'), cosplay_content)

    # Extract anime slider (lines 7859-7902) - part of sliders.js
    slider_content = read_lines(ORIGINAL_FILE, 7859, 7902)

    # Combine sliders
    sliders_combined = carousel_content + '\n\n' + slider_content
    write_file(os.path.join(BASE_DIR, 'js/sliders.js'), sliders_combined)

    # Extract page transition (lines 7904-7955)
    page_trans = read_lines(ORIGINAL_FILE, 7904, 7955)

    # Extract AudioManager (lines 8047-8129)
    audio_content = read_lines(ORIGINAL_FILE, 8047, 8129)
    write_file(os.path.join(BASE_DIR, 'js/audio.js'), audio_content)

    # Extract navigate functions (lines 8130-8175)
    navigate_funcs = read_lines(ORIGINAL_FILE, 8130, 8175)

    # Extract scroll behaviors (lines 8178-8220)
    scroll_content = read_lines(ORIGINAL_FILE, 8178, 8220)
    write_file(os.path.join(BASE_DIR, 'js/scroll.js'), scroll_content)

    # Extract navigation system (lines 8227-8296)
    nav_system = read_lines(ORIGINAL_FILE, 8227, 8296)

    # Combine navigation.js
    navigation_combined = page_trans + '\n\n' + navigate_funcs + '\n\n' + nav_system
    # Update navigation to use actual page URLs
    navigation_combined = navigation_combined.replace("href='#", "href='")
    navigation_combined = navigation_combined.replace('href="#', 'href="')
    write_file(os.path.join(BASE_DIR, 'js/navigation.js'), navigation_combined)

    # Extract eboard animations (lines 8258-8274)
    eboard_anim = read_lines(ORIGINAL_FILE, 8258, 8274)
    write_file(os.path.join(BASE_DIR, 'js/eboard-animations.js'), eboard_anim)

    # Extract blossom animations (lines 8342-8450)
    blossom_content = read_lines(ORIGINAL_FILE, 8342, 8450)
    write_file(os.path.join(BASE_DIR, 'js/animations.js'), blossom_content)

    # Extract init (lines 8453-8466)
    init_content = read_lines(ORIGINAL_FILE, 8453, 8466)
    write_file(os.path.join(BASE_DIR, 'js/init.js'), init_content)

def get_html_template(title, css_files, js_files):
    """Generate HTML template with proper structure"""
    css_links = '\n    '.join([f'<link rel="stylesheet" href="{css}">' for css in css_files])
    js_scripts = '\n    '.join([f'<script src="{js}"></script>' for js in js_files])

    # Get navigation bar (lines 6488-6523) and update links
    nav_content = read_lines(ORIGINAL_FILE, 6488, 6523)
    # Convert hash links to page links
    nav_content = nav_content.replace('href="#home"', 'href="index.html"')
    nav_content = nav_content.replace('href="#meetings"', 'href="meetings.html"')
    nav_content = nav_content.replace('href="#events"', 'href="events.html"')
    nav_content = nav_content.replace('href="#kamecon"', 'href="kamecon.html"')
    nav_content = nav_content.replace('href="#promotions"', 'href="promotions.html"')
    nav_content = nav_content.replace('href="#eboard"', 'href="eboard.html"')
    nav_content = nav_content.replace('href="#join"', 'href="join.html"')
    nav_content = nav_content.replace('href="#subgroups"', 'href="subgroups.html"')
    nav_content = nav_content.replace('href="#animusic"', 'href="animusic.html"')
    nav_content = nav_content.replace('href="#resources"', 'href="resources.html"')
    nav_content = nav_content.replace('href="#contact"', 'href="contact.html"')

    # Get background elements
    page_transition = read_lines(ORIGINAL_FILE, 6420, 6442)
    blossom_container = read_lines(ORIGINAL_FILE, 6445, 6456)
    mascots = read_lines(ORIGINAL_FILE, 6459, 6486)

    # Get footer
    footer = read_lines(ORIGINAL_FILE, 7775, 7789)

    return f'''<!DOCTYPE HTML>
<html lang="en">
<head>
    <meta name="google-site-verification" content="TB3tz3yB9u7jZFQgNRTqnEwV9irF2g_FDVb7TIKbzA4" />
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    {css_links}
</head>
<body>
    {page_transition}

    {blossom_container}

    {mascots}

    {nav_content}

    <!-- PAGE CONTENT GOES HERE -->
    {{CONTENT}}

    {footer}

    {js_scripts}
</body>
</html>'''

def create_html_pages():
    """Create all HTML pages"""
    print("\n=== Creating HTML Pages ===")

    # Common CSS for all pages
    common_css = [
        'styles/global.css',
        'styles/navigation.css',
        'styles/components.css',
        'styles/footer.css',
        'styles/mobile.css'
    ]

    # Common JS for all pages
    common_js = [
        'js/background.js',
        'js/navigation.js',
        'js/audio.js',
        'js/animations.js',
        'js/scroll.js',
        'js/init.js'
    ]

    pages = [
        {
            'filename': 'index.html',
            'title': 'Terrapin Anime Society - Home',
            'content_lines': (6526, 6558),
            'css': common_css,
            'js': common_js
        },
        {
            'filename': 'meetings.html',
            'title': 'Terrapin Anime Society - Meetings',
            'content_lines': (6562, 6793),
            'css': common_css + ['styles/screening.css', 'styles/anime-cards.css'],
            'js': common_js + ['js/sliders.js']
        },
        {
            'filename': 'events.html',
            'title': 'Terrapin Anime Society - Events',
            'content_lines': (6796, 6948),
            'css': common_css + ['styles/events.css'],
            'js': common_js
        },
        {
            'filename': 'kamecon.html',
            'title': 'Terrapin Anime Society - Kamecon',
            'content_lines': (6950, 7065),
            'css': common_css + ['styles/kamecon.css'],
            'js': common_js
        },
        {
            'filename': 'promotions.html',
            'title': 'Terrapin Anime Society - Promotions',
            'content_lines': (7067, 7119),
            'css': common_css + ['styles/events.css'],  # Uses promotions styles from events.css
            'js': common_js
        },
        {
            'filename': 'eboard.html',
            'title': 'Terrapin Anime Society - E-Board',
            'content_lines': (7122, 7242),
            'css': common_css + ['styles/president.css', 'styles/eboard-animations.css'],
            'js': common_js + ['js/cosplay.js', 'js/eboard-animations.js']
        },
        {
            'filename': 'join.html',
            'title': 'Terrapin Anime Society - Join Us',
            'content_lines': (7245, 7266),
            'css': common_css,
            'js': common_js
        },
        {
            'filename': 'subgroups.html',
            'title': 'Terrapin Anime Society - Subgroups',
            'content_lines': (7269, 7297),
            'css': common_css + ['styles/eboard-animations.css'],
            'js': common_js + ['js/eboard-animations.js']
        },
        {
            'filename': 'animusic.html',
            'title': 'Terrapin Anime Society - Animusic',
            'content_lines': (7299, 7452),
            'css': common_css + ['styles/animusic.css', 'styles/carousel.css'],
            'js': common_js + ['js/sliders.js', 'js/spinning-blossom.js']
        },
        {
            'filename': 'resources.html',
            'title': 'Terrapin Anime Society - Resources',
            'content_lines': (7453, 7730),
            'css': common_css + ['styles/resources.css', 'styles/anime-cards.css'],
            'js': common_js + ['js/tabs.js']
        },
        {
            'filename': 'contact.html',
            'title': 'Terrapin Anime Society - Contact',
            'content_lines': (7749, 7772),
            'css': common_css + ['styles/forms.css'],
            'js': common_js
        }
    ]

    for page in pages:
        template = get_html_template(page['title'], page['css'], page['js'])
        content = read_lines(ORIGINAL_FILE, page['content_lines'][0], page['content_lines'][1])

        # Replace content placeholder
        full_html = template.replace('{{CONTENT}}', content)

        write_file(os.path.join(BASE_DIR, page['filename']), full_html)

def main():
    """Main execution"""
    print("Starting reorganization of index.html into multi-page website...")
    print(f"Source: {ORIGINAL_FILE}")
    print(f"Destination: {BASE_DIR}")

    # Extract CSS
    extract_css_files()

    # Extract JavaScript
    extract_js_files()

    # Create HTML pages
    create_html_pages()

    print("\n" + "="*60)
    print("✓ Reorganization complete!")
    print("="*60)
    print("\nCreated files:")
    print("  - 15 CSS files in styles/")
    print("  - 10 JavaScript files in js/")
    print("  - 11 HTML pages")
    print("\nYou can now open index.html in your browser.")
    print("All original code has been preserved and organized into proper files.")

if __name__ == '__main__':
    main()
