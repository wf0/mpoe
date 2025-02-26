import { VerticalAlign } from '../../dataset/enum/VerticalAlign';
import { TdBorder } from '../../dataset/enum/table/Table';
import { IElement, IElementPosition } from '../Element';
import { IRow } from '../Row';
export interface ITd {
    id?: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    colspan: number;
    rowspan: number;
    value: IElement[];
    isLastRowTd?: boolean;
    isLastColTd?: boolean;
    isLastTd?: boolean;
    rowIndex?: number;
    colIndex?: number;
    rowList?: IRow[];
    positionList?: IElementPosition[];
    verticalAlign?: VerticalAlign;
    backgroundColor?: string;
    borderType?: TdBorder;
    mainHeight?: number;
    realHeight?: number;
    realMinHeight?: number;
}
