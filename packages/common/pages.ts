export type HomeListItem = {
    type: 'default' | 'edit';
    key: `${number}`;
    name: string;
    source: string;
};
