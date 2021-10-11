declare module "@carbon/icons/es/*" {
    export interface Attributes {
        xmlns: string;
        viewBox: string;
        fill: string;
        width: number;
        height: number;
    }

    export interface SVGAttribute {
        d: string;
    }

    export interface Content {
        elem: string;
        attrs: SVGAttribute;
    }

    export interface IconDefinition {
        elem: string;
        attrs: Attributes;
        content: Content[];
        name: string;
        size: number;
    }

    const icon: IconDefinition;
    export default icon;
}
