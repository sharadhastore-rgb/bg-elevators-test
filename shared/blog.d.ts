export function validateBlog(
  input: Record<string, unknown>,
): Record<string, string>;
export function contentBlocks(content: string): {
  body: any[];
  headings: any[];
};
export function publicBlog(post: any): any;
