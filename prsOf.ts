import {AP, ProPAP, PAP, ExportingRule} from './types';
import {RegExpOrRegExpExt} from 'be-enhanced/types';
import {arr, tryParse} from 'be-enhanced/cpu.js';

const reOfExportingStatement: Array<RegExpOrRegExpExt<Partial<ExportingRule>>> = [
    {
        regExp: new RegExp(String.raw `^(?<eventName>[\w]+)`),
        defaultVals: {}
    }
];

export function prsOf(self: AP) : Array<ExportingRule> {
    const {Of, of} = self;
    const both = [...(Of || []), ...(of || [])];
    const exportingRules: Array<ExportingRule> = [];
    for(const ofStatement of both){
        const test = tryParse(ofStatement, reOfExportingStatement) as ExportingRule;
        if(test === null) throw 'PE';
        const {eventName} = test;
        exportingRules.push(test);
    }
    return exportingRules;
}