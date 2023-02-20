//
export function trimQuate(item: string, quate = `'`): string {
  if (item.indexOf(quate) > -1) {
    return item.substring(item.indexOf(quate) + 1, item.lastIndexOf(quate));
  } else {
    return item;
  }
}

export function snakeToCamelCase(snake: string) {
  return snake.replace(/(_\w)/g, m => {
    return m[1].toUpperCase();
  });
}

export function snakeToPascalCase(snake: string) {
  const camel = snakeToCamelCase(snake);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

export function hasZenkaku(item: string) {
  if (!item.match(/^(\w| |'|,|&)+$/)) return true;
  return false;
}
