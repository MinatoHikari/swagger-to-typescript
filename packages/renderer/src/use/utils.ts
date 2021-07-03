export const useUtils = () => {
    const getDefinitionName = ($ref: string) => {
        if (!$ref) return '';
        const arr = $ref.split('/');
        return arr[arr.length - 1];
    };

    return {
        getDefinitionName,
    };
};
