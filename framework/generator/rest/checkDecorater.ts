import { MetaClass } from './MetaClass';
import { distinctArray, duplicateInArray } from './common';

/**
 * ミスチェック
 * @param classes
 */
export function checkDecorater(classes: MetaClass[]) {
  const methods: string[] = [];
  classes.forEach((c) => {
    c.hasErrorInDecorator();

    if (c.hasRestMetod) {
      c.methods.forEach((m) => methods.push(`uri:${m.uri}:method:${m.httpMethod}`));
    }
  });

  const dupMethod = distinctArray(duplicateInArray(methods));
  if (dupMethod.length > 0) {
    console.error('-------------------------');
    console.error('Error!! uriとhttpmethodの組み合わせに重複があります。');
    console.error(dupMethod);
    console.error('-------------------------');
  }
}
