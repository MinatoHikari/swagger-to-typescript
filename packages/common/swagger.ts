export interface SwaggerApiResult {
    swagger: string;
    basePath: string;
    host: string;
    tags: SwaggerTag[];
    paths: SwaggerPath;
    definitions: SwaggerDefinitions;
}

export interface SwaggerApiResources {
    location: string;
    name: string;
    swaggerVersion: string;
}

export type SwaggerParameter =
    | 'integer'
    | 'string'
    | 'file'
    | 'ref'
    | 'number'
    | 'boolean'
    | 'array';

export type SwaggerFormat =
    | 'int32'
    | 'int64'
    | 'float'
    | 'double'
    | 'byte'
    | 'binary'
    | 'date'
    | 'date-time'
    | 'password';

export type SwaggerTag = {
    name: string;
    description: string;
};

export type SwaggerMethod = {
    [method in 'post' | 'get' | 'put' | 'delete']: SwaggerMethodsProperty;
};

export type SwaggerMethodsProperty = {
    consumes: [string];
    description: string;
    operationId: string;
    parameters: SwaggerParams[];
    produces: string[];
    responses: SwaggerResponses;
    summary: string;
    tags: [string];
};

export type SwaggerParams = {
    description: string;
    format: SwaggerFormat;
    in: string;
    name: string;
    required: boolean;
    type?: SwaggerParameter;
    schema?: {
        $ref: string;
    };
    items?: {
        $ref?: string;
    };
};

export type SwaggerResponses = {
    [code: string]: {
        description: string;
        schema?: {
            $ref: string;
        };
    };
};

export type SwaggerPath = {
    [url: string]: SwaggerMethod;
};

export type SwaggerDefinition = {
    description: string;
    type: 'object';
    properties: {
        [key: string]: SwaggerDefinitionProperty;
    };
    required?: string[];
};

export type SwaggerDefinitionProperty = {
    type?: SwaggerParameter;
    description?: string;
    format?: SwaggerFormat;
    $ref?: string;
    items?: {
        $ref?: string;
    };
};

export type SwaggerDefinitions = {
    [key: string]: SwaggerDefinition;
};
