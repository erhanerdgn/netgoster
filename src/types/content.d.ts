declare module '*.md' {
  const content: import('@/lib/content').ContentModule;
  export default content;
}
