import * as Y from 'yjs';
import { IKeydown, IRangeStyle, IYdocEventObserve } from '../../interface/Websocket';
import { EventBus } from '../event/eventbus/EventBus';
import { EventBusMap } from '../../interface/EventBus';
import { Command } from '../command/Command';
import { IEditorData } from '../../interface/Editor';
export declare class Ydoc extends EventBus<EventBusMap> {
    private ydoc;
    private ymap;
    private provider;
    private connect;
    private url;
    private roomname;
    private command;
    private userid;
    private color;
    constructor(url: string, roomname: string, userid: string, command: Command, color?: string);
    YMapObserve({ changes }: Y.YMapEvent<unknown>, Transaction: Y.Transaction): void;
    disConnection(): void;
    userInitEditor(username: string, userid: string): void;
    setUserRange(payload: IYdocEventObserve): void;
    canvasDestroy(): void;
    collectUserInput(data: IEditorData): void;
    keydownHandle(payload: IKeydown): void;
    rangeStyleChange(payload: IRangeStyle): void;
}
