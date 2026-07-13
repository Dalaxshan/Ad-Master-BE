import sanitizeHtml from 'sanitize-html';

export function sanitizeRichText(dirty: string): string {
  return sanitizeHtml(dirty, {
    allowedTags: [
      'p',
      'br',
      'strong',
      'em',
      's',
      'u',
      'blockquote',
      'ul',
      'ol',
      'li',
      'h1',
      'h2',
      'h3',
      'a',
      'code',
      'pre',
    ],
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    exclusiveFilter: (frame) => {
      return (
        frame.tag === 'p' && !frame.text.trim() && !frame.mediaChildren?.length
      );
    },
  });
}
