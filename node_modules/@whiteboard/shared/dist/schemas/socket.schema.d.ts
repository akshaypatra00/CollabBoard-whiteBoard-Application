import { z } from 'zod';
export declare const JoinBoardSchema: z.ZodObject<{
    boardId: z.ZodString;
    clientId: z.ZodString;
    userName: z.ZodString;
    userColor: z.ZodString;
}, "strip", z.ZodTypeAny, {
    boardId: string;
    clientId: string;
    userName: string;
    userColor: string;
}, {
    boardId: string;
    clientId: string;
    userName: string;
    userColor: string;
}>;
export declare const ElementCreateEventSchema: z.ZodObject<{
    boardId: z.ZodString;
    element: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        id: z.ZodString;
        x: z.ZodNumber;
        y: z.ZodNumber;
        width: z.ZodNumber;
        height: z.ZodNumber;
        strokeColor: z.ZodDefault<z.ZodString>;
        fillColor: z.ZodDefault<z.ZodString>;
        strokeWidth: z.ZodDefault<z.ZodNumber>;
        strokeStyle: z.ZodDefault<z.ZodEnum<["solid", "dashed", "dotted"]>>;
        opacity: z.ZodDefault<z.ZodNumber>;
        rotation: z.ZodDefault<z.ZodNumber>;
        version: z.ZodDefault<z.ZodNumber>;
        updatedAt: z.ZodDefault<z.ZodNumber>;
        isDeleted: z.ZodOptional<z.ZodBoolean>;
    } & {
        type: z.ZodLiteral<"rectangle">;
        borderRadius: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        rotation: number;
        type: "rectangle";
        x: number;
        y: number;
        id: string;
        width: number;
        height: number;
        strokeColor: string;
        fillColor: string;
        strokeWidth: number;
        strokeStyle: "solid" | "dashed" | "dotted";
        opacity: number;
        version: number;
        updatedAt: number;
        isDeleted?: boolean | undefined;
        borderRadius?: number | undefined;
    }, {
        type: "rectangle";
        x: number;
        y: number;
        id: string;
        width: number;
        height: number;
        rotation?: number | undefined;
        strokeColor?: string | undefined;
        fillColor?: string | undefined;
        strokeWidth?: number | undefined;
        strokeStyle?: "solid" | "dashed" | "dotted" | undefined;
        opacity?: number | undefined;
        version?: number | undefined;
        updatedAt?: number | undefined;
        isDeleted?: boolean | undefined;
        borderRadius?: number | undefined;
    }>, z.ZodObject<{
        id: z.ZodString;
        x: z.ZodNumber;
        y: z.ZodNumber;
        width: z.ZodNumber;
        height: z.ZodNumber;
        strokeColor: z.ZodDefault<z.ZodString>;
        fillColor: z.ZodDefault<z.ZodString>;
        strokeWidth: z.ZodDefault<z.ZodNumber>;
        strokeStyle: z.ZodDefault<z.ZodEnum<["solid", "dashed", "dotted"]>>;
        opacity: z.ZodDefault<z.ZodNumber>;
        rotation: z.ZodDefault<z.ZodNumber>;
        version: z.ZodDefault<z.ZodNumber>;
        updatedAt: z.ZodDefault<z.ZodNumber>;
        isDeleted: z.ZodOptional<z.ZodBoolean>;
    } & {
        type: z.ZodLiteral<"ellipse">;
    }, "strip", z.ZodTypeAny, {
        rotation: number;
        type: "ellipse";
        x: number;
        y: number;
        id: string;
        width: number;
        height: number;
        strokeColor: string;
        fillColor: string;
        strokeWidth: number;
        strokeStyle: "solid" | "dashed" | "dotted";
        opacity: number;
        version: number;
        updatedAt: number;
        isDeleted?: boolean | undefined;
    }, {
        type: "ellipse";
        x: number;
        y: number;
        id: string;
        width: number;
        height: number;
        rotation?: number | undefined;
        strokeColor?: string | undefined;
        fillColor?: string | undefined;
        strokeWidth?: number | undefined;
        strokeStyle?: "solid" | "dashed" | "dotted" | undefined;
        opacity?: number | undefined;
        version?: number | undefined;
        updatedAt?: number | undefined;
        isDeleted?: boolean | undefined;
    }>, z.ZodObject<{
        id: z.ZodString;
        x: z.ZodNumber;
        y: z.ZodNumber;
        width: z.ZodNumber;
        height: z.ZodNumber;
        strokeColor: z.ZodDefault<z.ZodString>;
        fillColor: z.ZodDefault<z.ZodString>;
        strokeWidth: z.ZodDefault<z.ZodNumber>;
        strokeStyle: z.ZodDefault<z.ZodEnum<["solid", "dashed", "dotted"]>>;
        opacity: z.ZodDefault<z.ZodNumber>;
        rotation: z.ZodDefault<z.ZodNumber>;
        version: z.ZodDefault<z.ZodNumber>;
        updatedAt: z.ZodDefault<z.ZodNumber>;
        isDeleted: z.ZodOptional<z.ZodBoolean>;
    } & {
        type: z.ZodLiteral<"line">;
        points: z.ZodTuple<[z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            pressure: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
            pressure?: number | undefined;
        }, {
            x: number;
            y: number;
            pressure?: number | undefined;
        }>, z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            pressure: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
            pressure?: number | undefined;
        }, {
            x: number;
            y: number;
            pressure?: number | undefined;
        }>], null>;
    }, "strip", z.ZodTypeAny, {
        rotation: number;
        type: "line";
        x: number;
        y: number;
        id: string;
        width: number;
        height: number;
        strokeColor: string;
        fillColor: string;
        strokeWidth: number;
        strokeStyle: "solid" | "dashed" | "dotted";
        opacity: number;
        version: number;
        updatedAt: number;
        points: [{
            x: number;
            y: number;
            pressure?: number | undefined;
        }, {
            x: number;
            y: number;
            pressure?: number | undefined;
        }];
        isDeleted?: boolean | undefined;
    }, {
        type: "line";
        x: number;
        y: number;
        id: string;
        width: number;
        height: number;
        points: [{
            x: number;
            y: number;
            pressure?: number | undefined;
        }, {
            x: number;
            y: number;
            pressure?: number | undefined;
        }];
        rotation?: number | undefined;
        strokeColor?: string | undefined;
        fillColor?: string | undefined;
        strokeWidth?: number | undefined;
        strokeStyle?: "solid" | "dashed" | "dotted" | undefined;
        opacity?: number | undefined;
        version?: number | undefined;
        updatedAt?: number | undefined;
        isDeleted?: boolean | undefined;
    }>, z.ZodObject<{
        id: z.ZodString;
        x: z.ZodNumber;
        y: z.ZodNumber;
        width: z.ZodNumber;
        height: z.ZodNumber;
        strokeColor: z.ZodDefault<z.ZodString>;
        fillColor: z.ZodDefault<z.ZodString>;
        strokeWidth: z.ZodDefault<z.ZodNumber>;
        strokeStyle: z.ZodDefault<z.ZodEnum<["solid", "dashed", "dotted"]>>;
        opacity: z.ZodDefault<z.ZodNumber>;
        rotation: z.ZodDefault<z.ZodNumber>;
        version: z.ZodDefault<z.ZodNumber>;
        updatedAt: z.ZodDefault<z.ZodNumber>;
        isDeleted: z.ZodOptional<z.ZodBoolean>;
    } & {
        type: z.ZodLiteral<"arrow">;
        points: z.ZodTuple<[z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            pressure: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
            pressure?: number | undefined;
        }, {
            x: number;
            y: number;
            pressure?: number | undefined;
        }>, z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            pressure: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
            pressure?: number | undefined;
        }, {
            x: number;
            y: number;
            pressure?: number | undefined;
        }>], null>;
    }, "strip", z.ZodTypeAny, {
        rotation: number;
        type: "arrow";
        x: number;
        y: number;
        id: string;
        width: number;
        height: number;
        strokeColor: string;
        fillColor: string;
        strokeWidth: number;
        strokeStyle: "solid" | "dashed" | "dotted";
        opacity: number;
        version: number;
        updatedAt: number;
        points: [{
            x: number;
            y: number;
            pressure?: number | undefined;
        }, {
            x: number;
            y: number;
            pressure?: number | undefined;
        }];
        isDeleted?: boolean | undefined;
    }, {
        type: "arrow";
        x: number;
        y: number;
        id: string;
        width: number;
        height: number;
        points: [{
            x: number;
            y: number;
            pressure?: number | undefined;
        }, {
            x: number;
            y: number;
            pressure?: number | undefined;
        }];
        rotation?: number | undefined;
        strokeColor?: string | undefined;
        fillColor?: string | undefined;
        strokeWidth?: number | undefined;
        strokeStyle?: "solid" | "dashed" | "dotted" | undefined;
        opacity?: number | undefined;
        version?: number | undefined;
        updatedAt?: number | undefined;
        isDeleted?: boolean | undefined;
    }>, z.ZodObject<{
        id: z.ZodString;
        x: z.ZodNumber;
        y: z.ZodNumber;
        width: z.ZodNumber;
        height: z.ZodNumber;
        strokeColor: z.ZodDefault<z.ZodString>;
        fillColor: z.ZodDefault<z.ZodString>;
        strokeWidth: z.ZodDefault<z.ZodNumber>;
        strokeStyle: z.ZodDefault<z.ZodEnum<["solid", "dashed", "dotted"]>>;
        opacity: z.ZodDefault<z.ZodNumber>;
        rotation: z.ZodDefault<z.ZodNumber>;
        version: z.ZodDefault<z.ZodNumber>;
        updatedAt: z.ZodDefault<z.ZodNumber>;
        isDeleted: z.ZodOptional<z.ZodBoolean>;
    } & {
        type: z.ZodLiteral<"pencil">;
        points: z.ZodArray<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            pressure: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
            pressure?: number | undefined;
        }, {
            x: number;
            y: number;
            pressure?: number | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        rotation: number;
        type: "pencil";
        x: number;
        y: number;
        id: string;
        width: number;
        height: number;
        strokeColor: string;
        fillColor: string;
        strokeWidth: number;
        strokeStyle: "solid" | "dashed" | "dotted";
        opacity: number;
        version: number;
        updatedAt: number;
        points: {
            x: number;
            y: number;
            pressure?: number | undefined;
        }[];
        isDeleted?: boolean | undefined;
    }, {
        type: "pencil";
        x: number;
        y: number;
        id: string;
        width: number;
        height: number;
        points: {
            x: number;
            y: number;
            pressure?: number | undefined;
        }[];
        rotation?: number | undefined;
        strokeColor?: string | undefined;
        fillColor?: string | undefined;
        strokeWidth?: number | undefined;
        strokeStyle?: "solid" | "dashed" | "dotted" | undefined;
        opacity?: number | undefined;
        version?: number | undefined;
        updatedAt?: number | undefined;
        isDeleted?: boolean | undefined;
    }>, z.ZodObject<{
        id: z.ZodString;
        x: z.ZodNumber;
        y: z.ZodNumber;
        width: z.ZodNumber;
        height: z.ZodNumber;
        strokeColor: z.ZodDefault<z.ZodString>;
        fillColor: z.ZodDefault<z.ZodString>;
        strokeWidth: z.ZodDefault<z.ZodNumber>;
        strokeStyle: z.ZodDefault<z.ZodEnum<["solid", "dashed", "dotted"]>>;
        opacity: z.ZodDefault<z.ZodNumber>;
        rotation: z.ZodDefault<z.ZodNumber>;
        version: z.ZodDefault<z.ZodNumber>;
        updatedAt: z.ZodDefault<z.ZodNumber>;
        isDeleted: z.ZodOptional<z.ZodBoolean>;
    } & {
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
        fontSize: z.ZodDefault<z.ZodNumber>;
        fontFamily: z.ZodDefault<z.ZodString>;
        textAlign: z.ZodDefault<z.ZodEnum<["left", "center", "right"]>>;
    }, "strip", z.ZodTypeAny, {
        text: string;
        rotation: number;
        type: "text";
        x: number;
        y: number;
        id: string;
        width: number;
        height: number;
        strokeColor: string;
        fillColor: string;
        strokeWidth: number;
        strokeStyle: "solid" | "dashed" | "dotted";
        opacity: number;
        version: number;
        updatedAt: number;
        fontSize: number;
        fontFamily: string;
        textAlign: "left" | "center" | "right";
        isDeleted?: boolean | undefined;
    }, {
        text: string;
        type: "text";
        x: number;
        y: number;
        id: string;
        width: number;
        height: number;
        rotation?: number | undefined;
        strokeColor?: string | undefined;
        fillColor?: string | undefined;
        strokeWidth?: number | undefined;
        strokeStyle?: "solid" | "dashed" | "dotted" | undefined;
        opacity?: number | undefined;
        version?: number | undefined;
        updatedAt?: number | undefined;
        isDeleted?: boolean | undefined;
        fontSize?: number | undefined;
        fontFamily?: string | undefined;
        textAlign?: "left" | "center" | "right" | undefined;
    }>]>;
}, "strip", z.ZodTypeAny, {
    boardId: string;
    element: {
        rotation: number;
        type: "rectangle";
        x: number;
        y: number;
        id: string;
        width: number;
        height: number;
        strokeColor: string;
        fillColor: string;
        strokeWidth: number;
        strokeStyle: "solid" | "dashed" | "dotted";
        opacity: number;
        version: number;
        updatedAt: number;
        isDeleted?: boolean | undefined;
        borderRadius?: number | undefined;
    } | {
        rotation: number;
        type: "ellipse";
        x: number;
        y: number;
        id: string;
        width: number;
        height: number;
        strokeColor: string;
        fillColor: string;
        strokeWidth: number;
        strokeStyle: "solid" | "dashed" | "dotted";
        opacity: number;
        version: number;
        updatedAt: number;
        isDeleted?: boolean | undefined;
    } | {
        rotation: number;
        type: "line";
        x: number;
        y: number;
        id: string;
        width: number;
        height: number;
        strokeColor: string;
        fillColor: string;
        strokeWidth: number;
        strokeStyle: "solid" | "dashed" | "dotted";
        opacity: number;
        version: number;
        updatedAt: number;
        points: [{
            x: number;
            y: number;
            pressure?: number | undefined;
        }, {
            x: number;
            y: number;
            pressure?: number | undefined;
        }];
        isDeleted?: boolean | undefined;
    } | {
        rotation: number;
        type: "arrow";
        x: number;
        y: number;
        id: string;
        width: number;
        height: number;
        strokeColor: string;
        fillColor: string;
        strokeWidth: number;
        strokeStyle: "solid" | "dashed" | "dotted";
        opacity: number;
        version: number;
        updatedAt: number;
        points: [{
            x: number;
            y: number;
            pressure?: number | undefined;
        }, {
            x: number;
            y: number;
            pressure?: number | undefined;
        }];
        isDeleted?: boolean | undefined;
    } | {
        rotation: number;
        type: "pencil";
        x: number;
        y: number;
        id: string;
        width: number;
        height: number;
        strokeColor: string;
        fillColor: string;
        strokeWidth: number;
        strokeStyle: "solid" | "dashed" | "dotted";
        opacity: number;
        version: number;
        updatedAt: number;
        points: {
            x: number;
            y: number;
            pressure?: number | undefined;
        }[];
        isDeleted?: boolean | undefined;
    } | {
        text: string;
        rotation: number;
        type: "text";
        x: number;
        y: number;
        id: string;
        width: number;
        height: number;
        strokeColor: string;
        fillColor: string;
        strokeWidth: number;
        strokeStyle: "solid" | "dashed" | "dotted";
        opacity: number;
        version: number;
        updatedAt: number;
        fontSize: number;
        fontFamily: string;
        textAlign: "left" | "center" | "right";
        isDeleted?: boolean | undefined;
    };
}, {
    boardId: string;
    element: {
        type: "rectangle";
        x: number;
        y: number;
        id: string;
        width: number;
        height: number;
        rotation?: number | undefined;
        strokeColor?: string | undefined;
        fillColor?: string | undefined;
        strokeWidth?: number | undefined;
        strokeStyle?: "solid" | "dashed" | "dotted" | undefined;
        opacity?: number | undefined;
        version?: number | undefined;
        updatedAt?: number | undefined;
        isDeleted?: boolean | undefined;
        borderRadius?: number | undefined;
    } | {
        type: "ellipse";
        x: number;
        y: number;
        id: string;
        width: number;
        height: number;
        rotation?: number | undefined;
        strokeColor?: string | undefined;
        fillColor?: string | undefined;
        strokeWidth?: number | undefined;
        strokeStyle?: "solid" | "dashed" | "dotted" | undefined;
        opacity?: number | undefined;
        version?: number | undefined;
        updatedAt?: number | undefined;
        isDeleted?: boolean | undefined;
    } | {
        type: "line";
        x: number;
        y: number;
        id: string;
        width: number;
        height: number;
        points: [{
            x: number;
            y: number;
            pressure?: number | undefined;
        }, {
            x: number;
            y: number;
            pressure?: number | undefined;
        }];
        rotation?: number | undefined;
        strokeColor?: string | undefined;
        fillColor?: string | undefined;
        strokeWidth?: number | undefined;
        strokeStyle?: "solid" | "dashed" | "dotted" | undefined;
        opacity?: number | undefined;
        version?: number | undefined;
        updatedAt?: number | undefined;
        isDeleted?: boolean | undefined;
    } | {
        type: "arrow";
        x: number;
        y: number;
        id: string;
        width: number;
        height: number;
        points: [{
            x: number;
            y: number;
            pressure?: number | undefined;
        }, {
            x: number;
            y: number;
            pressure?: number | undefined;
        }];
        rotation?: number | undefined;
        strokeColor?: string | undefined;
        fillColor?: string | undefined;
        strokeWidth?: number | undefined;
        strokeStyle?: "solid" | "dashed" | "dotted" | undefined;
        opacity?: number | undefined;
        version?: number | undefined;
        updatedAt?: number | undefined;
        isDeleted?: boolean | undefined;
    } | {
        type: "pencil";
        x: number;
        y: number;
        id: string;
        width: number;
        height: number;
        points: {
            x: number;
            y: number;
            pressure?: number | undefined;
        }[];
        rotation?: number | undefined;
        strokeColor?: string | undefined;
        fillColor?: string | undefined;
        strokeWidth?: number | undefined;
        strokeStyle?: "solid" | "dashed" | "dotted" | undefined;
        opacity?: number | undefined;
        version?: number | undefined;
        updatedAt?: number | undefined;
        isDeleted?: boolean | undefined;
    } | {
        text: string;
        type: "text";
        x: number;
        y: number;
        id: string;
        width: number;
        height: number;
        rotation?: number | undefined;
        strokeColor?: string | undefined;
        fillColor?: string | undefined;
        strokeWidth?: number | undefined;
        strokeStyle?: "solid" | "dashed" | "dotted" | undefined;
        opacity?: number | undefined;
        version?: number | undefined;
        updatedAt?: number | undefined;
        isDeleted?: boolean | undefined;
        fontSize?: number | undefined;
        fontFamily?: string | undefined;
        textAlign?: "left" | "center" | "right" | undefined;
    };
}>;
export declare const ElementUpdateEventSchema: z.ZodObject<{
    boardId: z.ZodString;
    elements: z.ZodArray<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        id: z.ZodString;
        x: z.ZodNumber;
        y: z.ZodNumber;
        width: z.ZodNumber;
        height: z.ZodNumber;
        strokeColor: z.ZodDefault<z.ZodString>;
        fillColor: z.ZodDefault<z.ZodString>;
        strokeWidth: z.ZodDefault<z.ZodNumber>;
        strokeStyle: z.ZodDefault<z.ZodEnum<["solid", "dashed", "dotted"]>>;
        opacity: z.ZodDefault<z.ZodNumber>;
        rotation: z.ZodDefault<z.ZodNumber>;
        version: z.ZodDefault<z.ZodNumber>;
        updatedAt: z.ZodDefault<z.ZodNumber>;
        isDeleted: z.ZodOptional<z.ZodBoolean>;
    } & {
        type: z.ZodLiteral<"rectangle">;
        borderRadius: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        rotation: number;
        type: "rectangle";
        x: number;
        y: number;
        id: string;
        width: number;
        height: number;
        strokeColor: string;
        fillColor: string;
        strokeWidth: number;
        strokeStyle: "solid" | "dashed" | "dotted";
        opacity: number;
        version: number;
        updatedAt: number;
        isDeleted?: boolean | undefined;
        borderRadius?: number | undefined;
    }, {
        type: "rectangle";
        x: number;
        y: number;
        id: string;
        width: number;
        height: number;
        rotation?: number | undefined;
        strokeColor?: string | undefined;
        fillColor?: string | undefined;
        strokeWidth?: number | undefined;
        strokeStyle?: "solid" | "dashed" | "dotted" | undefined;
        opacity?: number | undefined;
        version?: number | undefined;
        updatedAt?: number | undefined;
        isDeleted?: boolean | undefined;
        borderRadius?: number | undefined;
    }>, z.ZodObject<{
        id: z.ZodString;
        x: z.ZodNumber;
        y: z.ZodNumber;
        width: z.ZodNumber;
        height: z.ZodNumber;
        strokeColor: z.ZodDefault<z.ZodString>;
        fillColor: z.ZodDefault<z.ZodString>;
        strokeWidth: z.ZodDefault<z.ZodNumber>;
        strokeStyle: z.ZodDefault<z.ZodEnum<["solid", "dashed", "dotted"]>>;
        opacity: z.ZodDefault<z.ZodNumber>;
        rotation: z.ZodDefault<z.ZodNumber>;
        version: z.ZodDefault<z.ZodNumber>;
        updatedAt: z.ZodDefault<z.ZodNumber>;
        isDeleted: z.ZodOptional<z.ZodBoolean>;
    } & {
        type: z.ZodLiteral<"ellipse">;
    }, "strip", z.ZodTypeAny, {
        rotation: number;
        type: "ellipse";
        x: number;
        y: number;
        id: string;
        width: number;
        height: number;
        strokeColor: string;
        fillColor: string;
        strokeWidth: number;
        strokeStyle: "solid" | "dashed" | "dotted";
        opacity: number;
        version: number;
        updatedAt: number;
        isDeleted?: boolean | undefined;
    }, {
        type: "ellipse";
        x: number;
        y: number;
        id: string;
        width: number;
        height: number;
        rotation?: number | undefined;
        strokeColor?: string | undefined;
        fillColor?: string | undefined;
        strokeWidth?: number | undefined;
        strokeStyle?: "solid" | "dashed" | "dotted" | undefined;
        opacity?: number | undefined;
        version?: number | undefined;
        updatedAt?: number | undefined;
        isDeleted?: boolean | undefined;
    }>, z.ZodObject<{
        id: z.ZodString;
        x: z.ZodNumber;
        y: z.ZodNumber;
        width: z.ZodNumber;
        height: z.ZodNumber;
        strokeColor: z.ZodDefault<z.ZodString>;
        fillColor: z.ZodDefault<z.ZodString>;
        strokeWidth: z.ZodDefault<z.ZodNumber>;
        strokeStyle: z.ZodDefault<z.ZodEnum<["solid", "dashed", "dotted"]>>;
        opacity: z.ZodDefault<z.ZodNumber>;
        rotation: z.ZodDefault<z.ZodNumber>;
        version: z.ZodDefault<z.ZodNumber>;
        updatedAt: z.ZodDefault<z.ZodNumber>;
        isDeleted: z.ZodOptional<z.ZodBoolean>;
    } & {
        type: z.ZodLiteral<"line">;
        points: z.ZodTuple<[z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            pressure: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
            pressure?: number | undefined;
        }, {
            x: number;
            y: number;
            pressure?: number | undefined;
        }>, z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            pressure: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
            pressure?: number | undefined;
        }, {
            x: number;
            y: number;
            pressure?: number | undefined;
        }>], null>;
    }, "strip", z.ZodTypeAny, {
        rotation: number;
        type: "line";
        x: number;
        y: number;
        id: string;
        width: number;
        height: number;
        strokeColor: string;
        fillColor: string;
        strokeWidth: number;
        strokeStyle: "solid" | "dashed" | "dotted";
        opacity: number;
        version: number;
        updatedAt: number;
        points: [{
            x: number;
            y: number;
            pressure?: number | undefined;
        }, {
            x: number;
            y: number;
            pressure?: number | undefined;
        }];
        isDeleted?: boolean | undefined;
    }, {
        type: "line";
        x: number;
        y: number;
        id: string;
        width: number;
        height: number;
        points: [{
            x: number;
            y: number;
            pressure?: number | undefined;
        }, {
            x: number;
            y: number;
            pressure?: number | undefined;
        }];
        rotation?: number | undefined;
        strokeColor?: string | undefined;
        fillColor?: string | undefined;
        strokeWidth?: number | undefined;
        strokeStyle?: "solid" | "dashed" | "dotted" | undefined;
        opacity?: number | undefined;
        version?: number | undefined;
        updatedAt?: number | undefined;
        isDeleted?: boolean | undefined;
    }>, z.ZodObject<{
        id: z.ZodString;
        x: z.ZodNumber;
        y: z.ZodNumber;
        width: z.ZodNumber;
        height: z.ZodNumber;
        strokeColor: z.ZodDefault<z.ZodString>;
        fillColor: z.ZodDefault<z.ZodString>;
        strokeWidth: z.ZodDefault<z.ZodNumber>;
        strokeStyle: z.ZodDefault<z.ZodEnum<["solid", "dashed", "dotted"]>>;
        opacity: z.ZodDefault<z.ZodNumber>;
        rotation: z.ZodDefault<z.ZodNumber>;
        version: z.ZodDefault<z.ZodNumber>;
        updatedAt: z.ZodDefault<z.ZodNumber>;
        isDeleted: z.ZodOptional<z.ZodBoolean>;
    } & {
        type: z.ZodLiteral<"arrow">;
        points: z.ZodTuple<[z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            pressure: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
            pressure?: number | undefined;
        }, {
            x: number;
            y: number;
            pressure?: number | undefined;
        }>, z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            pressure: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
            pressure?: number | undefined;
        }, {
            x: number;
            y: number;
            pressure?: number | undefined;
        }>], null>;
    }, "strip", z.ZodTypeAny, {
        rotation: number;
        type: "arrow";
        x: number;
        y: number;
        id: string;
        width: number;
        height: number;
        strokeColor: string;
        fillColor: string;
        strokeWidth: number;
        strokeStyle: "solid" | "dashed" | "dotted";
        opacity: number;
        version: number;
        updatedAt: number;
        points: [{
            x: number;
            y: number;
            pressure?: number | undefined;
        }, {
            x: number;
            y: number;
            pressure?: number | undefined;
        }];
        isDeleted?: boolean | undefined;
    }, {
        type: "arrow";
        x: number;
        y: number;
        id: string;
        width: number;
        height: number;
        points: [{
            x: number;
            y: number;
            pressure?: number | undefined;
        }, {
            x: number;
            y: number;
            pressure?: number | undefined;
        }];
        rotation?: number | undefined;
        strokeColor?: string | undefined;
        fillColor?: string | undefined;
        strokeWidth?: number | undefined;
        strokeStyle?: "solid" | "dashed" | "dotted" | undefined;
        opacity?: number | undefined;
        version?: number | undefined;
        updatedAt?: number | undefined;
        isDeleted?: boolean | undefined;
    }>, z.ZodObject<{
        id: z.ZodString;
        x: z.ZodNumber;
        y: z.ZodNumber;
        width: z.ZodNumber;
        height: z.ZodNumber;
        strokeColor: z.ZodDefault<z.ZodString>;
        fillColor: z.ZodDefault<z.ZodString>;
        strokeWidth: z.ZodDefault<z.ZodNumber>;
        strokeStyle: z.ZodDefault<z.ZodEnum<["solid", "dashed", "dotted"]>>;
        opacity: z.ZodDefault<z.ZodNumber>;
        rotation: z.ZodDefault<z.ZodNumber>;
        version: z.ZodDefault<z.ZodNumber>;
        updatedAt: z.ZodDefault<z.ZodNumber>;
        isDeleted: z.ZodOptional<z.ZodBoolean>;
    } & {
        type: z.ZodLiteral<"pencil">;
        points: z.ZodArray<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            pressure: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
            pressure?: number | undefined;
        }, {
            x: number;
            y: number;
            pressure?: number | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        rotation: number;
        type: "pencil";
        x: number;
        y: number;
        id: string;
        width: number;
        height: number;
        strokeColor: string;
        fillColor: string;
        strokeWidth: number;
        strokeStyle: "solid" | "dashed" | "dotted";
        opacity: number;
        version: number;
        updatedAt: number;
        points: {
            x: number;
            y: number;
            pressure?: number | undefined;
        }[];
        isDeleted?: boolean | undefined;
    }, {
        type: "pencil";
        x: number;
        y: number;
        id: string;
        width: number;
        height: number;
        points: {
            x: number;
            y: number;
            pressure?: number | undefined;
        }[];
        rotation?: number | undefined;
        strokeColor?: string | undefined;
        fillColor?: string | undefined;
        strokeWidth?: number | undefined;
        strokeStyle?: "solid" | "dashed" | "dotted" | undefined;
        opacity?: number | undefined;
        version?: number | undefined;
        updatedAt?: number | undefined;
        isDeleted?: boolean | undefined;
    }>, z.ZodObject<{
        id: z.ZodString;
        x: z.ZodNumber;
        y: z.ZodNumber;
        width: z.ZodNumber;
        height: z.ZodNumber;
        strokeColor: z.ZodDefault<z.ZodString>;
        fillColor: z.ZodDefault<z.ZodString>;
        strokeWidth: z.ZodDefault<z.ZodNumber>;
        strokeStyle: z.ZodDefault<z.ZodEnum<["solid", "dashed", "dotted"]>>;
        opacity: z.ZodDefault<z.ZodNumber>;
        rotation: z.ZodDefault<z.ZodNumber>;
        version: z.ZodDefault<z.ZodNumber>;
        updatedAt: z.ZodDefault<z.ZodNumber>;
        isDeleted: z.ZodOptional<z.ZodBoolean>;
    } & {
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
        fontSize: z.ZodDefault<z.ZodNumber>;
        fontFamily: z.ZodDefault<z.ZodString>;
        textAlign: z.ZodDefault<z.ZodEnum<["left", "center", "right"]>>;
    }, "strip", z.ZodTypeAny, {
        text: string;
        rotation: number;
        type: "text";
        x: number;
        y: number;
        id: string;
        width: number;
        height: number;
        strokeColor: string;
        fillColor: string;
        strokeWidth: number;
        strokeStyle: "solid" | "dashed" | "dotted";
        opacity: number;
        version: number;
        updatedAt: number;
        fontSize: number;
        fontFamily: string;
        textAlign: "left" | "center" | "right";
        isDeleted?: boolean | undefined;
    }, {
        text: string;
        type: "text";
        x: number;
        y: number;
        id: string;
        width: number;
        height: number;
        rotation?: number | undefined;
        strokeColor?: string | undefined;
        fillColor?: string | undefined;
        strokeWidth?: number | undefined;
        strokeStyle?: "solid" | "dashed" | "dotted" | undefined;
        opacity?: number | undefined;
        version?: number | undefined;
        updatedAt?: number | undefined;
        isDeleted?: boolean | undefined;
        fontSize?: number | undefined;
        fontFamily?: string | undefined;
        textAlign?: "left" | "center" | "right" | undefined;
    }>]>, "many">;
}, "strip", z.ZodTypeAny, {
    elements: ({
        rotation: number;
        type: "rectangle";
        x: number;
        y: number;
        id: string;
        width: number;
        height: number;
        strokeColor: string;
        fillColor: string;
        strokeWidth: number;
        strokeStyle: "solid" | "dashed" | "dotted";
        opacity: number;
        version: number;
        updatedAt: number;
        isDeleted?: boolean | undefined;
        borderRadius?: number | undefined;
    } | {
        rotation: number;
        type: "ellipse";
        x: number;
        y: number;
        id: string;
        width: number;
        height: number;
        strokeColor: string;
        fillColor: string;
        strokeWidth: number;
        strokeStyle: "solid" | "dashed" | "dotted";
        opacity: number;
        version: number;
        updatedAt: number;
        isDeleted?: boolean | undefined;
    } | {
        rotation: number;
        type: "line";
        x: number;
        y: number;
        id: string;
        width: number;
        height: number;
        strokeColor: string;
        fillColor: string;
        strokeWidth: number;
        strokeStyle: "solid" | "dashed" | "dotted";
        opacity: number;
        version: number;
        updatedAt: number;
        points: [{
            x: number;
            y: number;
            pressure?: number | undefined;
        }, {
            x: number;
            y: number;
            pressure?: number | undefined;
        }];
        isDeleted?: boolean | undefined;
    } | {
        rotation: number;
        type: "arrow";
        x: number;
        y: number;
        id: string;
        width: number;
        height: number;
        strokeColor: string;
        fillColor: string;
        strokeWidth: number;
        strokeStyle: "solid" | "dashed" | "dotted";
        opacity: number;
        version: number;
        updatedAt: number;
        points: [{
            x: number;
            y: number;
            pressure?: number | undefined;
        }, {
            x: number;
            y: number;
            pressure?: number | undefined;
        }];
        isDeleted?: boolean | undefined;
    } | {
        rotation: number;
        type: "pencil";
        x: number;
        y: number;
        id: string;
        width: number;
        height: number;
        strokeColor: string;
        fillColor: string;
        strokeWidth: number;
        strokeStyle: "solid" | "dashed" | "dotted";
        opacity: number;
        version: number;
        updatedAt: number;
        points: {
            x: number;
            y: number;
            pressure?: number | undefined;
        }[];
        isDeleted?: boolean | undefined;
    } | {
        text: string;
        rotation: number;
        type: "text";
        x: number;
        y: number;
        id: string;
        width: number;
        height: number;
        strokeColor: string;
        fillColor: string;
        strokeWidth: number;
        strokeStyle: "solid" | "dashed" | "dotted";
        opacity: number;
        version: number;
        updatedAt: number;
        fontSize: number;
        fontFamily: string;
        textAlign: "left" | "center" | "right";
        isDeleted?: boolean | undefined;
    })[];
    boardId: string;
}, {
    elements: ({
        type: "rectangle";
        x: number;
        y: number;
        id: string;
        width: number;
        height: number;
        rotation?: number | undefined;
        strokeColor?: string | undefined;
        fillColor?: string | undefined;
        strokeWidth?: number | undefined;
        strokeStyle?: "solid" | "dashed" | "dotted" | undefined;
        opacity?: number | undefined;
        version?: number | undefined;
        updatedAt?: number | undefined;
        isDeleted?: boolean | undefined;
        borderRadius?: number | undefined;
    } | {
        type: "ellipse";
        x: number;
        y: number;
        id: string;
        width: number;
        height: number;
        rotation?: number | undefined;
        strokeColor?: string | undefined;
        fillColor?: string | undefined;
        strokeWidth?: number | undefined;
        strokeStyle?: "solid" | "dashed" | "dotted" | undefined;
        opacity?: number | undefined;
        version?: number | undefined;
        updatedAt?: number | undefined;
        isDeleted?: boolean | undefined;
    } | {
        type: "line";
        x: number;
        y: number;
        id: string;
        width: number;
        height: number;
        points: [{
            x: number;
            y: number;
            pressure?: number | undefined;
        }, {
            x: number;
            y: number;
            pressure?: number | undefined;
        }];
        rotation?: number | undefined;
        strokeColor?: string | undefined;
        fillColor?: string | undefined;
        strokeWidth?: number | undefined;
        strokeStyle?: "solid" | "dashed" | "dotted" | undefined;
        opacity?: number | undefined;
        version?: number | undefined;
        updatedAt?: number | undefined;
        isDeleted?: boolean | undefined;
    } | {
        type: "arrow";
        x: number;
        y: number;
        id: string;
        width: number;
        height: number;
        points: [{
            x: number;
            y: number;
            pressure?: number | undefined;
        }, {
            x: number;
            y: number;
            pressure?: number | undefined;
        }];
        rotation?: number | undefined;
        strokeColor?: string | undefined;
        fillColor?: string | undefined;
        strokeWidth?: number | undefined;
        strokeStyle?: "solid" | "dashed" | "dotted" | undefined;
        opacity?: number | undefined;
        version?: number | undefined;
        updatedAt?: number | undefined;
        isDeleted?: boolean | undefined;
    } | {
        type: "pencil";
        x: number;
        y: number;
        id: string;
        width: number;
        height: number;
        points: {
            x: number;
            y: number;
            pressure?: number | undefined;
        }[];
        rotation?: number | undefined;
        strokeColor?: string | undefined;
        fillColor?: string | undefined;
        strokeWidth?: number | undefined;
        strokeStyle?: "solid" | "dashed" | "dotted" | undefined;
        opacity?: number | undefined;
        version?: number | undefined;
        updatedAt?: number | undefined;
        isDeleted?: boolean | undefined;
    } | {
        text: string;
        type: "text";
        x: number;
        y: number;
        id: string;
        width: number;
        height: number;
        rotation?: number | undefined;
        strokeColor?: string | undefined;
        fillColor?: string | undefined;
        strokeWidth?: number | undefined;
        strokeStyle?: "solid" | "dashed" | "dotted" | undefined;
        opacity?: number | undefined;
        version?: number | undefined;
        updatedAt?: number | undefined;
        isDeleted?: boolean | undefined;
        fontSize?: number | undefined;
        fontFamily?: string | undefined;
        textAlign?: "left" | "center" | "right" | undefined;
    })[];
    boardId: string;
}>;
export declare const ElementDeleteEventSchema: z.ZodObject<{
    boardId: z.ZodString;
    elementIds: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    boardId: string;
    elementIds: string[];
}, {
    boardId: string;
    elementIds: string[];
}>;
export declare const BoardClearEventSchema: z.ZodObject<{
    boardId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    boardId: string;
}, {
    boardId: string;
}>;
export declare const BoardMetadataUpdateEventSchema: z.ZodObject<{
    boardId: z.ZodString;
    title: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title: string;
    boardId: string;
}, {
    title: string;
    boardId: string;
}>;
export declare const CursorMoveEventSchema: z.ZodObject<{
    boardId: z.ZodString;
    clientId: z.ZodString;
    userName: z.ZodString;
    userColor: z.ZodString;
    x: z.ZodNumber;
    y: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    x: number;
    y: number;
    boardId: string;
    clientId: string;
    userName: string;
    userColor: string;
}, {
    x: number;
    y: number;
    boardId: string;
    clientId: string;
    userName: string;
    userColor: string;
}>;
//# sourceMappingURL=socket.schema.d.ts.map