/* eslint import/prefer-default-export: off, import/no-mutable-exports: off */
import { URL } from 'url';
import path from 'path';

export default function resolveHtmlPath(htmlFileName) {
  const port = process.env.PORT || 1212;
  if (process.env.NODE_ENV === 'development') {
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  } else {
    return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
  }
}
