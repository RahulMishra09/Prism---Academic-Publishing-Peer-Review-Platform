/**
 * A simple JATS XML to HTML converter for rendering article body content.
 * Note: In a real app, this would use a robust XML parser or XSLT.
 */
export function jatsToHtml(xmlText: string): string {
    if (!xmlText) return '';

    // Simple regex-based replacements for demonstration purposes.
    let html = xmlText;

    // Replace <sec> and <title>
    html = html.replace(/<sec[^>]*>/g, '<section class="mb-8">');
    html = html.replace(/<\/sec>/g, '</section>');
    html = html.replace(/<title>/g, '<h2 class="text-xl font-bold text-lumex-text mb-4 mt-6">');
    html = html.replace(/<\/title>/g, '</h2>');

    // Replace <p>
    html = html.replace(/<p>/g, '<p class="text-lumex-text leading-relaxed mb-4">');
    html = html.replace(/<\/p>/g, '</p>');

    // Replace <italic>, <bold>, <sub>, <sup>
    html = html.replace(/<italic>/g, '<em>');
    html = html.replace(/<\/italic>/g, '</em>');
    html = html.replace(/<bold>/g, '<strong>');
    html = html.replace(/<\/bold>/g, '</strong>');

    // Clean up XML declaration and root tag if present
    html = html.replace(/<\?xml[^>]*\?>/g, '');
    html = html.replace(/<article[^>]*>/g, '');
    html = html.replace(/<\/article>/g, '');
    html = html.replace(/<body>/g, '');
    html = html.replace(/<\/body>/g, '');

    return html.trim();
}
