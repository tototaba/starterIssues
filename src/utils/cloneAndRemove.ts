/**
 * Clone an array or object and remove an item
 *
 * @param prev the array or object to clone
 * @param item the item or key to remove
 *
 * @todo improve typing
 */
export function cloneAndRemove<T>(prev: T[] | any, item: T) {
  if (Array.isArray(prev)) {
    const index = prev.indexOf(item);
    const newArray = [...prev];

    if (index > -1) newArray.splice(index, 1);

    return newArray;
  } else {
    const cloned = { ...prev };

    delete cloned[item];

    return cloned;
  }
}

export default cloneAndRemove;
