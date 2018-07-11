export type Work = {
    id: number;
    userId: number;
    tags?: [string];
    createdAt: number;
    title: string
    imageUris?: [string]
    description: string
};
