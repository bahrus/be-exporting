import {IBE} from 'be-enhanced/types.js';
import { ActionOnEventConfigs } from "trans-render/froop/types";

export interface EndUserProps extends IBE{
    of?: Array<OfStatement>;
    Of?: Array<OfStatement>;
}

export interface AllProps extends EndUserProps{
    isParsed?: boolean,
    exportingRules?: Array<ExportingRule>;
}

export type AP = AllProps;

export type PAP = Partial<AP>;

export type ProPAP = Promise<PAP>;

export type POA = [PAP | undefined, ActionOnEventConfigs<PAP, Actions>];

export interface Actions{

}

export type OfStatement = string;

export interface ExportingRule {
    eventName: string
}