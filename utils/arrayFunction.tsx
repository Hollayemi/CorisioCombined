export const removeOrAddToArray = <T,>(
    item: T | T[],
    array: T[],
    func: (updatedArray: T[]) => void,
    itemIsArray?: boolean
): void => {
    if (
        array.includes(item as T) ||
        isArraySubset(item as T[], array, itemIsArray = false )
    ) {
        const newItem = array.filter((x) =>
            itemIsArray ? (item as T[]).includes(x) : x !== item
        );
        func(newItem);
    } else {
        if (itemIsArray) {
            func([...array, ...(item as T[])]);
        } else {
            func([...array, item as T]);
        }
    }
};

export const isArraySubset = <T,>(
    subsetArray: T[] = [],
    supersetArray: T[] = [],
    itemIsArray: boolean
): boolean => {
    return (
        itemIsArray && subsetArray.every((item) => supersetArray.includes(item))
    );
};

export const getCommonValuesInArrays = <T,>(...arrays: T[][]): T[] => {
    if (arrays.length === 0) {
        return [];
    }

    // Use reduce to iteratively find common values
    const commonValues = arrays.reduce((accumulator, currentArray) => {
        return accumulator.filter((value) => currentArray.includes(value));
    });

    return commonValues;
};
